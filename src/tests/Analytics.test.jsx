import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Analytics from '../pages/Analytics';
import api from '../api/axios';

// --- Mocks ---
/** * Mock the axios API client to prevent actual network requests during testing.
 */
vi.mock('../api/axios');

/**
 * Mock Recharts ResponsiveContainer.
 * Recharts relies on DOM measurements (width/height) which are usually 0 in 
 * test environments (like jsdom), causing rendering errors or empty charts.
 * This mock bypasses the calculation and simply renders the child components.
 */
vi.mock('recharts', async () => {
    const original = await vi.importActual('recharts');
    return {
        ...original,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
    };
});

/**
 * Test suite for the Analytics Page component.
 * Verifies that the dashboard correctly fetches, calculates, and displays
 * Key Performance Indicators (KPIs) and handles various loading/error states.
 */
describe('Analytics Page', () => {
    const mockItems = [
        { id: 1, name: 'Item A', quantity: 10, price: '10.00', category_name: 'Tech' },
        { id: 2, name: 'Item B', quantity: 5, price: '20.00', category_name: 'Tech' },
        { id: 3, name: 'Item C', quantity: 2, price: '50.00', category_name: 'Office' },
    ];

    const mockAudit = new Array(25).fill({}); // 25 logged actions
    const mockUsers = new Array(3).fill({});  // 3 users
    const mockOrders = new Array(12).fill({}); // 12 orders
    const mockSnapshots = [
        { id: 1, date: '2023-10-01', total_value: '100.00' },
        { id: 2, date: '2023-10-02', total_value: '150.00' },
    ];

    /**
     * Setup before each test runs.
     * Mocks the `api.get` implementation to return predefined datasets 
     * based on the requested endpoint URL.
     */
    beforeEach(() => {
        api.get.mockImplementation((url) => {
            switch (url) {
                case 'items/': return Promise.resolve({ data: mockItems });
                case 'audit/': return Promise.resolve({ data: mockAudit });
                case 'users/': return Promise.resolve({ data: mockUsers });
                case 'orders/': return Promise.resolve({ data: mockOrders });
                case 'snapshots/': return Promise.resolve({ data: mockSnapshots });
                default: return Promise.reject(new Error('not found'));
            }
        });
    });

    it('displays the loading spinner initially', () => {
        render(<Analytics />);
        expect(screen.getByText(/gathering your analytics/i)).toBeInTheDocument();
    });

    it('calculates and displays correct KPI values after data fetch', async () => {
        render(<Analytics />);

        // Math Check: 
        // Unique items: 3 (Item A, B, C)
        // Total Users: 3 (mockUsers length)
        // Total Qty: 10 + 5 + 2 = 17
        // Total Value: (10*10) + (5*20) + (2*50) = 300.00

        await waitFor(() => {
            // Find the KPI card for "Total Users" and check the value inside it
            const usersCard = screen.getByText(/total users/i).closest('div');
            expect(usersCard).toHaveTextContent('3');

            // Find the KPI card for "Unique Items" and check the value inside it
            const itemsCard = screen.getByText(/unique items/i).closest('div');
            expect(itemsCard).toHaveTextContent('3');

            // These are unique enough to stay as they are
            expect(screen.getByText('17')).toBeInTheDocument(); // Total Qty
            expect(screen.getByText('£300.00')).toBeInTheDocument(); // Total Value
            expect(screen.getByText('25')).toBeInTheDocument(); // Actions Logged
            expect(screen.getByText('12')).toBeInTheDocument(); // Total Orders
        });
    });

    it('handles a failed users fetch gracefully (N/A state)', async () => {
        // Force users to fail
        api.get.mockImplementation((url) => {
            if (url === 'users/') return Promise.reject(new Error('Forbidden'));
            if (url === 'items/') return Promise.resolve({ data: mockItems });
            return Promise.resolve({ data: [] });
        });

        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });
        // Ensure other data still loaded
        expect(screen.getByText('3')).toBeInTheDocument(); 
    });

    it('renders chart titles when data is loaded', async () => {
        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText(/total stock value over time/i)).toBeInTheDocument();
            expect(screen.getByText(/stock quantity by category/i)).toBeInTheDocument();
            expect(screen.getByText(/item variety by category/i)).toBeInTheDocument();
        });
    });

    it('shows error message if primary data fetch (items) fails', async () => {
        api.get.mockRejectedValueOnce(new Error('Server Down'));
        
        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText(/failed to load analytics data/i)).toBeInTheDocument();
        });
    });
});