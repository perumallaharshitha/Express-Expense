import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Subscription.css';

function Subscription() {
    const [subItems, setSubItems] = useState([]);
    const [subName, setSubName] = useState('');
    const [subId, setSubId] = useState('');
    const [subStartDate, setSubStartDate] = useState(new Date());
    const [subEndDate, setSubEndDate] = useState(new Date());
    const [subMethod, setSubMethod] = useState('');
    const [subPrice, setSubPrice] = useState('');
    const [subPaymentDate, setSubPaymentDate] = useState(new Date());
    const [subNextRenewal, setSubNextRenewal] = useState(new Date());
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [subIsEditing, setSubIsEditing] = useState(false);
    const [subEditId, setSubEditId] = useState(null);
    const [subSelectedDate, setSubSelectedDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/category-api/get/subscription?paymentDate=${subSelectedDate.toISOString().split('T')[0]}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSubItems(response.data.data);
                const total = response.data.data.reduce((sum, item) => sum + item.price, 0);
                setSubTotalAmount(total);
                setErrorMessage('');
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                setErrorMessage('Failed to fetch subscriptions. Please try again.');
                setSubItems([]);
                setSubTotalAmount(0);
            }
        };

        fetchSubscriptions();
    }, [subSelectedDate, token]);

    const validateInputs = () => {
        if (
            !subName.trim() ||
            !subId.trim() ||
            !subStartDate ||
            !subEndDate ||
            !subMethod ||
            !subPrice ||
            !subPaymentDate ||
            !subNextRenewal
        ) {
            setErrorMessage('Please fill in all fields.');
            setSuccessMessage('');
            return false;
        }
        if (isNaN(parseFloat(subPrice))) {
            setErrorMessage('Amount must be a valid number.');
            setSuccessMessage('');
            return false;
        }
        return true;
    };

    const subAddItem = async () => {
        if (!validateInputs()) {
            return;
        }

        const newItem = {
            name: subName.trim(),
            idNumber: subId.trim(),
            startDate: subStartDate.toISOString(),
            endDate: subEndDate.toISOString(),
            method: subMethod,
            price: parseFloat(subPrice),
            paymentDate: subPaymentDate.toISOString(),
            nextRenewal: subNextRenewal.toISOString(),
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/category-api/add/subscription',
                newItem,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newEntry = response.data.data;
            setSubItems([...subItems, newEntry]);
            setSubTotalAmount((prev) => prev + parseFloat(subPrice));
            setSuccessMessage('Subscription added successfully!');
            setErrorMessage('');
            subResetFields();
        } catch (error) {
            console.error('Error adding subscription:', error);
            setErrorMessage('Failed to add subscription. Please try again.');
            setSuccessMessage('');
        }
    };

    const subSaveEditedItem = async () => {
        if (!validateInputs()) {
            return;
        }

        const updatedItem = {
            name: subName.trim(),
            idNumber: subId.trim(),
            startDate: subStartDate.toISOString(),
            endDate: subEndDate.toISOString(),
            method: subMethod,
            price: parseFloat(subPrice),
            paymentDate: subPaymentDate.toISOString(),
            nextRenewal: subNextRenewal.toISOString(),
        };

        try {
            await axios.put(
                `http://localhost:5000/category-api/update/${subEditId}`,
                updatedItem,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedItems = subItems.map((item) =>
                item._id === subEditId ? { ...item, ...updatedItem } : item
            );

            setSubItems(updatedItems);
            setSubTotalAmount(
                updatedItems.reduce((sum, item) => sum + item.price, 0)
            );

            setSuccessMessage('Subscription updated successfully!');
            setErrorMessage('');
            subResetFields();
            setSubIsEditing(false);
            setSubEditId(null);
        } catch (error) {
            console.error('Error saving edited subscription:', error);
            setErrorMessage('Failed to update subscription. Please try again.');
            setSuccessMessage('');
        }
    };

    const subDeleteItem = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/category-api/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const filtered = subItems.filter((item) => item._id !== id);
            setSubItems(filtered);
            setSubTotalAmount(filtered.reduce((sum, item) => sum + item.price, 0));
            setSuccessMessage('Subscription deleted successfully!');
            setErrorMessage('');
        } catch (error) {
            console.error('Error deleting subscription:', error);
            setErrorMessage('Failed to delete subscription. Please try again.');
            setSuccessMessage('');
        }
    };

    const subEditItem = (id) => {
        const itemToEdit = subItems.find((item) => item._id === id);
        if (itemToEdit) {
            setSubName(itemToEdit.name);
            setSubId(itemToEdit.idNumber);
            setSubStartDate(new Date(itemToEdit.startDate));
            setSubEndDate(new Date(itemToEdit.endDate));
            setSubMethod(itemToEdit.method);
            setSubPrice(itemToEdit.price.toString());
            setSubPaymentDate(new Date(itemToEdit.paymentDate));
            setSubNextRenewal(new Date(itemToEdit.nextRenewal));
            setSubIsEditing(true);
            setSubEditId(id);
            setErrorMessage('');
            setSuccessMessage('');
        }
    };

    const subResetFields = () => {
        setSubName('');
        setSubId('');
        setSubMethod('');
        setSubPrice('');
        setSubStartDate(new Date());
        setSubEndDate(new Date());
        setSubPaymentDate(new Date());
        setSubNextRenewal(new Date());
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className="sub-container">
            <div className="sub-header">
                <Link to="/category" className="sub-home-icon">
                    <FaHome size={24} color="#000000" />
                </Link>
                <h2>Subscribed Bills!!</h2>
                <div className="sub-datepicker">
                    <DatePicker
                        selected={subSelectedDate}
                        onChange={(date) => setSubSelectedDate(date)}
                        dateFormat="MMMM d,yyyy"
                        className="sub-datepicker-input"
                    />
                </div>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {/* Subscription Input Form */}
            <div className="sub-input-container">
                <div className="sub-input-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        className="sub-input-field"
                    />
                </div>
                <div className="sub-input-group">
                    <label>ID</label>
                    <input
                        type="text"
                        value={subId}
                        onChange={(e) => setSubId(e.target.value)}
                        className="sub-input-field"
                    />
                </div>
                <div className="sub-input-group">
                    <label>Start Date</label>
                    <DatePicker
                        selected={subStartDate}
                        onChange={(date) => setSubStartDate(date)}
                        dateFormat="MMMM d,yyyy"
                        className="sub-datepicker-input"
                    />
                </div>
                <div className="sub-input-group">
                    <label>End Date</label>
                    <DatePicker
                        selected={subEndDate}
                        onChange={(date) => setSubEndDate(date)}
                        dateFormat="MMMM d,yyyy"
                        className="sub-datepicker-input"
                    />
                </div>
                <div className="sub-input-group">
                    <label>Mode of Payment</label>
                    <select
                        value={subMethod}
                        onChange={(e) => setSubMethod(e.target.value)}
                        className="sub-input-field"
                    >
                        <option value="">Select</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                    </select>
                </div>

                <div className="sub-input-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        value={subPrice}
                        onChange={(e) => setSubPrice(e.target.value)}
                        className="sub-input-field"
                    />
                </div>
                <div className="sub-input-group">
                    <label>Date of Payment</label>
                    <DatePicker
                        selected={subPaymentDate}
                        onChange={(date) => setSubPaymentDate(date)}
                        dateFormat="MMMM d,yyyy"
                        className="sub-datepicker-input"
                    />
                </div>
                <div className="sub-input-group">
                    <label>Next Renewal</label>
                    <DatePicker
                        selected={subNextRenewal}
                        onChange={(date) => setSubNextRenewal(date)}
                        dateFormat="MMMM d,yyyy"
                        className="sub-datepicker-input"
                    />
                </div>

                <button className="sub-save-button" onClick={subIsEditing ? subSaveEditedItem : subAddItem}>
                    {subIsEditing ? 'Save' : 'Add'}
                </button>
            </div>

            {/* Subscription Table */}
            <div className="sub-table-container">
                <table className="sub-table">
                    <thead>
                        <tr>
                            <th>SNO</th>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Mode of Payment</th>
                            <th>Amount</th>
                            <th>Date of Payment</th>
                            <th>Next Renewal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subItems.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.idNumber}</td>
                                <td>{new Date(item.startDate).toLocaleDateString()}</td>
                                <td>{new Date(item.endDate).toLocaleDateString()}</td>
                                <td>{item.method}</td>
                                <td>{item.price}</td>
                                <td>{new Date(item.paymentDate).toLocaleDateString()}</td>
                                <td>{new Date(item.nextRenewal).toLocaleDateString()}</td>
                                <td>
                                    <FaEdit className="edit-icon" onClick={() => subEditItem(item._id)} />
                                    <FaTrash className="delete-icon" onClick={() => subDeleteItem(item._id)} />
                                </td>
                            </tr>
                        ))}
                        {subItems.length > 0 && (
                            <tr>
                                <td colSpan="8">Grand Total</td>
                                <td>{isNaN(subTotalAmount) ? '0' : subTotalAmount.toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Subscription;
