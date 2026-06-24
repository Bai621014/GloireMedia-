import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './UserProfile'; 
import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProfile initialBalance={1250} />
  </React.StrictMode>
);
