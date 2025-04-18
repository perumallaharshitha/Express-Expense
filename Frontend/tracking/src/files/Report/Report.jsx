import React from 'react';
import './Report.css'; // Create a CSS file for styling
import Graph from '../../assets/bargraph.png'
import Chart from '../../assets/chart.png'

function Report() {
    return (
        <div className="report-page">
            <h1>REPORT</h1>
            <p>This page allows you to generate various types of reports.</p>
            <p>Select your desired report type and view the data visually.</p>
            <button className="get-report-btn">Get Report</button>
            <div className="image-container">
                <img src={Graph} alt="Report Visualization 1" className="report-image" />
                <img src={Chart} alt="Report Visualization 2" className="report-image" />
            </div>
        </div>
    );
}

export default Report;
