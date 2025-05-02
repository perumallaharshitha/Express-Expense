import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Food.css'; // Assuming you have a Food.css

function Food() {
  const [foodItems, setFoodItems] = useState([]);
  const [foodItem, setFoodItem] = useState('');
  const [foodPurpose, setFoodPurpose] = useState('');
  const [foodQuantity, setFoodQuantity] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [foodTotalAmount, setFoodTotalAmount] = useState(0);
  const [foodIsEditing, setFoodIsEditing] = useState(false);
  const [foodEditId, setFoodEditId] = useState(null);
  const [foodSelectedDate, setFoodSelectedDate] = useState(new Date());

  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage

  // Fetch food items from the backend and filter by selected date
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/category-api/get/food', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter by selected date (createdAt - assuming your backend has this)
        const filtered = response.data.data.filter(
          (item) =>
            new Date(item.createdAt).toDateString() ===
            foodSelectedDate.toDateString()
        );

        setFoodItems(filtered);
        const total = filtered.reduce((sum, item) => sum + item.amount, 0);
        setFoodTotalAmount(total);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };
    fetchFoodItems();
  }, [foodSelectedDate, token]);

  const foodAddItem = async () => {
    if (!foodItem || !foodPurpose || !foodQuantity || !foodAmount) {
      return;
    }

    const newItem = {
      item: foodItem,
      purpose: foodPurpose,
      quantity: parseInt(foodQuantity),
      amount: parseFloat(foodAmount),
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/category-api/add/food',
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newEntry = response.data.data;

      // Only add if it matches selected date (using createdAt from response)
      if (new Date(newEntry.createdAt).toDateString() === foodSelectedDate.toDateString()) {
        setFoodItems([...foodItems, newEntry]);
        setFoodTotalAmount((prev) => prev + parseFloat(foodAmount));
      }

      foodResetFields();
    } catch (error) {
      console.error('Error adding food item:', error);
    }
  };

  const foodSaveEditedItem = async () => {
    if (!foodItem || !foodPurpose || !foodQuantity || !foodAmount) {
      return;
    }

    const updatedItem = {
      item: foodItem,
      purpose: foodPurpose,
      quantity: parseInt(foodQuantity),
      amount: parseFloat(foodAmount),
    };

    try {
      await axios.put(
        `http://localhost:5000/category-api/update/${foodEditId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedItems = foodItems.map((item) =>
        item._id === foodEditId ? { ...item, ...updatedItem } : item
      );

      setFoodItems(updatedItems);
      setFoodTotalAmount(
        updatedItems.reduce((sum, item) => sum + item.amount, 0)
      );

      foodResetFields();
      setFoodIsEditing(false);
      setFoodEditId(null);
    } catch (error) {
      console.error('Error saving edited food item:', error);
    }
  };

  const foodDeleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/category-api/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filtered = foodItems.filter((item) => item._id !== id);
      setFoodItems(filtered);
      setFoodTotalAmount(filtered.reduce((sum, item) => sum + item.amount, 0));
    } catch (error) {
      console.error('Error deleting food item:', error);
    }
  };

  const foodEditItem = (id) => {
    const itemToEdit = foodItems.find((item) => item._id === id);
    setFoodItem(itemToEdit.item);
    setFoodPurpose(itemToEdit.purpose);
    setFoodQuantity(itemToEdit.quantity);
    setFoodAmount(itemToEdit.amount);
    setFoodIsEditing(true);
    setFoodEditId(id);
  };

  const foodResetFields = () => {
    setFoodItem('');
    setFoodPurpose('');
    setFoodQuantity('');
    setFoodAmount('');
  };

  return (
    <div className="food-container">
      <div className="food-header">
        <Link to="/category" className="food-home-icon">
          <FaHome size={24} color="#000000" />
        </Link>
        <h2>Food Expenses</h2>
        <div className="food-datepicker">
          <DatePicker
            selected={foodSelectedDate}
            onChange={(date) => setFoodSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            className="food-datepicker-input"
          />
        </div>
      </div>

      {/* Food Input Form */}
      <div className="food-input-container">
        <div className="food-input-group">
          <label>Item</label>
          <input
            type="text"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            className="food-input-field"
          />
        </div>
        <div className="food-input-group">
          <label>Purpose</label>
          <input
            type="text"
            value={foodPurpose}
            onChange={(e) => setFoodPurpose(e.target.value)}
            className="food-input-field"
          />
        </div>
        <div className="food-input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={foodQuantity}
            onChange={(e) => setFoodQuantity(e.target.value)}
            className="food-input-field"
          />
        </div>
        <div className="food-input-group">
          <label>Amount</label>
          <input
            type="number"
            value={foodAmount}
            onChange={(e) => setFoodAmount(e.target.value)}
            className="food-input-field"
          />
        </div>
        <div className="food-input-group">
          <button className="food-save-button" onClick={foodIsEditing ? foodSaveEditedItem : foodAddItem}>
            {foodIsEditing ? 'Save' : 'Add'}
          </button>
        </div>

        
      </div>

      {/* Food Table */}
      <div className="food-table-container">
        <table className="food-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Item</th>
              <th>Purpose</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.item}</td>
                <td>{item.purpose}</td>
                <td>{item.quantity}</td>
                <td>{item.amount}</td>
                <td>
                  <FaEdit className="edit-icon" onClick={() => foodEditItem(item._id)} />
                  <FaTrash className="delete-icon" onClick={() => foodDeleteItem(item._id)} />
                </td>
              </tr>
            ))}
            {foodItems.length > 0 && (
              <tr>
                <td colSpan="4">Grand Total</td>
                <td>{foodTotalAmount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Food;
