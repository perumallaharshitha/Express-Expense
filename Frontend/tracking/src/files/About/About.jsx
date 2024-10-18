import React from 'react';
import { FaTags, FaChartBar, FaRegMoneyBillAlt } from 'react-icons/fa'; // Importing icons for Categories, Reports, Set Limits
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <h1 className="main-heading">ABOUT</h1>
            <p className="about-description">
                Express Expense is a streamlined solution for tracking and managing your expenses with ease. From secure login and regsitration to organising your finances through custom categories, it allows you to monitor spending, set limits and generate detailed reports to understand your financial habits better. Tailored for efficiency, it offers personalised profile management and helps you stay within your budget by settings expense limits, making financial planning a breeze.
            </p>

            <div className="card-section">
                <div className="about-card">
                    <FaTags className="card-icon" />
                    <h3>Categories</h3>
                    <p>Organize and manage your categories with ease.</p>
                </div>

                <div className="about-card">
                    <FaChartBar className="card-icon" />
                    <h3>Reports</h3>
                    <p>Get detailed visual and analytical reports.</p>
                </div>

                <div className="about-card">
                    <FaRegMoneyBillAlt className="card-icon" />
                    <h3>Set Limits</h3>
                    <p>Track with budget limits and get alerts</p>
                </div>
            </div>
        </div>
    );
};

export default About;
