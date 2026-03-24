import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <nav style={{ width: '200px', background: '#f4f4f4', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2>IMS Pro</h2>
        <NavLink to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</NavLink>
        <NavLink to="/analytics" style={{ textDecoration: 'none', color: '#333' }}>Analytics</NavLink>
        <NavLink to="/audit" style={{ textDecoration: 'none', color: '#333' }}>System Logs</NavLink>
        
        <button onClick={handleLogout} style={{ marginTop: 'auto', padding: '10px', cursor: 'pointer' }}>
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet /> {/* This is where the pages render */}
      </main>
    </div>
  );
};

export default Layout;