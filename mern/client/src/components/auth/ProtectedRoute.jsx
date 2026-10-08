import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth.js';
import FullPageLoader from '../common/FullPageLoader.jsx';

// Only lets logged-in users through; everyone else goes to /login and
// is sent back to the page they wanted once they sign in
const ProtectedRoute = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader label="Checking your session…" />;
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
