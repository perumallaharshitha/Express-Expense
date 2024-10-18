import React, { useState } from 'react';
import { loginContext } from './userLoginContext'; // Ensure this is correctly defined

function AuthContext({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoginStatus, setUserLoginStatus] = useState(false);
    const [err, setErr] = useState("");

    function handleLogin(userObj) {
        // Simulate login logic here
        if (userObj.username === "admin" && userObj.password === "password") {
            // Update State
            setCurrentUser({ username: "admin" });
            setUserLoginStatus(true);
            setErr("");

            // Notify user of successful login
            toast.success("Login Successful", {
                style: {
                    marginTop: '-10px',
                    marginBottom: '10px',
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#333',
                },
                icon: '🎉',
            });
        } else {
            setErr("Invalid Username or Password");
        }
    }

    function logoutUser() {
        // Reset state
        setCurrentUser(null);
        setUserLoginStatus(false);
        setErr("");
    }

    return (
        <loginContext.Provider value={{ handleLogin, logoutUser, userLoginStatus, setCurrentUser, setUserLoginStatus, currentUser, err }}>
            {children}
        </loginContext.Provider>
    );
}

export default AuthContext;
