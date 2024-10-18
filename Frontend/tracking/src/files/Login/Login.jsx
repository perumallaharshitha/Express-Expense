import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext'; 
import { useUserContext } from '../../context/UserContext';
import './Login.css';
import { FaUser, FaLock} from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { loginUser } = useAuthContext();
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser(username, password);
            
            if (response && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                setUser({
                    username,
                    token,
                });
                navigate('/');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
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
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="textbox">
                    <FaLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
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
