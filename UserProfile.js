'use client'
import React, { useState, useMemo } from 'react';
// Importation des modules
import { translations } from './translations';
import { exchangeRates } from './exchangeRates';
import GloirePayButton from './GloirePayButton';

export default function UserProfile({ userLanguage = 'fr', initialBalance = 1250 }) {
  const [lang, setLang] = useState(userLanguage);
  const [currency, setCurrency] = useState('XAF');
  
  const t = useMemo(() => translations[lang] || translations.fr, [lang]);

  const convertedBalance = useMemo(() => {
    const rate = exchangeRates[currency] || 1;
    return (initialBalance * rate).toLocaleString(undefined, { minimumFractionDigits: 2 });
  }, [initialBalance, currency]);

  // Préparation de la Sécurité Web3 (En attente connexion Supabase)
  const handleWithdrawRequest = async () => {
    if (initialBalance < 5000) {
      alert(`⚠️ ${t.minPayout}: 5000 GC`);
    } else {
      // Ici, nous appellerons Supabase pour valider la transaction sécurisée
      console.log("Transmission vers GloirePay en cours...");
      alert("✅ Demande de retrait sécurisée envoyée sur la blockchain.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 font-sans">
      {/* En-tête Profil */}
      <div className="flex flex-col items-center my-6">
        <h2 className="text-xl font-bold">Frère Norman</h2>
        <span className="text-amber-500 text-xs uppercase tracking-widest">{t.status}</span>
      </div>

      {/* Carte Portefeuille (Moteur GloirePay intégré) */}
      <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-2xl">
        <p className="text-[10px] text-gray-400 uppercase">{t.balance}</p>
        <div className="text-4xl font-black text-white">{initialBalance.toLocaleString()} <span className="text-amber-500 text-xl">GC</span></div>
        
        <div className="mt-6 flex justify-between items-center text-sm">
          <p className="font-bold text-gray-300">{convertedBalance} <span className="text-gray-500">{currency}</span></p>
          <select onChange={(e) => setCurrency(e.target.value)} className="bg-black text-gray-400 text-[10px] p-1 border border-gray-700 rounded">
            {Object.keys(exchangeRates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
          </select>
        </div>

        <div className="mt-6 space-y-3">
          <button onClick={handleWithdrawRequest} className="w-full bg-amber-500 text-black font-black py-3 rounded-xl">{t.withdraw}</button>
          <GloirePayButton onAction={() => alert("Chargement historique...")} />
        </div>
      </div>
    </div>
  );
    }
