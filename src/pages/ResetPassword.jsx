import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token'); 
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      await api.post('password_reset/confirm/', {
        token: token,
        password: password
      });
      
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); 
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.password) {
        setError(`Password error: ${err.response.data.password[0]}`);
      } else if (err.response && err.response.data && err.response.data.token) {
        setError('This reset link has expired. Please request a new one.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input style matching the other Auth pages
  const inputClass = "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8884d8] focus:border-[#8884d8] block p-2.5 transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide";

  // Fallback UI if the token is missing from the URL
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-5 border-4 border-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-sm text-gray-500 mb-8">No reset token was found in the URL. This link may be broken or expired.</p>
          <Link to="/forgot-password" className="inline-flex justify-center items-center py-3 px-4 w-full rounded-lg shadow-sm text-sm font-bold text-white bg-[#8884d8] hover:bg-[#706ac9] transition-colors">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    // Full screen background centered flex container
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      
      {/* Reset Password Card */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Set New Password</h2>
          <p className="text-sm text-gray-500 mt-2">Enter your new secure password below.</p>
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
          
          {/* New Password Input */}
          <div>
            <label className={labelClass}>New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading || message !== ''}
            className="w-full mt-2 flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#8884d8] hover:bg-[#706ac9] focus:outline-none focus:ring-4 focus:ring-[#8884d8]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
                <>
                    {/* Tailwind animated SVG Spinner */}
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                </>
            ) : (
                'Save New Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;