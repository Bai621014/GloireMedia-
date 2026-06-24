import React from 'react';
import ReactDOM from 'react-dom/client';

const TestApp = () => (
  <div style={{ color: 'white', padding: '50px', fontSize: '30px' }}>
    TEST RÉUSSI : React fonctionne !
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<TestApp />);
