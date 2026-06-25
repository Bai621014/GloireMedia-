import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { effectuerRetrait } from './monetbil';

// Initialisation sécurisée
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "", 
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function UserProfile() {
  const [balance] = useState(500);
  const rate = 100;
  const phoneNumber = "+235 62 10 14 68";
  const amountToWithdraw = 50000;

  const handleWithdraw = async () => {
    try {
      alert("Traitement en cours...");
      const resultat = await effectuerRetrait(amountToWithdraw, phoneNumber);
      
      if (resultat?.success) {
        await supabase.from('withdrawals').insert([{ 
          amount: amountToWithdraw, 
          phone: phoneNumber, 
          status: 'success' 
        }]);
        alert("Succès !");
      } else {
        alert("Échec : " + (resultat?.message || "Erreur inconnue"));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de communication.");
    }
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>GLOIREMEDIA</h1>
      <h2>Solde: {balance * rate} FCFA</h2>
      <button onClick={handleWithdraw} style={{ padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
        Retrait Airtel {phoneNumber}
      </button>
    </div>
  );
      }
