import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Total.css';

function Total() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totals, setTotals] = useState({
    travel: 0,
    food: 0,
    subscription: 0,
    clothing: 0,
    jewellery: 0,
    medical: 0,
  });

  useEffect(() => {
    const storedData = localStorage.getItem(selectedDate.toDateString());
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      const newTotals = {
        travel: 0,
        food: 0,
        subscription: 0,
        clothing: 0,
        jewellery: 0,
        medical: 0,
      };

      parsedData.items.forEach(item => {
        if (item.category && newTotals[item.category] !== undefined) {
          newTotals[item.category] += item.amount;
        }
      });

      setTotals(newTotals);
    }
  }, [selectedDate]);

  return (
    <div className="total-container">
      <div className="total-header">
        <Link to="/category" className="home-icon">
          <FaHome size={24} />
        </Link>
        <h2>Expenses of the DAY!!</h2>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="total-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(totals).map(([category, amount]) => (
              <tr key={category}>
                <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                <td>{amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Total;
