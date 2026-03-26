import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract the token from the URL automatically
  const token = searchParams.get('token'); 
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Send the token and the new password to the confirm endpoint
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
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Invalid Link</h2>
        <p>No reset token found in the URL. Please request a new password reset link.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Set New Password</h2>
        
        {message && <p style={{ color: 'green', backgroundColor: '#e6fffa', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{message}</p>}
        {error && <p style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#555' }}>
            New Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#555' }}>
            Confirm New Password
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>
          <button type="submit" style={{ padding: '12px', backgroundColor: '#8884d8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;