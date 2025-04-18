import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaEdit } from 'react-icons/fa';
import './Profile.css';

function Profile() {
    // const [user, setUser] = useState({
    //     firstname: '',
    //     username: '',
    //     contactNumber: '',
    //     registerDate: '',
    // });
    // const [editMode, setEditMode] = useState(false);
    // const [expenseLimit, setExpenseLimit] = useState('');

    // useEffect(() => {
    //     // Fetch user data from backend on component mount
    //     const fetchUserData = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             const response = await axios.get('http://localhost:4000/user-api/user-profile', {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    //             setUser(response.data);
    //             setExpenseLimit(response.data.expenseLimit || ''); // Adjust based on your backend response
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     };
    //     fetchUserData();
    // }, []);

    // const handleEditToggle = () => {
    //     setEditMode(!editMode);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const token = localStorage.getItem('token');
    //         await axios.put('http://localhost:4000/user-api/update-user', { ...user, expenseLimit }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         alert('Profile updated successfully!');
    //         setEditMode(false);
    //     } catch (error) {
    //         console.error('Error updating user data:', error);
    //     }
    // };

    return (
        <div className="profile-page">
            {/* <div className="profile-box">
                <h2>User Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="textbox">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            placeholder="First Name"
                            value={user.firstname}
                            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                            disabled={!editMode}
                            required
                        />
                    </div>
                    <div className="textbox">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            disabled={!editMode}
                            required
                        />
                    </div>
                    <div className="textbox">
                        <FaPhone className="input-icon" />
                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={user.contactNumber}
                            onChange={(e) => setUser({ ...user, contactNumber: e.target.value })}
                            disabled={!editMode}
                            required
                        />
                    </div>
                    <button type="button" className="edit-btn" onClick={handleEditToggle}>
                        <FaEdit /> {editMode ? 'Cancel' : 'Edit'}
                    </button>
                    {editMode && <button type="submit" className="save-btn">Save</button>}
                </form>

                <div className="set-limit-section">
                    <h3>Set Limit for Expenses</h3>
                    <input
                        type="number"
                        placeholder="Set your expense limit"
                        value={expenseLimit}
                        onChange={(e) => setExpenseLimit(e.target.value)}
                    />
                    <button type="button" className="set-limit-btn">Set Limit</button>
                </div>
            </div> */}
        </div>
    );
}

export default Profile;
