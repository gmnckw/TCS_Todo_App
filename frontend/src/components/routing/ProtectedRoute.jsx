import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/constants';

// Guards authenticated routes. Unauthenticated users are sent to login and returned afterwards.
export default function ProtectedRoute({ requireManager = false }) {
  const { isAuthenticated, isManager } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }
  if (requireManager && !isManager) {
    return <Navigate to={ROUTES.TASKS} replace />;
  }
  return <Outlet />;
}
