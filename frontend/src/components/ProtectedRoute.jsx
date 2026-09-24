import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getRoleName = (roles) => {
  if (!roles || roles.length === 0) return 'requested';
  if (roles.includes('admin')) return 'Admin';
  if (roles.includes('department')) return 'Department';
  if (roles.includes('citizen')) return 'Citizen';
  return roles[0];
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If no user is logged in / registered
  if (!isAuthenticated || !user) {
    const roleTitle = getRoleName(allowedRoles);
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname, 
          message: `Authentication required: Please sign in or register to access the ${roleTitle} panel.` 
        }} 
        replace 
      />
    );
  }

  // If user is logged in, check role permissions
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || 'citizen').toLowerCase();
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRole);

    if (!isAllowed) {
      // Redirect to their respective authorized panel
      let targetPath = '/citizen/dashboard';
      if (userRole === 'admin') targetPath = '/admin/dashboard';
      if (userRole === 'department') targetPath = '/department/dashboard';

      return (
        <Navigate 
          to={targetPath} 
          state={{ 
            message: `Access Denied: Your account role (${userRole.toUpperCase()}) cannot access the ${getRoleName(allowedRoles)} panel.` 
          }} 
          replace 
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
