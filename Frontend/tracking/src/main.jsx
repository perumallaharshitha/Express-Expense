import React from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot
import './index.css';
import App from './App';
import UserLoginProvider from './files/contexts/UserLoginContext';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create root element
root.render(
  <React.StrictMode>
    <UserLoginProvider>
      <App />
    </UserLoginProvider>
  </React.StrictMode>
);
