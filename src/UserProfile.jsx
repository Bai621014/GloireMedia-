import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { effectuerRetrait } from './monetbil';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "", 
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function UserProfile() {
  const [balance] = useState(500);
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const rate = 100;
  const phoneNumber = "+235 62 10 14 68";
  const amountToWithdraw = 50000;

  const handleWithdraw = async () => {
    setIsLoading(true); // Bloquer le bouton
    try {
      const resultat = await effectuerRetrait(amountToWithdraw, phoneNumber);
      
      if (resultat?.success) {
        // Enregistrer la demande
        const { error } = await supabase.from('retraits').insert([{ 
          montant_fcfa: amountToWithdraw, 
          numero_mobile: phoneNumber, 
          statut: 'pending' // En attente du webhook
        }]);
        
        if (error) throw new Error("Erreur base de données");
        alert("Demande transmise, validation en cours...");
      } else {
        alert("Échec : " + (resultat?.message || "Erreur"));
      }
    } catch (err) {
      alert("Erreur critique, contactez le support.");
    } finally {
      setIsLoading(false); // Réactiver le bouton
    }
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#ffffff', minHeight: '100vh', padding: '20px' }}>
      <h1>GLOIREMEDIA</h1>
      <h2>Solde: {balance * rate} FCFA</h2>
      <button 
        disabled={isLoading} 
        onClick={handleWithdraw} 
        style={{ padding: '15px', backgroundColor: isLoading ? '#6b7280' : '#3b82f6', color: 'white', borderRadius: '10px' }}
      >
        {isLoading ? "Traitement..." : `Retrait Airtel ${phoneNumber}`}
      </button>
    </div>
  );
        }
