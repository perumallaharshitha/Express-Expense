import React, { useState, useRef, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './Graphs.css';

const DailyReport = () => {
    const [date, setDate] = useState(new Date());
    const barChartRef = useRef();
    const pieChartRef = useRef();

    // Example data for categories
    const categories = ['Travel', 'Food', 'Subscription', 'Clothing', 'Jewelry', 'Medical'];
    const dataValues = [200, 150, 100, 80, 60, 40]; // Sample data for today

    const barData = {
        labels: categories,
        datasets: [{
            label: 'Daily Expenses',
            data: dataValues,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
        }]
    };

    const pieData = {
        labels: categories,
        datasets: [{
            data: dataValues,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
        }]
    };

    useEffect(() => {
        // Cleanup function to destroy chart instances
        return () => {
            if (barChartRef.current) {
                const chartInstance = barChartRef.current.chartInstance;
                if (chartInstance) {
                    chartInstance.destroy();
                }
            }
            if (pieChartRef.current) {
                const chartInstance = pieChartRef.current.chartInstance;
                if (chartInstance) {
                    chartInstance.destroy();
                }
            }
        };
    }, []);

    return (
        <div className="container">
            <Link to="/reports" className="back-link">← Back</Link>
            <h1>Daily Report</h1>
            <input
                type="date"
                value={date.toISOString().split('T')[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="date-picker"
            />
            <div className="graph-container">
                <div className="graph">
                    <Bar ref={barChartRef} data={barData} options={{ maintainAspectRatio: false }} />
                </div>
                <div className="graph">
                    <Pie ref={pieChartRef} data={pieData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default DailyReport;
