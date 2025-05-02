import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Medical.css'; // Make sure to import the Medical CSS

function Medical() {
  const [medicalItems, setMedicalItems] = useState([]);
  const [medicalName, setMedicalName] = useState('');
  const [medicalIllness, setMedicalIllness] = useState('');
  const [medicalQuantity, setMedicalQuantity] = useState('');
  const [medicalAmount, setMedicalAmount] = useState('');
  const [medicalRecordDate, setMedicalRecordDate] = useState(new Date()); // Added record date
  const [medicalIsEditing, setMedicalIsEditing] = useState(false);
  const [medicalEditId, setMedicalEditId] = useState(null);
  const [medicalTotalAmount, setMedicalTotalAmount] = useState(0);
  const [medicalSelectedDate, setMedicalSelectedDate] = useState(new Date()); // For filtering

  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage

  useEffect(() => {
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
    fetchMedicalItems();
  }, [token, medicalSelectedDate]);

  const medicalAddItem = async () => {
    if (!medicalName || !medicalIllness || !medicalQuantity || !medicalAmount || !medicalRecordDate) return;

    const newItem = {
      name: medicalName,
      illness: medicalIllness,
      quantity: parseInt(medicalQuantity),
      amount: parseFloat(medicalAmount),
      recordDate: medicalRecordDate, // Include record date
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
      recordDate: medicalRecordDate, // Include record date
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
    setMedicalName(itemToEdit.name);
    setMedicalIllness(itemToEdit.illness);
    setMedicalQuantity(itemToEdit.quantity);
    setMedicalAmount(itemToEdit.amount);
    setMedicalRecordDate(new Date(itemToEdit.recordDate)); // Set record date for editing
    setMedicalIsEditing(true);
    setMedicalEditId(id);
  };

  const medicalResetFields = () => {
    setMedicalName('');
    setMedicalIllness('');
    setMedicalQuantity('');
    setMedicalAmount('');
    setMedicalRecordDate(new Date()); // Reset record date
  };

  return (
    <div className="jewellery-container"> 
      <div className="jewellery-header"> {/* Using jewellery-header for consistent header */}
        <Link to="/category" className="jewellery-home-icon"> {/* Using jewellery-home-icon */}
          <FaHome size={24} color="#000000" />
        </Link>
        <h2>Medical Records</h2>
        <div className="jewellery-datepicker"> {/* Using jewellery-datepicker */}
          <DatePicker
            selected={medicalSelectedDate}
            onChange={(date) => setMedicalSelectedDate(date)}
            dateFormat="MMMM d,yyyy"
            className="jewellery-datepicker-input" 
          />
        </div>
      </div>

      <div className="jewellery-input-container">
        <div className="jewellery-input-row"> {/* Using jewellery-input-row */}
          <div className="jewellery-input-group"> {/* Using jewellery-input-group */}
            <label>Name</label>
            <input
              type="text"
              value={medicalName}
              onChange={(e) => setMedicalName(e.target.value)}
              className="jewellery-input-field" 
            />
          </div>
          <div className="jewellery-input-group"> {/* Using jewellery-input-group */}
            <label>Illness</label>
            <input
              type="text"
              value={medicalIllness}
              onChange={(e) => setMedicalIllness(e.target.value)}
              className="jewellery-input-field" 
            />
          </div>
          <div className="jewellery-input-group"> {/* Using jewellery-input-group */}
            <label>Quantity</label>
            <input
              type="number"
              value={medicalQuantity}
              onChange={(e) => setMedicalQuantity(e.target.value)}
              className="jewellery-input-field"
            />
          </div>
          <div className="jewellery-input-group"> 
            <label>Amount</label>
            <input
              type="number"
              value={medicalAmount}
              onChange={(e) => setMedicalAmount(e.target.value)}
              className="jewellery-input-field"
            />
          </div>
          <div className="jewellery-input-group"> 
            <label>Record Date</label>
            <DatePicker
              selected={medicalRecordDate}
              onChange={(date) => setMedicalRecordDate(date)}
              dateFormat="MMMM d,yyyy"
              className="jewellery-datepicker-input" 
            />
          </div>
        </div>
        <button className="jewellery-save-button" onClick={medicalIsEditing ? medicalSaveEditedItem : medicalAddItem}> {/* Using jewellery-save-button */}
          {medicalIsEditing ? 'Save' : 'Add'}
        </button>
      </div>

      <div className="jewellery-table-container"> {/* Using jewellery-table-container */}
        <table className="jewellery-table"> {/* Using jewellery-table */}
          <thead>
            <tr>
              <th>SNO</th>
              <th>Name</th>
              <th>Illness</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Record Date</th>
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
                <td>{new Date(item.recordDate).toLocaleDateString()}</td>
                <td>
                  <FaEdit
                    className="jewellery-edit-icon" 
                    onClick={() => medicalEditItem(item._id)}
                  />
                  <FaTrash
                    className="jewellery-delete-icon" 
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
                <td></td> {/* Empty cell for actions column */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Medical;