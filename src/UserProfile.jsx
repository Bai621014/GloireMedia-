import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. CLIENT SUPABASE FRONT SEULEMENT
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function UserProfile() {
  const [balanceGC, setBalanceGC] = useState(0); // Solde en GloireCoin
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const rate = 100; // 1 GC = 100 FCFA. Mets ça en DB après
  const phoneNumber = "+23562101468"; // ← SANS ESPACE pour Monetbil
  const amountToWithdrawFCFA = 12000000; // 12M FCFA
  const amountToWithdrawGC = Math.floor(amountToWithdrawFCFA / rate); // 120000 GC

  // 2. RÉCUPÈRE SOLDE RÉEL DEPUIS DB AU CHARGEMENT
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: wallet } = await supabase
        .from('wallets')
        .select('gloirecoin')
        .eq('user_id', user.id)
        .single();
      
      setBalanceGC(wallet?.gloirecoin || 0);
    };
    loadData();
  }, []);

  // 3. 1 SEUL APPEL À L’EDGE. L’EDGE GÈRE TOUT : CHECK SOLDE + DB + MONETBIL
  const handleWithdraw = async () => {
    if (!userId) return alert("Connecte-toi d’abord");
    if (amountToWithdrawGC > balanceGC) return alert(`Solde insuffisant. Tu as ${(balanceGC * rate).toLocaleString()} FCFA`);

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('effectuer-retrait', {
        body: { 
          amount_fcfa: amountToWithdrawFCFA, 
          phone: phoneNumber,
          amount_gc: amountToWithdrawGC
        }
      });
      
      if (error) throw error;
      if (data.success) {
        alert(`Demande de ${amountToWithdrawFCFA.toLocaleString()} FCFA transmise. ID: ${data.transaction_id}`);
        setBalanceGC(prev => prev - amountToWithdrawGC); // MAJ front
      } else {
        alert("Échec: " + data.message);
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert(err.message || "Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '20px' }}>
      <h1>GLOIREMEDIA V10</h1>
      <h2>Solde: {(balanceGC * rate).toLocaleString()} FCFA</h2>
      <p>Équivalent: {balanceGC.toLocaleString()} GloireCoin</p>
      
      <button 
        disabled={isLoading || amountToWithdrawGC > balanceGC} 
        onClick={handleWithdraw} 
        style={{ padding: '15px 30px', backgroundColor: isLoading || amountToWithdrawGC > balanceGC ? '#6b7280' : '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        {isLoading ? "Traitement en cours..." : `Retirer ${amountToWithdrawFCFA.toLocaleString()} FCFA Airtel`}
      </button>
      <small>Vers: {phoneNumber}</small>
    </div>
  );
        }
