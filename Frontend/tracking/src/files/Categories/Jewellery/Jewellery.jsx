import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Jewellery.css';

function Jewellery() {
  const [jewelleryItems, setJewelleryItems] = useState([]);
  const [jewelleryName, setJewelleryName] = useState('');
  const [jewelleryType, setJewelleryType] = useState('');
  const [jewelleryWeight, setJewelleryWeight] = useState('');
  const [jewelleryAmount, setJewelleryAmount] = useState('');
  const [jewelleryPaymentDate, setJewelleryPaymentDate] = useState(new Date()); // Added payment date
  const [jewelleryIsEditing, setJewelleryIsEditing] = useState(false);
  const [jewelleryEditId, setJewelleryEditId] = useState(null);
  const [jewelleryTotalAmount, setJewelleryTotalAmount] = useState(0);
  const [jewellerySelectedDate, setJewellerySelectedDate] = useState(new Date()); // For filtering

  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage

  useEffect(() => {
    const fetchJewellery = async () => {
      try {
        const response = await axios.get('http://localhost:5000/category-api/get/jewellery', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filtered = response.data.data.filter(
          (item) =>
            new Date(item.paymentDate).toDateString() ===
            jewellerySelectedDate.toDateString()
        );
        setJewelleryItems(filtered);
        const total = filtered.reduce((sum, item) => sum + item.amount, 0);
        setJewelleryTotalAmount(total);
      } catch (error) {
        console.error('Error fetching jewellery:', error);
      }
    };
    fetchJewellery();
  }, [token, jewellerySelectedDate]);

  const jewelleryAddItem = async () => {
    if (!jewelleryName || !jewelleryType || !jewelleryWeight || !jewelleryAmount || !jewelleryPaymentDate) return;

    const newItem = {
      name: jewelleryName,
      type: jewelleryType,
      weight: parseFloat(jewelleryWeight),
      amount: parseFloat(jewelleryAmount),
      paymentDate: jewelleryPaymentDate, // Include payment date
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/category-api/add/jewellery',
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newEntry = response.data.data;
      if (new Date(newEntry.paymentDate).toDateString() === jewellerySelectedDate.toDateString()) {
        setJewelleryItems([...jewelleryItems, newEntry]);
        setJewelleryTotalAmount((prev) => prev + parseFloat(jewelleryAmount));
      }
      jewelleryResetFields();
    } catch (error) {
      console.error('Error adding jewellery:', error);
    }
  };

  const jewellerySaveEditedItem = async () => {
    if (!jewelleryName || !jewelleryType || !jewelleryWeight || !jewelleryAmount || !jewelleryPaymentDate) return;

    const updatedItem = {
      name: jewelleryName,
      type: jewelleryType,
      weight: parseFloat(jewelleryWeight),
      amount: parseFloat(jewelleryAmount),
      paymentDate: jewelleryPaymentDate, // Include payment date
    };

    try {
      await axios.put(
        `http://localhost:5000/category-api/update/${jewelleryEditId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedItems = jewelleryItems.map((item) =>
        item._id === jewelleryEditId ? { ...item, ...updatedItem } : item
      );
      setJewelleryItems(updatedItems);
      setJewelleryTotalAmount(updatedItems.reduce((sum, item) => sum + item.amount, 0));
      jewelleryResetFields();
      setJewelleryIsEditing(false);
      setJewelleryEditId(null);
    } catch (error) {
      console.error('Error saving edited jewellery:', error);
    }
  };

  const jewelleryDeleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/category-api/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filtered = jewelleryItems.filter((item) => item._id !== id);
      setJewelleryItems(filtered);
      setJewelleryTotalAmount(filtered.reduce((sum, item) => sum + item.amount, 0));
    } catch (error) {
      console.error('Error deleting jewellery:', error);
    }
  };

  const jewelleryEditItem = (id) => {
    const itemToEdit = jewelleryItems.find((item) => item._id === id);
    if(itemToEdit){
        setJewelleryName(itemToEdit.name);
        setJewelleryType(itemToEdit.type);
        setJewelleryWeight(itemToEdit.weight);
        setJewelleryAmount(itemToEdit.amount);
        setJewelleryPaymentDate(new Date(itemToEdit.paymentDate)); // Set payment date for editing
        setJewelleryIsEditing(true);
        setJewelleryEditId(id);
    }

  };

  const jewelleryResetFields = () => {
    setJewelleryName('');
    setJewelleryType('');
    setJewelleryWeight('');
    setJewelleryAmount('');
    setJewelleryPaymentDate(new Date()); // Reset payment date
  };

  return (
    <div className="jewellery-container">
      <div className="jewellery-header">
        <Link to="/category" className="jewellery-home-icon">
          <FaHome size={24} color="#000000" />
        </Link>
        <h2>Exquisite Jewellery!!</h2>
        <div className="jewellery-datepicker">
          <DatePicker
            selected={jewellerySelectedDate}
            onChange={(date) => setJewellerySelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            className="jewellery-datepicker-input"
          />
        </div>
      </div>

      <div className="jewellery-input-container">
        <div className="jewellery-input-row">
          <div className="jewellery-input-group">
            <label>Name</label>
            <input
              type="text"
              value={jewelleryName}
              onChange={(e) => setJewelleryName(e.target.value)}
              className="jewellery-input-field"
            />
          </div>
          <div className="jewellery-input-group">
            <label>Type</label>
            <select
              value={jewelleryType}
              onChange={(e) => setJewelleryType(e.target.value)}
              className="jewellery-input-field"
            >
              <option value="">Select Type</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Diamonds">Diamonds</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          <div className="jewellery-input-group">
            <label>Weight</label>
            <input
              type="number"
              step="0.01"
              value={jewelleryWeight}
              onChange={(e) => setJewelleryWeight(e.target.value)}
              className="jewellery-input-field"
            />
          </div>
          <div className="jewellery-input-group">
            <label>Amount</label>
            <input
              type="number"
              value={jewelleryAmount}
              onChange={(e) => setJewelleryAmount(e.target.value)}
              className="jewellery-input-field"
            />
          </div>
          <button className="jewellery-save-button" onClick={jewelleryIsEditing ? jewellerySaveEditedItem : jewelleryAddItem}>
            {jewelleryIsEditing ? 'Save' : 'Add'}
          </button>
        </div>

      </div>

      <div className="jewellery-table-container">
        <table className="jewellery-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Name</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jewelleryItems.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.weight}</td>
                <td>{item.amount}</td>
                <td>
                  <FaEdit
                    className="jewellery-edit-icon"
                    onClick={() => jewelleryEditItem(item._id)}
                  />
                  <FaTrash
                    className="jewellery-delete-icon"
                    onClick={() => jewelleryDeleteItem(item._id)}
                  />
                </td>
              </tr>
            ))}
            {jewelleryItems.length > 0 && (
              <tr>
                <td colSpan="5">Grand Total</td>
                <td>{jewelleryTotalAmount}</td>
                <td></td> {/* Empty cell for actions column */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Jewellery;
