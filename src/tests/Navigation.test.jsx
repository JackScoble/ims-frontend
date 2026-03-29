import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../components/Layout'; // Adjust path if needed
import api from '../api/axios';

// --- Mocks ---
vi.mock('../api/axios');

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Navigation & Layout', () => {
    const mockProfile = {
        username: 'jacks123',
        first_name: 'Jack',
        profile: {
            profile_image: null
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Default successful profile fetch
        api.get.mockResolvedValue({ data: mockProfile });
    });

    const renderWithRouter = (ui) => {
        return render(<MemoryRouter>{ui}</MemoryRouter>);
    };

    it('renders the sidebar brand name', () => {
        renderWithRouter(<Layout />);
        expect(screen.getByText('IMS Pro')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
        renderWithRouter(<Layout />);
        
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
        expect(screen.getByText('System Logs')).toBeInTheDocument();
        expect(screen.getByText('Process Order')).toBeInTheDocument();
    });

    it('fetches and displays user profile information', async () => {
        renderWithRouter(<Layout />);

        // Should call the profile endpoint
        expect(api.get).toHaveBeenCalledWith('profile/');

        // Wait for the name to appear in the profile widget
        await waitFor(() => {
            expect(screen.getByText('Jack')).toBeInTheDocument();
            // Should show the first initial if no image exists
            expect(screen.getByText('J')).toBeInTheDocument();
        });
    });

    it('clears storage and redirects to login on logout', async () => {
        // Setup spies for localStorage
        const removeSpy = vi.spyOn(Storage.prototype, 'removeItem');
        
        renderWithRouter(<Layout />);

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        // Check if tokens were removed
        expect(removeSpy).toHaveBeenCalledWith('access_token');
        expect(removeSpy).toHaveBeenCalledWith('refresh_token');

        // Check if navigate was called
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('handles profile fetch failure gracefully', async () => {
        // Suppress console.error for this test to keep the log clean
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        api.get.mockRejectedValueOnce(new Error('Unauthorized'));

        renderWithRouter(<Layout />);

        await waitFor(() => {
            // Should fall back to 'User' if fetch fails
            expect(screen.getByText('User')).toBeInTheDocument();
            expect(screen.getByText('U')).toBeInTheDocument();
        });
        
        consoleSpy.mockRestore();
    });
});