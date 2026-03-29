import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Profile from '../pages/Profile';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

// --- Mocks ---
vi.mock('../api/axios');
vi.mock('react-hot-toast');

// Mock ThemeContext
vi.mock('../context/ThemeContext', () => ({
    useTheme: vi.fn(),
}));

// Mock the child component to isolate the Profile component tests
vi.mock('../components/ChangePasswordForm', () => ({
    default: () => <div data-testid="mock-change-password-form">Change Password Form</div>,
}));

// URL.createObjectURL needs a mock in JS DOM environments
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

describe('Profile Component', () => {
    let mockSetTheme;
    let user;

    const mockProfileData = {
        email: 'john.doe@enterprise.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'Senior Engineer',
        date_joined: '2025-01-01T10:00:00Z',
        last_login: '2026-03-29T08:00:00Z',
        items_added: 120,
        edits_today: 15,
        profile: {
            department: 'Engineering',
            job_title: 'Frontend Architect',
            profile_image: 'https://example.com/avatar.jpg',
            theme_preference: 'dark',
        },
    };

    beforeEach(() => {
        user = userEvent.setup();
        mockSetTheme = vi.fn();
        useTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme });

        // Default GET mock
        api.get.mockResolvedValue({ data: mockProfileData });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially, then populates data from API', async () => {
        render(<Profile />);
        expect(api.get).toHaveBeenCalledWith('profile/');

        await waitFor(() => {
            expect(screen.getByDisplayValue('john.doe@enterprise.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        expect(screen.getByText('120')).toBeInTheDocument();
        expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    });

    it('enables the save button only when changes are made', async () => {
        render(<Profile />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const saveButton = screen.getByRole('button', { name: /saved/i });
        expect(saveButton).toBeDisabled();

        const firstNameInput = screen.getByDisplayValue('John');
        await user.clear(firstNameInput);
        await user.type(firstNameInput, 'Johnny');

        expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled();
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    });

    it('submits updated profile data correctly and shows success toast', async () => {
        // Delay the mock response so the "Saving..." state is visible to the test
        api.put.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve({ data: { message: 'Success' } }), 50))
        );

        render(<Profile />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const firstNameInput = screen.getByDisplayValue('John');
        await user.clear(firstNameInput);
        await user.type(firstNameInput, 'Johnny');

        const saveButton = screen.getByRole('button', { name: /save changes/i });
        await user.click(saveButton);

        // findByRole automatically handles the wait for the text to change to "Saving"
        const loadingButton = await screen.findByRole('button', { name: /saving/i });
        expect(loadingButton).toBeDisabled();

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith('profile/', expect.any(FormData), expect.any(Object));
            expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
        });

        // Ensure the form resets to "Saved" state after the promise resolves
        const finalButton = await screen.findByRole('button', { name: /saved/i });
        expect(finalButton).toBeDisabled();
    });

    it('handles API failure during profile update gracefully', async () => {
        api.put.mockRejectedValueOnce(new Error('API Error'));
        render(<Profile />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        await user.type(screen.getByDisplayValue('John'), 'ny');
        await user.click(screen.getByRole('button', { name: /save changes/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to update profile.');
        });

        expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled();
    });

    it('handles image upload and updates preview', async () => {
        render(<Profile />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const fileInput = document.getElementById('avatar-upload');

        await user.upload(fileInput, file);

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled();
    });

    it('updates theme preference via API and Context when dropdown changes', async () => {
        api.patch.mockResolvedValueOnce({ data: { message: 'Theme updated' } });
        render(<Profile />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        });

        const themeSelect = screen.getByRole('combobox');
        await user.selectOptions(themeSelect, 'dark');

        await waitFor(() => {
            expect(mockSetTheme).toHaveBeenCalledWith('dark');
            expect(api.patch).toHaveBeenCalledWith('profile/', expect.any(FormData));
            expect(toast.success).toHaveBeenCalledWith('Theme preference saved!');
        });
    });

    it('renders the child ChangePasswordForm component safely', () => {
        render(<Profile />);
        expect(screen.getByTestId('mock-change-password-form')).toBeInTheDocument();
    });
});