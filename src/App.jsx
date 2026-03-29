import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AuditLog from './pages/AuditLog';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProcessOrder from './pages/ProcessOrder';

/**
 * A wrapper component that protects routes requiring authentication.
 * It checks local storage for an existing access token. If the token is found,
 * it renders the requested child components. If not, it redirects to the login page.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 * @returns {React.ReactElement} The protected route content or a navigation redirect.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

/**
 * The root Application component.
 * Configures the primary routing structure, sets up global toast notifications, 
 * and defines the hierarchy of public and protected routes.
 *
 * @returns {React.ReactElement} The fully routed application.
 */
function App() {
  return (
    <BrowserRouter>
      {/* Global Toast Notification Provider */}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes - Accessible without authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes - Wrapped in Layout and ProtectedRoute for auth checks */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/process-order" element={<ProcessOrder />} />
        </Route>
        
        {/* Catch-all: Redirect unrecognized routes to dashboard (which redirects to login if unauth'd) */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;