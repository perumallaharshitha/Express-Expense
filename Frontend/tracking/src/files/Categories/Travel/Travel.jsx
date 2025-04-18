import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Ensure this is imported
import 'react-datepicker/dist/react-datepicker.css';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import './Travel.css';

function Travel() {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [registrationDate, setRegistrationDate] = useState(null);
  const [destination, setDestination] = useState('');
  const [arrival, setArrival] = useState('');
  const [itemCost, setItemCost] = useState(''); // Changed from price to itemCost
  const [itemTotal, setItemTotal] = useState(''); // Changed from amount to itemTotal

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
    if (!destination || !arrival || !itemCost) return;
    const newItem = {
      id: items.length + 1,
      destination,
      arrival,
      price: parseFloat(itemCost), // Keep the name "price" for the item object
      amount: parseFloat(itemCost), // Keep the name "amount" for the item object
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
      item.id === editId ? { ...item, destination, arrival, price: parseFloat(itemCost), amount: parseFloat(itemCost) } : item
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
    setDestination(itemToEdit.destination);
    setArrival(itemToEdit.arrival);
    setItemCost(itemToEdit.price); // Updated to itemCost
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
    setDestination('');
    setArrival('');
    setItemCost('');
    setItemTotal('');
  };

  return (
    <div className="travel-container">
      <div className="travel-header">
        <Link to="/category" className="home-icon">
          <FaHome size={24} />
        </Link>
        <h2>Travel Expenses</h2>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      <div className="travel">
        <table className="travel-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Destination</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.destination}</td>
                <td>{item.arrival}</td>
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
              <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
              <input type="text" placeholder="Arrival" value={arrival} onChange={(e) => setArrival(e.target.value)} />
              <input type="number" placeholder="Price" value={itemCost} onChange={(e) => setItemCost(e.target.value)} /> {/* Updated to itemCost */}
              <input type="number" placeholder="Amount" value={itemTotal} readOnly /> {/* Updated to itemTotal */}
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

export default Travel;
