import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext'; // Correct import for UserContext
import { useAuthContext } from '../../context/AuthContext'; // Import AuthContext
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCalendarAlt } from 'react-icons/fa'; // Import React icons including date icon
import './SignUp.css';

function SignUp() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const { setUser } = useUserContext(); // Use UserContext for setting user data
    const { loginUser } = useAuthContext(); // Get loginUser function

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:4000/user-api/users', data);

            if (response.data.message === 'User Created') {
                alert('Signup successful!');

                // Optional: Automatically log in the user after signup
                const loginResponse = await loginUser(data.username, data.password);
                if (loginResponse) {
                    setUser({
                        firstname: data.firstname,
                        username: data.username,
                        contactNumber: data.contactNumber, // Updated field name
                        registerDate: data.registerDate, // Take the date directly from input
                        token: response.data.token,  // Token received from backend
                    });

                    // Store token in localStorage
                    localStorage.setItem('token', response.data.token);

                    reset(); // Reset form fields
                    navigate('/login'); // Redirect to home page
                }
            } else {
                alert(response.data.message);
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
                            {...register('firstname')}
                        />
                    </div>
                    <div className="textbox">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            {...register('username')}
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
                        <FaPhone className="input-icon" />
                        <input
                            type="text"
                            placeholder="Contact Number" // Updated placeholder
                            required
                            {...register('contactNumber')} // Updated field name
                        />
                    </div>
                    <div className="textbox">
                        <FaCalendarAlt className="input-icon" />
                        <input
                            type="date"
                            placeholder="Date"
                            required
                            {...register('registerDate')} // Take register date as input
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
