import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth.js';
import FullPageLoader from '../common/FullPageLoader.jsx';

// Login and signup pages: logged-in users are sent to the dashboard
const PublicRoute = () => {
  const { status } = useAuth();

  if (status === 'loading') return <FullPageLoader label="Checking your session…" />;
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default PublicRoute;
