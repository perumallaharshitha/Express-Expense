import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Jewelley.css';

function Jewellery() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [purity, setPurity] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [makingCharges, setMakingCharges] = useState('');
  const [gst, setGst] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const storedData = localStorage.getItem(selectedDate.toDateString());
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setItems(parsedData.items);
      setCalculatedAmount(parsedData.totalAmount);
    } else {
      setItems([]);
      setCalculatedAmount(0);
    }
  }, [selectedDate]);

  const addItem = () => {
    if (!item || !purity || !price || !weight || !makingCharges || !gst || !totalPrice) return;
    const amount = parseFloat(totalPrice);
    const newItem = {
      id: items.length + 1,
      item,
      purity,
      price,
      weight,
      makingCharges,
      gst,
      amount,
    };
    const updatedItems = [...items, newItem];
    const updatedTotal = calculatedAmount + amount;

    setItems(updatedItems);
    setCalculatedAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsAdding(false);
  };

  const saveEditedItem = () => {
    if (!item || !purity || !price || !weight || !makingCharges || !gst || !totalPrice) return;
    const amount = parseFloat(totalPrice);
    
    const updatedItems = items.map((currentItem) =>
      currentItem.id === editId
        ? { ...currentItem, item, purity, price, weight, makingCharges, gst, amount }
        : currentItem
    );

    const updatedTotal = updatedItems.reduce((total, currentItem) => total + currentItem.amount, 0);

    setItems(updatedItems);
    setCalculatedAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsEditing(false);
    setEditId(null);
  };

  const editItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setItem(itemToEdit.item);
    setPurity(itemToEdit.purity);
    setPrice(itemToEdit.price);
    setWeight(itemToEdit.weight);
    setMakingCharges(itemToEdit.makingCharges);
    setGst(itemToEdit.gst);
    setTotalPrice(itemToEdit.amount);
    setIsEditing(true);
    setEditId(id);
  };

  const deleteItem = (id) => {
    const itemToDelete = items.find((item) => item.id === id);
    const updatedItems = items.filter((item) => item.id !== id);
    const updatedTotal = calculatedAmount - itemToDelete.amount;

    setItems(updatedItems);
    setCalculatedAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));
  };

  const resetFields = () => {
    setItem('');
    setPurity('');
    setPrice('');
    setWeight('');
    setMakingCharges('');
    setGst('');
    setTotalPrice('');
  };

  return (
    <div className="jewellery-container">
      <div className="jewellery-header">
        <Link to="/category" className="home-icon">
          <FaHome size={24} />
        </Link>
        <h2>Golden Glow!!</h2>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="jewellery-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Purity</th>
              <th>Price/gram</th>
              <th>Weight (gm)</th>
              <th>Making Charges</th>
              <th>GST</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.item}</td>
                <td>{item.purity}</td>
                <td>{item.price}</td>
                <td>{item.weight}</td>
                <td>{item.makingCharges}</td>
                <td>{item.gst}</td>
                <td>{item.amount}</td>
                <td>
                  <FaEdit className="edit-icon" onClick={() => editItem(item.id)} />
                  <FaTrash className="delete-icon" onClick={() => deleteItem(item.id)} />
                </td>
              </tr>
            ))}
            {items.length > 0 && (
              <tr>
                <td colSpan="7">Grand Total</td>
                <td>{calculatedAmount}</td>
              </tr>
            )}
          </tbody>
        </table>

        {(isAdding || isEditing) && (
          <div className="input-container">
            <div className="input-row">
              <input type="text" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
              <input type="text" placeholder="Purity" value={purity} onChange={(e) => setPurity(e.target.value)} />
              <input type="number" placeholder="Price/gram" value={price} onChange={(e) => setPrice(e.target.value)} />
              <input type="number" placeholder="Weight (gm)" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <input type="number" placeholder="Making Charges" value={makingCharges} onChange={(e) => setMakingCharges(e.target.value)} />
              <input type="number" placeholder="GST" value={gst} onChange={(e) => setGst(e.target.value)} />
              <input type="number" placeholder="Total Price" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} /> 
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

export default Jewellery;
