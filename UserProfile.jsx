import React, { useState, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { sendSmsNotification } from './smsService';
import { translations } from './translations';
import { exchangeRates } from './exchangeRates';
import TransactionHistory from './TransactionHistory';

export default function UserProfile({ userLanguage = 'fr', initialBalance = 1250 }) {
  const [lang, setLang] = useState(userLanguage);
  const [currency, setCurrency] = useState('XAF');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 'tx1', type: 'withdraw', amountGC: 5000, description: 'Retrait Airtel...', date: '23/06/2026', status: 'pending' }
  ]);

  const t = useMemo(() => translations[lang] || translations.fr, [lang]);
  
  const convertedBalance = useMemo(() => {
    const rate = exchangeRates[currency] || 1;
    return (initialBalance * rate).toLocaleString(undefined, { minimumFractionDigits: 2 });
  }, [initialBalance, currency]);

  const handleWithdrawRequest = async () => {
    if (initialBalance < 5000) {
      alert(`⚠️ ${t.minPayout} : 5000 GC`);
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{ 
          amountGC: 5000, 
          status: 'pending', 
          type: 'withdraw',
          description: 'Retrait utilisateur',
          date: new Date().toISOString()
        }]);

      if (error) throw error;
      await sendSmsNotification('+23562101468', 'Votre demande de retrait de 5000 GC a été enregistrée.');
      alert("✅ Demande enregistrée !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("⚠️ Service indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 font-sans">
      {/* Header Profil */}
      <div className="flex flex-col items-center my-6 space-y-3">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 p-1 shadow-2xl">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-amber-500">N</div>
        </div>
        <h2 className="text-xl font-bold">Frère Norman</h2>
      </div>

      {/* Wallet */}
      <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 mb-6">
        <p className="text-[10px] font-bold uppercase text-gray-400">{t.balance}</p>
        <div className="text-4xl font-black text-white my-2">{initialBalance.toLocaleString()} <span className="text-amber-500 text-lg">GC</span></div>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-black/40 border border-gray-700 rounded-lg p-2 text-xs">
          {Object.keys(exchangeRates).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={handleWithdrawRequest} disabled={loading} className="w-full mt-6 bg-amber-500 text-black font-black py-3.5 rounded-xl">
          {loading ? "Chargement..." : t.withdraw}
        </button>
      </div>

      <TransactionHistory transactions={transactions} currency={currency} />
    </div>
  );
  }
