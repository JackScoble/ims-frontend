import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('password_reset/', { email });
      setMessage('If an account with that email exists, a reset link has been sent.');
      setEmail('');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input style matching the Login and Register pages
  const inputClass = "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8884d8] focus:border-[#8884d8] block p-2.5 transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide";

  return (
    // Full screen background centered flex container
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      
      {/* Forgot Password Card */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send you a link to get back into your account.</p>
        </div>
        
        {/* Styled Alert Messages */}
        {message && (
            <div className="mb-5 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                {message}
            </div>
        )}
        {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email Input */}
          <div>
            <label className={labelClass}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@company.com"
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#8884d8] hover:bg-[#706ac9] focus:outline-none focus:ring-4 focus:ring-[#8884d8]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
                <>
                    {/* Tailwind animated SVG Spinner */}
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Link...
                </>
            ) : (
                'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm">
          <Link to="/login" className="font-bold text-[#8884d8] hover:text-[#706ac9] hover:underline transition-colors flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;