import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuditLog from '../pages/AuditLog';
import api from '../api/axios';

// --- Mocks ---
/** * Mock the axios API client to intercept backend requests.
 */
vi.mock('../api/axios');

/**
 * Test suite for the AuditLog Page component.
 * Verifies that system logs are successfully retrieved, rendered, 
 * and can be accurately filtered by search term, action type, or user.
 */
describe('AuditLog Page', () => {
    // 1. Setup Mock Data
    const mockLogs = [
        { 
            id: 1, object_type: 'Item', object_name: 'MacBook Pro', 
            action: 'CREATE', description: 'Added new laptop to inventory', 
            username: 'admin_jack', timestamp: '2023-10-01T10:00:00Z' 
        },
        { 
            id: 2, object_type: 'Item', object_name: 'Wireless Mouse', 
            action: 'UPDATE', description: 'Updated price from £20 to £25', 
            username: 'sarah_smith', timestamp: '2023-10-02T11:30:00Z' 
        },
        { 
            id: 3, object_type: 'Category', object_name: 'Office Supplies', 
            action: 'DELETE', description: 'Removed unused category', 
            username: 'admin_jack', timestamp: '2023-10-03T14:15:00Z' 
        },
    ];

    // 2. Setup Before Each Test
    /**
     * Resets mock history and configures the default successful response
     * for the audit endpoint before every individual test run.
     */
    beforeEach(() => {
        // Reset all mocks before each test runs to prevent test pollution
        vi.clearAllMocks();
        
        // Mock the API response
        api.get.mockImplementation((url) => {
            if (url === 'audit/') {
                return Promise.resolve({ data: mockLogs });
            }
            return Promise.reject(new Error('not found'));
        });
    });

    // --- Tests ---

    it('displays the loading text initially', () => {
        render(<AuditLog />);
        expect(screen.getByText(/loading system logs/i)).toBeInTheDocument();
    });

    it('fetches and displays the audit logs in the table', async () => {
        render(<AuditLog />);

        await waitFor(() => {
            expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
            expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
            
            expect(screen.getByText('CREATE')).toBeInTheDocument();
            expect(screen.getByText('UPDATE')).toBeInTheDocument();
            
            expect(screen.getAllByText('admin_jack').length).toBeGreaterThan(0);
            expect(screen.getAllByText('sarah_smith').length).toBeGreaterThan(0);
        });
    });

    it('filters logs correctly when typing in the search bar', async () => {
        render(<AuditLog />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        });

        // Find the search input and type "Mouse"
        const searchInput = screen.getByPlaceholderText(/search by item name/i);
        fireEvent.change(searchInput, { target: { value: 'Mouse' } });

        // MacBook should disappear, Mouse should remain
        expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
        expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    });

    it('filters logs correctly by Action dropdown', async () => {
        render(<AuditLog />);

        await waitFor(() => {
            expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        });

        // Find the Action select dropdown (it defaults to "All Actions")
        const actionSelect = screen.getByDisplayValue('All Actions');
        fireEvent.change(actionSelect, { target: { value: 'DELETE' } });

        // Only the DELETE action log should remain
        expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument(); // CREATE
        expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument(); // UPDATE
        expect(screen.getByText('Office Supplies')).toBeInTheDocument(); // DELETE
    });

    it('filters logs correctly by User dropdown', async () => {
        render(<AuditLog />);

        await waitFor(() => {
            expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        });

        const userSelect = screen.getByDisplayValue('All Users');
        fireEvent.change(userSelect, { target: { value: 'sarah_smith' } });

        // Only Sarah's logs should remain
        expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument(); // admin_jack
        expect(screen.getByText('Wireless Mouse')).toBeInTheDocument(); // sarah_smith
    });

    it('clears all filters when the Clear Filters button is clicked', async () => {
        render(<AuditLog />);

        await waitFor(() => {
            expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/search by item name/i);
        fireEvent.change(searchInput, { target: { value: 'NonExistentItem123' } });

        // Verify table is empty
        expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
        expect(screen.getByText(/no logs found/i)).toBeInTheDocument();

        const clearButton = screen.getByRole('button', { name: /clear filters/i });
        fireEvent.click(clearButton);

        // Verify data is back and input is empty
        expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        expect(searchInput.value).toBe('');
    });

    it('handles a failed API fetch gracefully by showing the empty state', async () => {
        // Force the API to fail
        api.get.mockRejectedValueOnce(new Error('Server Error'));

        render(<AuditLog />);

        await waitFor(() => {
            expect(screen.getByText(/no logs found/i)).toBeInTheDocument();
        });
    });
});