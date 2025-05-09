import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode; // Aggiornato da JSX.Element a React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Mostra un indicatore di caricamento
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
