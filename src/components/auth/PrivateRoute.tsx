import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

interface PrivateRouteProps extends React.PropsWithChildren {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user exists and has required role
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(user.role || '')) {
    // Redirect based on role
    if (user.role === 'employee') {
      const path = location.pathname.startsWith('/employee') ? location.pathname : '/employee/dashboard';
      return <Navigate to={path} />;
    } else if (user.role === 'customer') {
      return <Navigate to={`/businesses/${user.businessId}/dashboard`} />;
    }
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;