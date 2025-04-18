import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import './Home.css';
import Image from '../../assets/suits.svg';
import { useUserLogin } from '../contexts/UserLoginContext'; // Correct import

function Home() {
  const { currentUser } = useUserLogin(); // Access currentUser

  return (
    <div className="home-container">
      <div className="left-column">
        <img src={Image} alt="Personal Finance Illustration" className="finance-image" />
      </div>

      <div className="right-column">
        <h1 className="heading">Express Expense</h1>
        <p className="content">
          Take control of your finances and track your spending effectively!
          Stay organized and make informed decisions.
        </p>

        <div className="button-container">
          {!currentUser ? (
            <>
              <Link to="/signup" className="button">
                Register <FaUserPlus className="icon" />
              </Link>
              <Link to="/login" className="button">
                <FaSignInAlt className="icon" /> Login
              </Link>
            </>
          ) : (
            <p className="welcome-back-text">
              Welcome back ! You are already logged in.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
