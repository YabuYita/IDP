import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === 'student') {
      return <Navigate to="/dashboard" />;
    } else if (currentUser.role === 'instructor') {
      return <Navigate to="/instructor/dashboard" />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    
    // Fallback
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;