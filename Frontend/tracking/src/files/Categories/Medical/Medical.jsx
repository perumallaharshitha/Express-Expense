import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import './Medical.css';

function Food() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [purpose, setPurpose] = useState(''); 
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    if (!item || !purpose || !quantity || !amount) return;
    const newItem = {
      id: items.length + 1,
      item,
      purpose,
      quantity: parseFloat(quantity),
      amount: parseFloat(amount),
    };
    const updatedItems = [...items, newItem];
    const updatedTotal = totalAmount + parseFloat(amount);

    setItems(updatedItems);
    setTotalAmount(updatedTotal);

    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
  };

  const saveEditedItem = () => {
    if (!item || !purpose || !quantity || !amount) return;

    const updatedItems = items.map((currentItem) => 
      currentItem.id === editId ? { ...currentItem, item, purpose, quantity: parseFloat(quantity), amount: parseFloat(amount) } : currentItem
    );

    const updatedTotal = updatedItems.reduce((total, currentItem) => total + currentItem.amount, 0);

    setItems(updatedItems);
    setTotalAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsEditing(false);
    setEditId(null);
  };

  const editItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setItem(itemToEdit.item);
    setPurpose(itemToEdit.purpose);
    setQuantity(itemToEdit.quantity);
    setAmount(itemToEdit.amount);
    setIsEditing(true);
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
    setPurpose('');
    setQuantity('');
    setAmount('');
  };

  return (
    <div className="medical-container"> 
      <div className="medical-header"> 
        <Link to="/category" className="home-icon">
          <FaHome size={24} />
        </Link>
        <h2>Wellness Ensured!!</h2>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="medical-table"> 
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Purpose</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.item}</td>
                <td>{item.purpose}</td> 
                <td>{item.quantity}</td>
                <td>{item.amount}</td>
                <td>
                  <FaEdit className="edit-icon" onClick={() => editItem(item.id)} />
                  <FaTrash className="delete-icon" onClick={() => deleteItem(item.id)} />
                </td>
              </tr>
            ))}
            {items.length > 0 && (
              <tr>
                <td colSpan="4">Grand Total</td>
                <td>{totalAmount}</td>
              </tr>
            )}
          </tbody>
        </table>

        {(isEditing || items.length === 0) && (
          <div className="input-container">
            <div className="input-row">
              <input type="text" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
              <input type="text" placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <button className="save-button" onClick={isEditing ? saveEditedItem : addItem}>
              {isEditing ? 'Save' : 'Add'}
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <button className="new-button" onClick={() => { resetFields(); setIsAdding(true); }}>New</button>
      )}
    </div>
  );
}

export default Food;
