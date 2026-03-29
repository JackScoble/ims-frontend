/**
 * @file Layout.jsx
 * @description The master layout component for the application. It provides the 
 * persistent UI shell, including the sidebar navigation, user profile widget, 
 * and the main content area for rendering nested, authenticated routes.
 */

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/axios';

/**
 * Layout Component
 * Fetches brief user profile data to display in the sidebar and handles user logout.
 * * @returns {JSX.Element} The rendered layout shell wrapping the nested route content.
 */
const Layout = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  /**
   * Fetches the minimal profile information needed for the sidebar widget
   * on initial mount.
   */
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

  /**
   * Handles user logout by clearing local storage tokens and 
   * redirecting to the login view.
   */
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  /**
   * Determines the dynamic CSS classes for navigation links based on their active state.
   * * @param {Object} props - React Router NavLink props.
   * @param {boolean} props.isActive - Whether the current route matches the link.
   * @returns {string} The computed CSS class string.
   */
  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md transition-colors font-medium ${
      isActive
        ? 'bg-[#8884d8]/10 text-[#8884d8] dark:bg-[#8884d8]/20 dark:text-[#a09df0]'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white dark:bg-gray-800 p-5 flex flex-col border-r border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        
        <div className="mb-8 px-3">
            <h2 className="text-2xl font-bold text-[#8884d8]">IMS Pro</h2>
        </div>
        
        <div className="flex flex-col gap-2">
            <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>
            <NavLink to="/analytics" className={navLinkClasses}>Analytics</NavLink>
            <NavLink to="/audit" className={navLinkClasses}>System Logs</NavLink>
            <NavLink to="/process-order" className={navLinkClasses}>Process Order</NavLink>
        </div>
        
        {/* Spacer to push the bottom elements down */}
        <div className="flex-grow"></div>

        {/* Profile Widget */}
        <NavLink 
            to="/profile" 
            className="flex items-center gap-3 p-3 mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex justify-center items-center flex-shrink-0">
            {profile?.profile?.profile_image ? (
              <img src={profile.profile.profile_image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white dark:text-gray-300 font-bold text-lg">
                {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                {profile?.first_name || profile?.username || 'User'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">View Profile</span>
          </div>
        </NavLink>

        <button 
            onClick={handleLogout} 
            className="w-full py-2.5 px-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white rounded-md font-semibold transition-colors border border-red-100 dark:border-red-500/20 hover:border-red-500 dark:hover:border-red-500"
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Outlet /> 
      </main>
      
    </div>
  );
};

export default Layout;