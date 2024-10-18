import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import './Clothing.css';

function Clothing() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState(''); 
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState(''); 
  const [gst, setGst] = useState(''); 
  const [amount, setAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
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
    if (!itemName || !quantity || !discount || !gst || !amount) return;
    const newItem = {
      id: items.length + 1,
      itemName,
      quantity,
      discount: parseFloat(discount),
      gst: parseFloat(gst),
      amount: parseFloat(amount),
    };
    const updatedItems = [...items, newItem];
    const updatedTotal = totalAmount + parseFloat(amount);

    setItems(updatedItems);
    setTotalAmount(updatedTotal);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify({ items: updatedItems, totalAmount: updatedTotal }));

    resetFields();
    setIsAdding(false);
  };

  const saveEditedItem = () => {
    if (!itemName || !quantity || !discount || !gst || !amount) return;
    const updatedItems = items.map((currentItem) =>
      currentItem.id === editId
        ? { ...currentItem, itemName, quantity, discount: parseFloat(discount), gst: parseFloat(gst), amount: parseFloat(amount) }
        : currentItem
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
    setItemName(itemToEdit.itemName);
    setQuantity(itemToEdit.quantity);
    setDiscount(itemToEdit.discount);
    setGst(itemToEdit.gst);
    setAmount(itemToEdit.amount);
    setIsEditing(true);
    setEditId(id);
    setIsAdding(true); // Show input fields for editing
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
    setItemName('');
    setQuantity('');
    setDiscount('');
    setGst('');
    setAmount('');
  };

  return (
    <div className="clothing-container">
      <div className="clothing-header">
        <Link to="/category" className="home-icon">
          <FaHome size={24} />
        </Link>
        <h2>New Arrivals!!</h2>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="clothing-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>GST</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>{item.discount}</td>
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
                <td colSpan="5">Grand Total</td>
                <td>{totalAmount}</td>
              </tr>
            )}
          </tbody>
        </table>

        {(isAdding || isEditing) && (
          <div className="input-container">
            <div className="input-row">
              <input type="text" placeholder="Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <input type="number" placeholder="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              <input type="number" placeholder="GST" value={gst} onChange={(e) => setGst(e.target.value)} />
              <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <button className="save-button" onClick={isEditing ? saveEditedItem : addItem}>
              {isEditing ? 'Save' : 'Add'}
            </button>
          </div>
        )}
      </div>

      <button className="new-button" onClick={() => { resetFields(); setIsAdding(true); setIsEditing(false); }}>New</button>
    </div>
  );
}

export default Clothing;
