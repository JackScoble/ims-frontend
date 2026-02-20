import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../App.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // 1. Check passwords BEFORE starting the loader
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match"); 
        }

        setIsLoading(true);
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        try {
            // 2. Use Promise.all to run the API and the 1s timer together
            await Promise.all([
                api.post('register/', {
                    email: email,
                    password: password
                }),
                delay(1000) // This ensures the spinner is seen for at least 1s
            ]);

            toast.success('Account created! Please log in.');
            navigate('/login');
        } catch (err) {
            // 3. Handle specific backend errors (e.g., email already exists)
            const errorMessage = err.response?.data?.email?.[0] || 'Registration failed.';
            toast.error(errorMessage);
        } finally {
            // 4. Always turn off the spinner
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
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
                    display: 'flex',            // Keep items centered
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {isLoading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
        </div>
    );
}

export default Register;