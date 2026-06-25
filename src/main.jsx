import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './UserProfile';
// Si vous avez un fichier CSS, gardez cette ligne. Sinon, supprimez-la.
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProfile />
  </React.StrictMode>
);
