import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

// Custom hook for consuming the AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // State to store user details

  const loginUser = async (username, password) => {
    try {
      // Call the backend API to validate login credentials
      const response = await axios.post(`http://localhost:4000/user-api/login`, { username, password });

      if (response.status === 200) {
        // Login successful, store user details
        setIsAuthenticated(true);
        setUserDetails(response.data); // Assuming response.data contains user details
        return response;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const signupUser = async (userInfo) => {
    // Perform sign-up request to backend
    try {
      const response = await axios.post(`http://localhost:4000/user-api/signup`, userInfo);
      if (response.status === 201) {
        // Sign-up successful, store user details
        setIsAuthenticated(true);
        setUserDetails(response.data); // Assuming response.data contains user details
      }
    } catch (error) {
      console.error('Sign-up Error:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setUserDetails(null); // Clear user details on logout
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userDetails, // Provide user details in context
        loginUser,
        signupUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
