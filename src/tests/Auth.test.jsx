import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Login from '../components/Login';
import Register from '../components/Register';
import ResetPassword from '../pages/ResetPassword';

// --- 1. MOCKS ---

/**
 * Mock the axios API client to prevent actual network requests and 
 * allow simulating different backend responses (success/failure).
 */
vi.mock('../api/axios', () => ({
  default: { post: vi.fn() }
}));

/**
 * Mock react-hot-toast to verify that the correct success/error 
 * notification messages are triggered during the auth flow.
 */
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

/**
 * Mock react-router-dom's useNavigate hook to track and assert 
 * that the user is redirected to the correct routes after actions.
 */
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

/**
 * Test suite for the Authentication Flow.
 * Covers user journeys including logging in, registering a new account, 
 * and resetting a password, ensuring proper API interaction, validation, 
 * and navigation.
 */
describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Login: shows error toast on invalid credentials', async () => {
    // Simulate a 401/400 bad request from the backend
    api.post.mockRejectedValueOnce({
      response: { data: { detail: 'Invalid credentials' } }
    });

    render(<MemoryRouter><Login /></MemoryRouter>);
    
    // { selector: 'input' } prevents it from matching the "Show Password" button's aria-label
    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input' }), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input', exact: true }), { target: { value: 'wrong' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('Register: validates password mismatch locally', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input' }), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input', exact: true }), { target: { value: 'pass1' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input', exact: true }), { target: { value: 'pass2' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
    });
  });

  it('Register: navigates to login on successful registration', async () => {
    // Added realistic success response in case your component validates it
    api.post.mockResolvedValueOnce({ data: { message: 'Success' }, status: 201 });

    render(<MemoryRouter><Register /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input' }), { target: { value: 'new@user.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input', exact: true }), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input', exact: true }), { target: { value: 'password' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  /**
   * Tests the password reset flow using fake timers.
   * Fake timers are required here to bypass the setTimeout delay 
   * implemented in the component before redirecting the user.
   */
  it('ResetPassword: handles success and redirects', async () => {
    vi.useFakeTimers();
    api.post.mockResolvedValueOnce({ data: { message: 'Success' }, status: 200 });

    render(
      <MemoryRouter initialEntries={['/reset-password?token=123']}>
        <Routes><Route path="/reset-password" element={<ResetPassword />} /></Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), { target: { value: 'newpass' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), { target: { value: 'newpass' } });
    
    // 1. Await the act() block so the mocked API promise resolves immediately
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Save New Password/i }));
    });

    // 2. Fast-forward through the component's internal setTimeout delay
    act(() => {
      vi.runAllTimers(); 
    });

    // 3. Assert directly (no waitFor needed because time has already passed!)
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    vi.useRealTimers(); // Always clean up your fake timers!
  });

});