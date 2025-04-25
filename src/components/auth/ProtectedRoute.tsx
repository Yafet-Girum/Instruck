import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'business' | 'trucker';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If userType is specified, check if the user has the correct type
  if (userType && user.userType !== userType) {
    // Redirect to the appropriate dashboard
    return <Navigate to={user.userType === 'business' ? '/business' : '/trucker'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;