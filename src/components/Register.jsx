/**
 * @file register.jsx
 * @description Provides the user registration page for the application.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

/**
 * Register Component
 *
 * @component
 * @description Renders a registration form for new users to create an account.
 * Manages form state, performs client-side validation for password matching, 
 * and handles the API submission to the 'register/' endpoint. Redirects users 
 * to the login page upon successful account creation.
 *
 * @returns {JSX.Element} The rendered Registration page.
 */
function Register() {
    // Form state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // UI state variables
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    /**
     * Handles the form submission for user registration.
     * Prevents default form behavior, checks if passwords match, and submits the data
     * to the registration API endpoint. Resolves loading states and errors, and routes
     * the user to the login screen on success.
     *
     * @async
     * @function handleRegister
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match"); 
        }

        setIsLoading(true);
        // Helper function to create an artificial delay
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        try {
            await Promise.all([
                api.post('register/', {
                    email: email,
                    password: password
                }),
                delay(1000)
            ]);

            toast.success('Account created! Please log in.');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.email?.[0] || 'Registration failed.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /** @constant {string} inputClass - Shared Tailwind CSS classes for the input fields. */
    const inputClass = "w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-[#8884d8] focus:border-[#8884d8] block p-2.5 transition-colors placeholder-gray-400 dark:placeholder-gray-500";
    
    /** @constant {string} labelClass - Shared Tailwind CSS classes for the input labels. */
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide";

    return (
        // Full screen background centered flex container
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            
            {/* Register Card */}
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Create Account</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign up to start managing your inventory</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    
                    {/* Email Input */}
                    <div>
                        <label className={labelClass} htmlFor="email">
                            Email Address
                        </label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="you@company.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className={inputClass}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className={labelClass} htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input 
                                id="password"
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className={`${inputClass} pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className={labelClass} htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input 
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                className={`${inputClass} pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full mt-2 flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#8884d8] hover:bg-[#706ac9] dark:bg-[#8884d8] dark:hover:bg-[#706ac9] focus:outline-none focus:ring-4 focus:ring-[#8884d8]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Footer Login Link */}
                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-[#8884d8] dark:text-[#a5a1ff] hover:text-[#706ac9] hover:underline transition-colors">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;