import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getValidTokenOrLogout } from '../../contexts/auth';
import DatePicker from 'react-datepicker'; // Import DatePicker
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaHome } from 'react-icons/fa'; // Import Home icon
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import './Travel.css';

export default function Travel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Input form state
  const [travelFromName, setTravelFromName] = useState('');
  const [travelFromDate, setTravelFromDate] = useState(new Date());
  const [travelToName, setTravelToName] = useState('');
  const [travelToDate, setTravelToDate] = useState(new Date());
  const [travelAmount, setTravelAmount] = useState('');
  
  // New state for the Date Recorded field (will not be shown)
  const [travelDateRecorded, setTravelDateRecorded] = useState(new Date());

  // State for success/error messages
  const [message, setMessage] = useState('');

  const travelFetchEntries = async () => {
    const token = getValidTokenOrLogout();
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/category-api/get/travel", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data.data);
    } catch (err) {
      setMessage("Failed to fetch travel data.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const travelAddEntry = async () => {
    const token = getValidTokenOrLogout();
    if (!token) return;

    if (!travelFromName || !travelFromDate || !travelToName || !travelToDate || !travelAmount) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/category-api/add/travel", {
        SNO: entries.length + 1,
        FromName: travelFromName,
        FromDate: new Date(travelFromDate), // Store as Date object
        ToName: travelToName,
        ToDate: new Date(travelToDate), // Store as Date object
        Amount: parseFloat(travelAmount),
        DateRecorded: travelDateRecorded // Store Date Recorded in DB
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage("Entry added successfully!");
      travelFetchEntries();
      // Clear inputs after adding
      setTravelFromName('');
      setTravelFromDate(new Date());
      setTravelToName('');
      setTravelToDate(new Date());
      setTravelAmount('');
    } catch (err) {
      setMessage("Failed to add entry.");
      console.error("Add error:", err);
    }
  };

  const travelHandleDelete = async (id) => {
    const token = getValidTokenOrLogout();
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/category-api/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Entry deleted successfully!");
      travelFetchEntries();
    } catch (err) {
      setMessage("Failed to delete entry.");
      console.error("Delete error:", err);
    }
  };

  const travelHandleEdit = async (id) => {
    const entry = entries.find((entry) => entry._id === id);
    setTravelFromName(entry.FromName);
    setTravelFromDate(new Date(entry.FromDate));
    setTravelToName(entry.ToName);
    setTravelToDate(new Date(entry.ToDate));
    setTravelAmount(entry.Amount);

    // Modify the add function to be an update function
    await axios.put(`http://localhost:5000/category-api/update/${id}`, {
      FromName: travelFromName,
      FromDate: travelFromDate,
      ToName: travelToName,
      ToDate: travelToDate,
      Amount: travelAmount
    });

    setMessage("Entry updated successfully!");
    travelFetchEntries();
  };

  useEffect(() => {
    travelFetchEntries();
  }, []);

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
            selected={travelDateRecorded}
            onChange={(date) => setTravelDateRecorded(date)}
            dateFormat="MMMM d, yyyy"
            className="travel-datepicker-input"
          />
        </div>
      </div>

      {message && <div className="travel-message">{message}</div>}

      <div className="travel-input-container">
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
            dateFormat="MMMM d, yyyy"
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
            dateFormat="MMMM d, yyyy"
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
        <input
          type="hidden"
          value={travelDateRecorded}
          onChange={(e) => setTravelDateRecorded(new Date(e.target.value))}
        />

        <button className="travel-save-button" onClick={travelAddEntry}>Save</button>
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
              {entries.map((entry) => (
                <tr key={entry._id}>
                  <td>{entry.SNO}</td>
                  <td>{entry.FromName}</td>
                  <td>{entry.FromDate}</td>
                  <td>{entry.ToName}</td>
                  <td>{entry.ToDate}</td>
                  <td>{entry.Amount}</td>
                  <td>
                    <button
                      className="travel-edit-button"
                      onClick={() => travelHandleEdit(entry._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="travel-delete-button"
                      onClick={() => travelHandleDelete(entry._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
