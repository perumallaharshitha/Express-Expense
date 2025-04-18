import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context for user login state
const UserLoginContext = createContext();

// Export the custom hook to access the context
export const useUserLogin = () => {
  return useContext(UserLoginContext);
};

// Create the provider component for user login context
const UserLoginProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoginStatus, setUserLoginStatus] = useState(false);
  const [err, setErr] = useState('');

  // Function to log in the user
  const loginUser = (userData, token) => {
    setCurrentUser(userData);
    setUserLoginStatus(true);
    setErr('');
    sessionStorage.setItem('token', token);  // Save token in session storage
  };

  // Function to log out the user
  const logoutUser = () => {
    setCurrentUser(null);
    setUserLoginStatus(false);
    setErr('');
    sessionStorage.removeItem('token'); // Remove token from session storage
  };

  // 🔄 Restore user from token on refresh
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Optional: validate token with backend
      fetch('http://localhost:5000/user-api/verify-user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
            setUserLoginStatus(true);
          } else {
            logoutUser(); // Invalid token
          }
        })
        .catch(() => logoutUser()); // Logout if there's an error
    }
  }, []);

  return (
    <UserLoginContext.Provider value={{ currentUser, userLoginStatus, loginUser, logoutUser, err }}>
      {children}
    </UserLoginContext.Provider>
  );
};

export default UserLoginProvider;
