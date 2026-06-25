import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './UserProfile';
// Si vous utilisez style.css, gardez cette ligne. Sinon, supprimez-la.
import './style.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProfile />
  </React.StrictMode>
);
