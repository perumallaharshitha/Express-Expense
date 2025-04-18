import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserLogin } from './files/contexts/UserLoginContext'; // Correct import

const ProtectedRoute = ({ children }) => {
  const { userLoginStatus } = useUserLogin(); // Use userLoginStatus to check authentication

  if (!userLoginStatus) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
