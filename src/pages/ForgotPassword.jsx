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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Reset Password</h2>
        
        {message && <p style={{ color: 'green', backgroundColor: '#e6fffa', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{message}</p>}
        {error && <p style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#555' }}>
            Email Address
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your registered email"
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </label>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '12px', backgroundColor: '#8884d8', color: '#fff', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#8884d8', textDecoration: 'none', fontSize: '14px' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;