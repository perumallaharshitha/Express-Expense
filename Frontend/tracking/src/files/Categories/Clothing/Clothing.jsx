import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Clothing.css';

function Clothing() {
  const [clothItems, setClothItems] = useState([]);
  const [clothName, setClothName] = useState('');
  const [clothQuantity, setClothQuantity] = useState('');
  const [clothAmount, setClothAmount] = useState('');
  const [clothPaymentDate, setClothPaymentDate] = useState(new Date()); // Added payment date
  const [clothIsEditing, setClothIsEditing] = useState(false);
  const [clothEditId, setClothEditId] = useState(null);
  const [clothTotalAmount, setClothTotalAmount] = useState(0);
  const [clothSelectedDate, setClothSelectedDate] = useState(new Date()); // For filtering

  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage

  useEffect(() => {
    const fetchClothings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/category-api/get/clothing', { // Corrected endpoint
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filtered = response.data.data.filter(
          (item) =>
            new Date(item.paymentDate).toDateString() ===
            clothSelectedDate.toDateString()
        );
        setClothItems(filtered);
        const total = filtered.reduce((sum, item) => sum + item.amount, 0);
        setClothTotalAmount(total);
      } catch (error) {
        console.error('Error fetching clothings:', error);
      }
    };
    fetchClothings();
  }, [token, clothSelectedDate]);

  const clothAddItem = async () => {
    if (!clothName || !clothQuantity || !clothAmount || !clothPaymentDate) return;

    const newItem = {
      name: clothName,
      quantity: parseInt(clothQuantity),
      amount: parseFloat(clothAmount),
      paymentDate: clothPaymentDate, // Include payment date
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/category-api/add/clothing', // Corrected endpoint
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newEntry = response.data.data;
      if (new Date(newEntry.paymentDate).toDateString() === clothSelectedDate.toDateString()) {
        setClothItems([...clothItems, newEntry]);
        setClothTotalAmount((prev) => prev + parseFloat(clothAmount));
      }
      clothResetFields();
    } catch (error) {
      console.error('Error adding clothing:', error);
    }
  };

  const clothSaveEditedItem = async () => {
    if (!clothName || !clothQuantity || !clothAmount || !clothPaymentDate) return;

    const updatedItem = {
      name: clothName,
      quantity: parseInt(clothQuantity),
      amount: parseFloat(clothAmount),
      paymentDate: clothPaymentDate, // Include payment date
    };

    try {
      await axios.put(
        `http://localhost:5000/category-api/update/${clothEditId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedItems = clothItems.map((item) =>
        item._id === clothEditId ? { ...item, ...updatedItem } : item
      );
      setClothItems(updatedItems);
      setClothTotalAmount(updatedItems.reduce((sum, item) => sum + item.amount, 0));
      clothResetFields();
      setClothIsEditing(false);
      setClothEditId(null);
    } catch (error) {
      console.error('Error saving edited clothing:', error);
    }
  };

  const clothDeleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/category-api/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filtered = clothItems.filter((item) => item._id !== id);
      setClothItems(filtered);
      setClothTotalAmount(filtered.reduce((sum, item) => sum + item.amount, 0));
    } catch (error) {
      console.error('Error deleting clothing:', error);
    }
  };

  const clothEditItem = (id) => {
    const itemToEdit = clothItems.find((item) => item._id === id);
    if(itemToEdit){
      setClothName(itemToEdit.name);
      setClothQuantity(itemToEdit.quantity);
      setClothAmount(itemToEdit.amount);
      setClothPaymentDate(new Date(itemToEdit.paymentDate)); // Set payment date for editing
      setClothIsEditing(true);
      setClothEditId(id);
    }

  };

  const clothResetFields = () => {
    setClothName('');
    setClothQuantity('');
    setClothAmount('');
    setClothPaymentDate(new Date()); // Reset payment date
  };

  return (
    <div className="cloth-container">
      <div className="cloth-header">
        <Link to="/category" className="cloth-home-icon">
          <FaHome size={24} color="#000000" />
        </Link>
        <h2>New Arrivals!!</h2>
        <div className="cloth-datepicker">
          <DatePicker
            selected={clothSelectedDate}
            onChange={(date) => setClothSelectedDate(date)}
            dateFormat="MMMM d,pppp"
            className="cloth-datepicker-input"
          />
        </div>
      </div>

      <div className="cloth-input-container">
        <div className="cloth-input-group">
          <label>Name</label>
          <input
            type="text"
            value={clothName}
            onChange={(e) => setClothName(e.target.value)}
            className="cloth-input-field"
          />
        </div>
        <div className="cloth-input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={clothQuantity}
            onChange={(e) => setClothQuantity(e.target.value)}
            className="cloth-input-field"
          />
        </div>
        <div className="cloth-input-group">
          <label>Amount</label>
          <input
            type="number"
            value={clothAmount}
            onChange={(e) => setClothAmount(e.target.value)}
            className="cloth-input-field"
          />
        </div>
        <button className="cloth-save-button" onClick={clothIsEditing ? clothSaveEditedItem : clothAddItem}>
          {clothIsEditing ? 'Save' : 'Add'}
        </button>
      </div>

      <div className="cloth-table-container">
        <table className="cloth-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clothItems.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.amount}</td>
                <td>
                  <FaEdit
                    className="cloth-edit-icon"
                    onClick={() => clothEditItem(item._id)}
                  />
                  <FaTrash
                    className="cloth-delete-icon"
                    onClick={() => clothDeleteItem(item._id)}
                  />
                </td>
              </tr>
            ))}
            {clothItems.length > 0 && (
              <tr>
                <td colSpan="3">Grand Total</td>
                <td>{clothTotalAmount}</td>
                <td></td> {/* Empty cell for actions column */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clothing;
