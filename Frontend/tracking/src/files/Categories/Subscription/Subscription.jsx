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

  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage

  // Fetch subscriptions from the backend and filter by selected date
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/category-api/get/subscriptions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter by selected date (paymentDate)
        const filtered = response.data.data.filter(
          (item) =>
            new Date(item.paymentDate).toDateString() ===
            subSelectedDate.toDateString()
        );

        setSubItems(filtered);
        const total = filtered.reduce((sum, item) => sum + item.price, 0);
        setSubTotalAmount(total);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };
    fetchSubscriptions();
  }, [subSelectedDate, token]);

  const subAddItem = async () => {
    if (
      !subName ||
      !subId ||
      !subStartDate ||
      !subEndDate ||
      !subMethod ||
      !subPrice ||
      !subPaymentDate ||
      !subNextRenewal
    )
      return;

    const newItem = {
      name: subName,
      idNumber: subId,
      startDate: subStartDate,
      endDate: subEndDate,
      method: subMethod,
      price: parseFloat(subPrice),
      paymentDate: subPaymentDate,
      nextRenewal: subNextRenewal,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/category-api/add/subscriptions',
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newEntry = response.data.data;

      // Only add if it matches selected date
      if (
        new Date(newEntry.paymentDate).toDateString() ===
        subSelectedDate.toDateString()
      ) {
        setSubItems([...subItems, newEntry]);
        setSubTotalAmount((prev) => prev + parseFloat(subPrice));
      }

      subResetFields();
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const subSaveEditedItem = async () => {
    if (
      !subName ||
      !subId ||
      !subStartDate ||
      !subEndDate ||
      !subMethod ||
      !subPrice ||
      !subPaymentDate ||
      !subNextRenewal
    )
      return;

    const updatedItem = {
      name: subName,
      idNumber: subId,
      startDate: subStartDate,
      endDate: subEndDate,
      method: subMethod,
      price: parseFloat(subPrice),
      paymentDate: subPaymentDate,
      nextRenewal: subNextRenewal,
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

      subResetFields();
      setSubIsEditing(false);
      setSubEditId(null);
    } catch (error) {
      console.error('Error saving edited subscription:', error);
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
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const subEditItem = (id) => {
    const itemToEdit = subItems.find((item) => item._id === id);
    setSubName(itemToEdit.name);
    setSubId(itemToEdit.idNumber);
    setSubStartDate(new Date(itemToEdit.startDate));
    setSubEndDate(new Date(itemToEdit.endDate));
    setSubMethod(itemToEdit.method);
    setSubPrice(itemToEdit.price);
    setSubPaymentDate(new Date(itemToEdit.paymentDate));
    setSubNextRenewal(new Date(itemToEdit.nextRenewal));
    setSubIsEditing(true);
    setSubEditId(id);
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
            dateFormat="MMMM d, yyyy"
            className="sub-datepicker-input"
          />
        </div>
      </div>

      {/* Subscription Input Form */}
      <div className="sub-input-container">
        <div className="sub-input-group">
          <label>Name</label>
          <input type="text" value={subName} onChange={(e) => setSubName(e.target.value)} 
          className="sub-input-field"
          />
        </div>
        <div className="sub-input-group">
          <label>ID</label>
          <input type="text" value={subId} onChange={(e) => setSubId(e.target.value)} 
          className="sub-input-field"
          />
        </div>
        <div className="sub-input-group">
          <label>Start Date</label>
          <DatePicker
            selected={subStartDate}
            onChange={(date) => setSubStartDate(date)}
            dateFormat="MMMM d, yyyy"
            className="sub-datepicker-input"
          />
        </div>
        <div className="sub-input-group">
          <label>End Date</label>
          <DatePicker
            selected={subEndDate}
            onChange={(date) => setSubEndDate(date)}
            dateFormat="MMMM d, yyyy"
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
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="sub-input-group">
          <label>Amount</label>
          <input type="number" value={subPrice} onChange={(e) => setSubPrice(e.target.value)}
          className="sub-input-field"
          />
        </div>
        <div className="sub-input-group">
          <label>Date of Payment</label>
          <DatePicker
            selected={subPaymentDate}
            onChange={(date) => setSubPaymentDate(date)}
            dateFormat="MMMM d, yyyy"
            className="sub-datepicker-input"
          />
        </div>
        <div className="sub-input-group">
          <label>Next Renewal</label>
          <DatePicker
            selected={subNextRenewal}
            onChange={(date) => setSubNextRenewal(date)}
            dateFormat="MMMM d, yyyy"
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
                <td>{subTotalAmount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Subscription;
