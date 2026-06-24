import { useState } from 'react';

export default function UserProfile() {
  const [balance] = useState(500); 
  const rate = 100; // Taux de conversion

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: 'white', 
      padding: '40px 20px', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ marginBottom: '40px' }}>GloireMedia Dashboard</h1>
      
      <div style={{ background: '#1e293b', padding: '30px', borderRadius: '20px', textAlign: 'center', width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
        <p style={{ color: '#94a3b8', marginBottom: '10px' }}>Solde actuel :</p>
        <h2 style={{ fontSize: '3em', color: '#4ade80', margin: '0' }}>{balance} GC</h2>
      </div>

      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px', textAlign: 'center', width: '100%', maxWidth: '300px' }}>
        <p style={{ color: '#94a3b8' }}>Valeur en FCFA :</p>
        <h2 style={{ fontSize: '2em', color: '#ffffff', margin: '10px 0 0 0' }}>{(balance * rate).toLocaleString()} FCFA</h2>
      </div>
    </div>
  );
}
