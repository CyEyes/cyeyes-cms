import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { authService } from '@services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'content' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole = 'content' }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !authService.hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
