import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DASHBOARD_BY_ROLE, normalizeRole } from '../constants/roles.js';

export default function ProtectedRoute({ allowedRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* Still restoring session */
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#167a68',
          fontWeight: 600,
        }}
      >
        <i className="fas fa-spinner fa-spin" style={{ marginRight: 10 }}></i>
        Loading…
      </div>
    );
  }

  /* Not logged in → go to login */
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* Logged in but wrong role → bounce to their own dashboard */
  const role = normalizeRole(user.role);
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={DASHBOARD_BY_ROLE[role]} replace />;
  }

  return <Outlet />;
}