import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaImage } from 'react-icons/fa';
import './SignUp.css';

function SignUp() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // Send data to backend
            const response = await axios.post('http://localhost:5000/user-api/user', {
                name: data.name,
                email: data.email,
                password: data.password,
                profileImage: data.profileImage, // Now the profileImage is a URL string
                registerDate: data.registerDate,
            });

            // Check if user creation was successful
            if (response.data.message === 'User Created') {
                navigate('/login'); // Navigate directly to login page after successful signup
            } else {
                alert(response.data.message); // Display server message in case of failure
            }
        } catch (err) {
            console.error('Error during signup:', err);
            alert(err.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="register-page">
            <div className="register-box">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="textbox">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            {...register('name')}
                        />
                    </div>
                    <div className="textbox">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            {...register('email')}
                        />
                    </div>
                    <div className="textbox">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            {...register('password')}
                        />
                    </div>
                    <div className="textbox">
                        <FaImage className="input-icon" />
                        <input
                            type="url"
                            placeholder="Profile Image URL"
                            required
                            {...register('profileImage')} // Accept URL for profile image
                        />
                    </div>
                    <div className="textbox">
                        <FaCalendarAlt className="input-icon" />
                        <input
                            type="date"
                            placeholder="Date"
                            required
                            {...register('registerDate')}
                        />
                    </div>
                    <button type="submit" className="btn">Sign Up</button>
                </form>
                <div className="login-options">
                    <a href="/login">Already have an account? Login →</a>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
