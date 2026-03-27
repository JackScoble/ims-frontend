import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        try {
            const [response] = await Promise.all([
                api.post('token/', { username: email, password }),
                delay(1000)
            ]);

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_email', email);
            
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error('Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    // Shared input style matching the rest of the app
    const inputClass = "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8884d8] focus:border-[#8884d8] block p-2.5 transition-colors";

    return (
        // Full screen background centered flex container
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            
            {/* Login Card */}
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">IMS Pro Login</h2>
                    <p className="text-sm text-gray-500 mt-2">Sign in to manage your inventory</p>
                </div>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="you@company.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className={inputClass}
                        />
                    </div>

                    {/* Password Input with floating Forgot link */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Password
                            </label>
                            <Link to="/forgot-password" className="text-xs font-semibold text-[#8884d8] hover:text-[#706ac9] hover:underline transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
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
                                Authenticating...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                {/* Footer Register Link */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-[#8884d8] hover:text-[#706ac9] hover:underline transition-colors">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;