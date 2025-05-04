import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getValidTokenOrLogout } from '../../contexts/auth';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import './Travel.css';

export default function Travel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [travelFromName, setTravelFromName] = useState('');
  const [travelFromDate, setTravelFromDate] = useState(new Date());
  const [travelToName, setTravelToName] = useState('');
  const [travelToDate, setTravelToDate] = useState(new Date());
  const [travelAmount, setTravelAmount] = useState('');
  const [travelDateRecorded, setTravelDateRecorded] = useState(new Date()); // Added for consistency
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Added for filtering
  const [totalAmount, setTotalAmount] = useState(0);

  const token = localStorage.getItem('token');

  const travelFetchEntries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/category-api/get/travel", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = res.data.data.filter(
        (item) =>
          new Date(item.DateRecorded).toDateString() ===
          selectedDate.toDateString()
      );
      setEntries(filtered);
      setTotalAmount(filtered.reduce((sum, item) => sum + item.Amount, 0));
    } catch (err) {
      setMessage("Failed to fetch travel data.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const travelAddEntry = async () => {
    if (!travelFromName || !travelFromDate || !travelToName || !travelToDate || !travelAmount) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const newEntry = {
        FromName: travelFromName,
        FromDate: travelFromDate,
        ToName: travelToName,
        ToDate: travelToDate,
        Amount: parseFloat(travelAmount),
        DateRecorded: travelDateRecorded,
      };
      const res = await axios.post("http://localhost:5000/category-api/add/travel", newEntry, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newEntryWithId = res.data.data; // Assuming your backend returns the newly created entry with an ID
      if (new Date(newEntryWithId.DateRecorded).toDateString() === selectedDate.toDateString()) {
        setEntries([...entries, newEntryWithId]);
        setTotalAmount(prev => prev + parseFloat(travelAmount));
      }
      setMessage("Entry added successfully!");
      travelResetFields();
    } catch (err) {
      setMessage("Failed to add entry.");
      console.error("Add error:", err);
    }
  };

  const travelHandleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/category-api/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedEntries = entries.filter((entry) => entry._id !== id);
      setEntries(updatedEntries);
      setTotalAmount(updatedEntries.reduce((sum, item) => sum + item.Amount, 0));
      setMessage("Entry deleted successfully!");
    } catch (err) {
      setMessage("Failed to delete entry.");
      console.error("Delete error:", err);
    }
  };

  const travelHandleEdit = (id) => {
    const entryToEdit = entries.find((entry) => entry._id === id);
    if(entryToEdit){
        setTravelFromName(entryToEdit.FromName);
        setTravelFromDate(new Date(entryToDate.FromDate));
        setTravelToName(entryToEdit.ToName);
        setTravelToDate(new Date(entryToEdit.ToDate));
        setTravelAmount(entryToEdit.Amount);
        setTravelDateRecorded(new Date(entryToEdit.DateRecorded));
        setIsEditing(true);
        setEditId(id);
    }

  };

  const travelSaveEditedItem = async () => {
    try {
      const updatedItem = {
        FromName: travelFromName,
        FromDate: travelFromDate,
        ToName: travelToName,
        ToDate: travelToDate,
        Amount: parseFloat(travelAmount),
        DateRecorded: travelDateRecorded
      };

      await axios.put(`http://localhost:5000/category-api/update/${editId}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedEntries = entries.map(item =>
        item._id === editId ? { ...item, ...updatedItem } : item
      );
      setEntries(updatedEntries);
      setTotalAmount(updatedEntries.reduce((sum, item) => sum + item.Amount, 0));
      setMessage("Entry updated successfully!");
      travelResetFields();
      setIsEditing(false);
      setEditId(null);

    } catch (error) {
      setMessage("Failed to update entry.");
      console.error("Error updating entry:", error);
    }
  };

  const travelResetFields = () => {
    setTravelFromName('');
    setTravelFromDate(new Date());
    setTravelToName('');
    setTravelToDate(new Date());
    setTravelAmount('');
    setTravelDateRecorded(new Date());
  };

  useEffect(() => {
    travelFetchEntries();
  }, [selectedDate]);

  if (loading) return <div className="travel-loading">Loading...</div>;

  return (
    <div className="travel-container">
      <div className="travel-header">
        <Link to="/category" className="travel-home-icon">
          <FaHome size={24} color="#000000" />
        </Link>
        <h2>Travel Entries</h2>
        <div className="travel-datepicker">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d,yyyy"
            className="travel-datepicker-input"
          />
        </div>
      </div>

      {message && <div className="travel-message">{message}</div>}

      <div className="travel-input-container">
        <div className="travel-input-row">
          <div className="travel-input-group">
            <label>From Name</label>
            <input
              type="text"
              placeholder="From Name"
              value={travelFromName}
              onChange={(e) => setTravelFromName(e.target.value)}
              className="travel-input-field"
            />
          </div>

          <div className="travel-input-group">
            <label>From Date</label>
            <DatePicker
              selected={travelFromDate}
              onChange={(date) => setTravelFromDate(date)}
              dateFormat="MMMM d,yyyy"
              className="travel-datepicker-input"
            />
          </div>

          <div className="travel-input-group">
            <label>To Name</label>
            <input
              type="text"
              placeholder="To Name"
              value={travelToName}
              onChange={(e) => setTravelToName(e.target.value)}
              className="travel-input-field"
            />
          </div>

          <div className="travel-input-group">
            <label>To Date</label>
            <DatePicker
              selected={travelToDate}
              onChange={(date) => setTravelToDate(date)}
              dateFormat="MMMM d,yyyy"
              className="travel-datepicker-input"
            />
          </div>

          <div className="travel-input-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Amount"
              value={travelAmount}
              onChange={(e) => setTravelAmount(e.target.value)}
              className="travel-input-field"
            />
          </div>

          <button className="travel-save-button" onClick={isEditing ? travelSaveEditedItem : travelAddEntry}>
            {isEditing ? 'Save' : 'Add'}
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p>No travel entries found.</p>
      ) : (
        <div className="travel-table-container">
          <table className="travel-table">
            <thead>
              <tr>
                <th>SNO</th>
                <th>From Name</th>
                <th>From Date</th>
                <th>To Name</th>
                <th>To Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry._id}>
                  <td>{index+1}</td>
                  <td>{entry.FromName}</td>
                  <td>{new Date(entry.FromDate).toLocaleDateString()}</td>
                  <td>{entry.ToName}</td>
                  <td>{new Date(entry.ToDate).toLocaleDateString()}</td>
                  <td>{entry.Amount}</td>
                  <td>
                    <FaEdit
                      className="travel-edit-icon"
                      onClick={() => travelHandleEdit(entry._id)}
                    />
                    <FaTrash
                      className="travel-delete-icon"
                      onClick={() => travelHandleDelete(entry._id)}
                    />
                  </td>
                </tr>
              ))}
              {entries.length > 0 && (
                <tr>
                  <td colSpan="5">Grand Total</td>
                  <td>{totalAmount}</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

