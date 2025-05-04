import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Medical.css';

function Medical() {
  const [medicalItems, setMedicalItems] = useState([]);
  const [medicalName, setMedicalName] = useState('');
  const [medicalIllness, setMedicalIllness] = useState('');
  const [medicalQuantity, setMedicalQuantity] = useState('');
  const [medicalAmount, setMedicalAmount] = useState('');
  const [medicalRecordDate, setMedicalRecordDate] = useState(new Date());
  const [medicalIsEditing, setMedicalIsEditing] = useState(false);
  const [medicalEditId, setMedicalEditId] = useState(null);
  const [medicalTotalAmount, setMedicalTotalAmount] = useState(0);
  const [medicalSelectedDate, setMedicalSelectedDate] = useState(new Date());

  const token = localStorage.getItem('token');

  const fetchMedicalItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/category-api/get/medical', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filtered = response.data.data.filter(
        (item) =>
          new Date(item.recordDate).toDateString() ===
          medicalSelectedDate.toDateString()
      );
      setMedicalItems(filtered);
      const total = filtered.reduce((sum, item) => sum + item.amount, 0);
      setMedicalTotalAmount(total);
    } catch (error) {
      console.error('Error fetching medical items:', error);
    }
  };

  const medicalAddItem = async () => {
    if (!medicalName || !medicalIllness || !medicalQuantity || !medicalAmount || !medicalRecordDate) return;

    const newItem = {
      name: medicalName,
      illness: medicalIllness,
      quantity: parseInt(medicalQuantity),
      amount: parseFloat(medicalAmount),
      recordDate: medicalRecordDate,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/category-api/add/medical',
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newEntry = response.data.data;
      if (new Date(newEntry.recordDate).toDateString() === medicalSelectedDate.toDateString()) {
        setMedicalItems([...medicalItems, newEntry]);
        setMedicalTotalAmount((prev) => prev + parseFloat(medicalAmount));
      }
      medicalResetFields();
    } catch (error) {
      console.error('Error adding medical item:', error);
    }
  };

  const medicalSaveEditedItem = async () => {
    if (!medicalName || !medicalIllness || !medicalQuantity || !medicalAmount || !medicalRecordDate) return;

    const updatedItem = {
      name: medicalName,
      illness: medicalIllness,
      quantity: parseInt(medicalQuantity),
      amount: parseFloat(medicalAmount),
      recordDate: medicalRecordDate,
    };

    try {
      await axios.put(
        `http://localhost:5000/category-api/update/${medicalEditId}`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedItems = medicalItems.map((item) =>
        item._id === medicalEditId ? { ...item, ...updatedItem } : item
      );
      setMedicalItems(updatedItems);
      setMedicalTotalAmount(updatedItems.reduce((sum, item) => sum + item.amount, 0));
      medicalResetFields();
      setMedicalIsEditing(false);
      setMedicalEditId(null);
    } catch (error) {
      console.error('Error saving edited medical item:', error);
    }
  };

  const medicalDeleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/category-api/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filtered = medicalItems.filter((item) => item._id !== id);
      setMedicalItems(filtered);
      setMedicalTotalAmount(filtered.reduce((sum, item) => sum + item.amount, 0));
    } catch (error) {
      console.error('Error deleting medical item:', error);
    }
  };

  const medicalEditItem = (id) => {
    const itemToEdit = medicalItems.find((item) => item._id === id);
    if (itemToEdit) {
      setMedicalName(itemToEdit.name);
      setMedicalIllness(itemToEdit.illness);
      setMedicalQuantity(itemToEdit.quantity);
      setMedicalAmount(itemToEdit.amount);
      setMedicalRecordDate(new Date(itemToEdit.recordDate));
      setMedicalIsEditing(true);
      setMedicalEditId(id);
    }

  };

  const medicalResetFields = () => {
    setMedicalName('');
    setMedicalIllness('');
    setMedicalQuantity('');
    setMedicalAmount('');
    setMedicalRecordDate(new Date());
  };

  useEffect(() => {
    fetchMedicalItems();
  }, [medicalSelectedDate]);

  return (
    <div className="medical-container">
      <div className="medical-header">
        <Link to="/category" className="medical-home-icon">
          <FaHome size={24} color="#000000" />
        </Link>
        <h2>Medical Records</h2>
        <div className="medical-datepicker">
          <DatePicker
            selected={medicalSelectedDate}
            onChange={(date) => setMedicalSelectedDate(date)}
            dateFormat="MMMM d,yyyy"
            className="medical-datepicker-input"
          />
        </div>
      </div>

      <div className="medical-input-container">
        <div className="medical-input-row">
          <div className="medical-input-group">
            <label>Name</label>
            <input
              type="text"
              value={medicalName}
              onChange={(e) => setMedicalName(e.target.value)}
              className="medical-input-field"
            />
          </div>
          <div className="medical-input-group">
            <label>Illness</label>
            <input
              type="text"
              value={medicalIllness}
              onChange={(e) => setMedicalIllness(e.target.value)}
              className="medical-input-field"
            />
          </div>
          <div className="medical-input-group">
            <label>Quantity</label>
            <input
              type="number"
              value={medicalQuantity}
              onChange={(e) => setMedicalQuantity(e.target.value)}
              className="medical-input-field"
            />
          </div>
          <div className="medical-input-group">
            <label>Amount</label>
            <input
              type="number"
              value={medicalAmount}
              onChange={(e) => setMedicalAmount(e.target.value)}
              className="medical-input-field"
            />
          </div>
          <button className="medical-save-button" onClick={medicalIsEditing ? medicalSaveEditedItem : medicalAddItem}>
            {medicalIsEditing ? 'Save' : 'Add'}
          </button>
        </div>
      </div>

      <div className="medical-table-container">
        <table className="medical-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Name</th>
              <th>Illness</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicalItems.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.illness}</td>
                <td>{item.quantity}</td>
                <td>{item.amount}</td>
                <td>
                  <FaEdit
                    className="medical-edit-icon"
                    onClick={() => medicalEditItem(item._id)}
                  />
                  <FaTrash
                    className="medical-delete-icon"
                    onClick={() => medicalDeleteItem(item._id)}
                  />
                </td>
              </tr>
            ))}
            {medicalItems.length > 0 && (
              <tr>
                <td colSpan="4">Grand Total</td>
                <td>{medicalTotalAmount}</td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Medical;

