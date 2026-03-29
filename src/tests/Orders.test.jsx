import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProcessOrder from '../pages/ProcessOrder';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- Mocks ---
/** Mock the API client for fetching items/orders and submitting transactions. */
vi.mock('../api/axios');

/** Mock toast notifications to verify success and error messaging. */
vi.mock('react-hot-toast');

/**
 * Test suite for the ProcessOrder Component.
 * Verifies the ability to select inventory, validate stock quantities, 
 * submit new orders, handle server errors, and view recent transaction history.
 */
describe('ProcessOrder Component', () => {
    let user;

    /** @type {Array<Object>} Mocked inventory items available for ordering. */
    const mockItems = [
        { id: 1, name: 'Widget A', quantity: 10 },
        { id: 2, name: 'Widget B', quantity: 0 }, // Out of stock
    ];

    /** @type {Array<Object>} Mocked historical order data. */
    const mockOrders = [
        {
            id: 101,
            item: 1,
            item_name: 'Widget A',
            quantity_ordered: 2,
            created_at: new Date().toISOString(), // Today
            processed_by_username: 'admin'
        },
        {
            id: 102,
            item: 1,
            item_name: 'Widget A',
            quantity_ordered: 5,
            created_at: '2020-01-01T10:00:00Z', // Old order (should be filtered out)
            processed_by_username: 'admin'
        }
    ];

    /**
     * Setup before each test.
     * Initializes userEvent and configures default successful responses
     * for the items and orders API endpoints.
     */
    beforeEach(() => {
        user = userEvent.setup();
        // Default successful GET mocks
        api.get.mockImplementation((url) => {
            if (url === 'items/') return Promise.resolve({ data: mockItems });
            if (url === 'orders/') return Promise.resolve({ data: mockOrders });
            return Promise.reject(new Error('Unknown API call'));
        });
    });

    /**
     * Cleanup after each test.
     * Clears mock history to prevent state leakage between tests.
     */
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders inventory items and filters recent orders (last 7 days)', async () => {
        render(<ProcessOrder />);

        // Check if items are loaded into the select dropdown
        await waitFor(() => {
            expect(screen.getByText('Widget A (10 available)')).toBeInTheDocument();
        });
        
        // Widget B should be disabled because it's out of stock
        const outOfStockOption = screen.getByText('Widget B (Out of Stock)');
        expect(outOfStockOption).toBeDisabled();

        // Check if only the recent order (Today) is displayed in the table
        expect(screen.getByText('1 Transactions')).toBeInTheDocument();
        expect(screen.getByText('Widget A')).toBeInTheDocument();
        expect(screen.queryByText('Item ID: 102')).not.toBeInTheDocument();
    });

    it('validates quantity against available stock', async () => {
        render(<ProcessOrder />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox');
        const quantityInput = screen.getByPlaceholderText('1');
        const submitButton = screen.getByRole('button', { name: /complete transaction/i });

        // Select Widget A (Stock: 10)
        await user.selectOptions(select, '1');

        // Type quantity 15 (Over stock)
        await user.type(quantityInput, '15');

        // Check validation UI prevents submission
        expect(screen.getByText(/cannot order more than available stock/i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    it('submits a new order successfully and refreshes data', async () => {
        // 1. Add a small delay to the mock implementation to allow testing the loading state
        api.post.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve({ data: { message: 'Success' } }), 50))
        );

        render(<ProcessOrder />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // Fill out form
        await user.selectOptions(screen.getByRole('combobox'), '1');
        await user.type(screen.getByPlaceholderText('1'), '3');

        const submitButton = screen.getByRole('button', { name: /complete transaction/i });
        await user.click(submitButton);

        // 2. Use findByText (which is async) to catch the "Processing..." state
        const processingButton = await screen.findByText(/processing/i);
        expect(processingButton).toBeInTheDocument();
        expect(processingButton).toBeDisabled();

        // 3. Wait for the success logic to complete
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('orders/', {
                item: '1',
                quantity_ordered: 3
            });
            expect(toast.success).toHaveBeenCalledWith('Order processed successfully!');
        });

        // Verify form resets back to original state after success
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /complete transaction/i })).toBeInTheDocument();
            expect(screen.getByRole('combobox').value).toBe("");
        });
    });

    it('handles server-side validation errors correctly', async () => {
        // Mock a specific error structure from the backend
        const errorResponse = {
            response: {
                data: {
                    quantity_ordered: ['Insufficient stock on server.']
                }
            }
        };
        api.post.mockRejectedValueOnce(errorResponse);

        render(<ProcessOrder />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        await user.selectOptions(screen.getByRole('combobox'), '1');
        await user.type(screen.getByPlaceholderText('1'), '5');
        await user.click(screen.getByRole('button', { name: /complete transaction/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Insufficient stock on server.');
        });
    });

    it('shows empty state when no recent orders exist', async () => {
        // Mock empty orders dataset
        api.get.mockImplementation((url) => {
            if (url === 'items/') return Promise.resolve({ data: mockItems });
            if (url === 'orders/') return Promise.resolve({ data: [] });
            return Promise.reject(new Error('Unknown API call'));
        });

        render(<ProcessOrder />);

        await waitFor(() => {
            expect(screen.getByText(/no orders processed in the last week/i)).toBeInTheDocument();
        });
    });
});