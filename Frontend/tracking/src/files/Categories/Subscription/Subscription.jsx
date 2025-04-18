import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import './Subscription.css';

function Subscription() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [method, setMethod] = useState('');
  const [price, setPrice] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [nextRenewal, setNextRenewal] = useState('');
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
    if (!name || !id || !startDate || !endDate || !method || !price || !paymentDate || !nextRenewal) return;
    const newItem = {
      id: items.length + 1,
      name,
      idNumber: id,
      startDate,
      endDate,
      method,
      price: parseFloat(price),
      paymentDate,
      nextRenewal,
    };
    const updatedItems = [...items, newItem];
    const updatedTotal = totalAmount + parseFloat(price);

    setItems(updatedItems);
    setTotalAmount(updatedTotal);

    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsEditing(false);
  };

  const saveEditedItem = () => {
    if (!name || !id || !startDate || !endDate || !method || !price || !paymentDate || !nextRenewal) return;

    const updatedItems = items.map((item) => 
      item.id === editId ? { ...item, name, idNumber: id, startDate, endDate, method, price: parseFloat(price), paymentDate, nextRenewal } : item
    );
    const updatedTotal = updatedItems.reduce((total, item) => total + item.price, 0);

    setItems(updatedItems);
    setTotalAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsEditing(false);
    setEditId(null);
  };

  const editItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setName(itemToEdit.name);
    setId(itemToEdit.idNumber);
    setStartDate(itemToEdit.startDate);
    setEndDate(itemToEdit.endDate);
    setMethod(itemToEdit.method);
    setPrice(itemToEdit.price);
    setPaymentDate(itemToEdit.paymentDate);
    setNextRenewal(itemToEdit.nextRenewal);
    setIsEditing(true);
    setEditId(id);
  };

  const deleteItem = (id) => {
    const itemToDelete = items.find((item) => item.id === id);
    const updatedItems = items.filter((item) => item.id !== id);
    const updatedTotal = totalAmount - itemToDelete.price;

    setItems(updatedItems);
    setTotalAmount(updatedTotal);

    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));
  };

  const resetFields = () => {
    setName('');
    setId('');
    setStartDate('');
    setEndDate('');
    setMethod('');
    setPrice('');
    setPaymentDate('');
    setNextRenewal('');
  };

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <Link to="/category" className="home-icon">
          <FaHome size={24} />
        </Link>
        <h2>Subscribed Bills!!</h2>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="subscription-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Id</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Method</th>
              <th>Price</th>
              <th>Payment Date</th>
              <th>Next Renewal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.idNumber}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.method}</td>
                <td>{item.price}</td>
                <td>{item.paymentDate}</td>
                <td>{item.nextRenewal}</td>
                <td>
                  <FaEdit className="edit-icon" onClick={() => editItem(item.id)} />
                  <FaTrash className="delete-icon" onClick={() => deleteItem(item.id)} />
                </td>
              </tr>
            ))}
            {items.length > 0 && (
              <tr>
                <td colSpan="8">Grand Total</td>
                <td>{totalAmount}</td>
              </tr>
            )}
          </tbody>
        </table>

        {(isEditing || items.length === 0) && (
          <div className="input-container">
            <div className="input-row">
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder="Id" value={id} onChange={(e) => setId(e.target.value)} />
              <input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <input type="text" placeholder="Method" value={method} onChange={(e) => setMethod(e.target.value)} />
              <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
              <input type="date" placeholder="Payment Date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
              <input type="date" placeholder="Next Renewal" value={nextRenewal} onChange={(e) => setNextRenewal(e.target.value)} />
            </div>
            <button className="save-button" onClick={isEditing ? saveEditedItem : addItem}>
              {isEditing ? 'Save' : 'Add'}
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <button className="new-button" onClick={() => { resetFields(); setIsEditing(false); setEditId(null); setIsAdding(true); }}>New</button>
      )}
    </div>
  );
}

export default Subscription;
