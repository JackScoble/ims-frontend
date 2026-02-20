import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../App.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Create a promise that resolves after 1 second
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        try {
            // Run the API call and the delay at the same time
            const [response] = await Promise.all([
                api.post('token/', { username: email, password }),
                delay(1000) // Ensure the spinner shows for at least 1s
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

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>IMS Login</h2>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={isLoading} style={{
                    padding: '12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',            
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {isLoading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        'Log In'
                    )}
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;