import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { useUserLogin } from '../contexts/UserLoginContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useUserLogin(); // custom context for managing auth

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      const response = await axios.post(
        'http://localhost:5000/user-api/login',
        { name: username, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200 && response.data.message === 'Login successful') {
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        loginUser(user, token); // update global context
        navigate('/category'); // redirect to protected route
      } else {
        setErr('Login failed: ' + (response.data.message || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setErr(error.response?.data?.message || 'Server error. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="textbox">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="textbox">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err && <p className="error-message">{err}</p>}
          <button type="submit" className="bt">Login</button>
          <div className="login-options">
            <a href="/signup">Create Your Account →</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
