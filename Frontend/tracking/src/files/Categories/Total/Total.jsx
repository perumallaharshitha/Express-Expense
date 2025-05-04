import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Total.css';

function Total() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totals, setTotals] = useState({});
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            setError(null);
            try {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const response = await axios.get(
                    `http://localhost:5000/category-api/get/expenses?date=${formattedDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const expenses = response.data.data;
                console.log("Expenses from API:", expenses);

                const newTotals = {};
                let total = 0;

                expenses.forEach(item => {
                    if (item.category) {
                        newTotals[item.category] = (newTotals[item.category] || 0) + item.amount;
                        total += item.amount;
                    }
                });

                console.log("Calculated newTotals:", newTotals);
                setTotals(newTotals);
                console.log("State totals:", totals);
                setGrandTotal(total);
            } catch (err) {
                setError(err.message || 'Failed to fetch expenses');
                setTotals({});
                setGrandTotal(0);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [selectedDate, token]);

    if (loading) {
        return <div className="loading-message">Loading expenses...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="total-container">
            <div className="total-header">
                <Link to="/category" className="home-icon">
                    <FaHome size={24} />
                </Link>
                <h2>Expenses of the DAY!!</h2>
                <div className="date-picker-container">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="MMMM d, yyyy" // Updated date format to include year
                        className="total-datepicker-input"
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="total-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(totals).map(([category, amount]) => (
                            <tr key={category}>
                                <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                                <td>{amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Grand Total</td>
                            <td>{grandTotal.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default Total;