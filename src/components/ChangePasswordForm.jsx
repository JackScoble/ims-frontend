import React, { useState } from 'react';
import api from '../api/axios';

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.put('password_change/', {
        old_password: oldPassword,
        new_password: newPassword
      });

      setSuccess(response.data.message || 'Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #eaecef' }}>
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#24292e', fontSize: '16px' }}>Change Password</h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#586069' }}>
          This will immediately update your login credentials. Make sure you use a strong, unique password.
        </p>
      </div>

      {success && <p style={{ color: 'green', backgroundColor: '#e6fffa', padding: '10px', borderRadius: '4px' }}>{success}</p>}
      {error && <p style={{ color: '#d73a49', backgroundColor: '#ffeef0', padding: '10px', borderRadius: '4px', border: '1px solid #d73a49' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#333' }}>
          Current Password
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#333' }}>
          New Password
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#333' }}>
          Confirm New Password
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
              padding: '8px 15px', 
              backgroundColor: '#d73a49', 
              color: '#fafbfc', 
              border: '1px solid #d73a49', 
              borderRadius: '6px', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', 
              alignSelf: 'flex-start',
              transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#fafbfc'; e.target.style.color = '#d73a49'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = '#d73a49'; e.target.style.color = '#fafbfc'; }}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;