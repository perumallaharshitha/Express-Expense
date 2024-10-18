import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Food.css';

function Food() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(''); 
  const [quantity, setQuantity] = useState(''); 
  const [price, setPrice] = useState(''); 
  const [amount, setAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [registrationDate, setRegistrationDate] = useState(null);

  // Fetch registration date from the backend
  useEffect(() => {
    async function fetchRegistrationDate() {
      try {
        const response = await fetch('/APIs/registration.js', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setRegistrationDate(new Date(data.registrationDate));
      } catch (error) {
        console.error('Error fetching registration date:', error);
      }
    }

    fetchRegistrationDate();
  }, []);

  // Load items based on selected date
  useEffect(() => {
    const storedData = localStorage.getItem(selectedDate.toDateString());
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setItems(parsedData.items);
      setTotalAmount(parsedData.totalAmount);
    } else {
      setItems([]);
      setTotalAmount(0);
    }
  }, [selectedDate]);

  const addItem = () => {
    if (!item || !quantity || !price) return;
    const newItem = {
      id: items.length + 1,
      item,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      amount: parseFloat(price) * parseInt(quantity),
    };
    const updatedItems = [...items, newItem];
    const updatedTotal = totalAmount + newItem.amount;

    setItems(updatedItems);
    setTotalAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsAdding(false);
  };

  const saveEditedItem = () => {
    const updatedItems = items.map((item) =>
      item.id === editId ? { ...item, item, quantity: parseInt(quantity), price: parseFloat(price), amount: parseFloat(price) * parseInt(quantity) } : item
    );
    const updatedTotal = updatedItems.reduce((total, item) => total + item.amount, 0);

    setItems(updatedItems);
    setTotalAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsAdding(false);
    setEditId(null);
  };

  const editItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setItem(itemToEdit.item);
    setQuantity(itemToEdit.quantity);
    setPrice(itemToEdit.price);
    setIsAdding(true);
    setEditId(id);
  };

  const deleteItem = (id) => {
    const itemToDelete = items.find((item) => item.id === id);
    const updatedItems = items.filter((item) => item.id !== id);
    const updatedTotal = totalAmount - itemToDelete.amount;

    setItems(updatedItems);
    setTotalAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));
  };

  const resetFields = () => {
    setItem('');
    setQuantity('');
    setPrice('');
    setAmount('');
  };

  return (
    <div className="food-container">
      <div className="food-header">
        <Link to="/category" className="home-icon">
          <FaHome size={24} />
        </Link>
        <h2>Food Expenses</h2>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      <div className="food">
        <table className="food-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
                <td>
                  <FaEdit className="edit-icon" onClick={() => editItem(item.id)} />
                  <FaTrash className="delete-icon" onClick={() => deleteItem(item.id)} />
                </td>
              </tr>
            ))}
            {items.length > 0 && (
              <tr>
                <td colSpan="4">Total</td>
                <td>{totalAmount}</td>
              </tr>
            )}
          </tbody>
        </table>

        {isAdding && (
          <div className="input-container">
            <div className="input-row">
              <input type="text" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
              <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
              <input type="number" placeholder="Amount" value={amount} readOnly />
            </div>
            <button className="save-button" onClick={editId ? saveEditedItem : addItem}>
              {editId ? 'Save' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {!isAdding && (
        <button className="new-button" onClick={() => setIsAdding(true)}>New</button>
      )}
    </div>
  );
}

export default Food;
