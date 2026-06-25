import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation sécurisée via les variables d'environnement de Render
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function UserProfile() {
  const [balance] = useState(500);
  const rate = 100;
  const phoneNumber = "+235 62 10 14 68";
  const amountToWithdraw = 50000;

  const handleWithdraw = async () => {
    const { error } = await supabase
      .from('withdrawals')
      .insert([
        { 
          amount: amountToWithdraw, 
          phone: phoneNumber, 
          status: 'pending' 
        },
      ]);

    if (error) {
      alert("Erreur lors de l'envoi : " + error.message);
    } else {
      alert("Demande de " + amountToWithdraw.toLocaleString() + " FCFA enregistrée avec succès pour le " + phoneNumber);
    }
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ marginBottom: '30px' }}>GLOIREMEDIA</h1>
      
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '20px', width: '100%', maxWidth: '300px', textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#94a3b8' }}>Solde actuel :</p>
        <h2 style={{ fontSize: '2.5em', color: '#22c55e' }}>{balance} GC</h2>
      </div>

      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '20px', width: '100%', maxWidth: '300px', textAlign: 'center', marginBottom: '30px' }}>
        <p style={{ color: '#94a3b8' }}>Valeur en FCFA :</p>
        <h2 style={{ fontSize: '2em', color: '#ffffff' }}>{(balance * rate).toLocaleString()} FCFA</h2>
      </div>

      <button 
        onClick={handleWithdraw} 
        style={{ width: '100%', maxWidth: '300px', padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Retrait Airtel {phoneNumber}
      </button>
    </div>
  );
}
