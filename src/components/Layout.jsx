import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Layout = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('profile/');
        setProfile(response.data);
      } catch (error) {
        console.error("Could not fetch profile for sidebar", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Sidebar Navigation */}
      <nav style={{ width: '240px', background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', borderRight: '1px solid #ddd' }}>
        <h2 style={{ color: '#8884d8', marginBottom: '20px' }}>IMS Pro</h2>
        
        <NavLink to="/dashboard" style={({isActive}) => ({ textDecoration: 'none', color: isActive ? '#8884d8' : '#333', fontWeight: isActive ? 'bold' : 'normal' })}>Dashboard</NavLink>
        <NavLink to="/analytics" style={({isActive}) => ({ textDecoration: 'none', color: isActive ? '#8884d8' : '#333', fontWeight: isActive ? 'bold' : 'normal' })}>Analytics</NavLink>
        <NavLink to="/audit" style={({isActive}) => ({ textDecoration: 'none', color: isActive ? '#8884d8' : '#333', fontWeight: isActive ? 'bold' : 'normal' })}>System Logs</NavLink>
        <NavLink to="/process-order" style={({isActive}) => ({ textDecoration: 'none', color: isActive ? '#8884d8' : '#333', fontWeight: isActive ? 'bold' : 'normal' })}>Process Order</NavLink>
        
        {/* Spacer to push the bottom elements down */}
        <div style={{ flexGrow: 1 }}></div>

        {/* NEW: Profile Widget inside the sidebar */}
        <NavLink to="/profile" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#ccc', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {profile?.profile?.profile_image ? (
              <img src={profile.profile.profile_image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#fff', fontWeight: 'bold' }}>
                {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{profile?.first_name || profile?.username || 'User'}</span>
            <span style={{ fontSize: '12px', color: '#777' }}>View Profile</span>
          </div>
        </NavLink>

        <button onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto' }}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;