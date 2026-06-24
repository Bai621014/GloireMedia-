import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function UserProfile({ initialBalance = 0 }) {
  const [balance, setBalance] = useState(initialBalance);
  const [loading, setLoading] = useState(false);
  const [rate] = useState(100); // 1 GC = 100 FCFA

  // Calcul dynamique de la valeur
  const amountFcfa = (balance * rate).toLocaleString();

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      // Simulation de l'appel pour le retrait
      alert(`Demande de retrait de ${amountFcfa} FCFA envoyée avec succès.`);
    } catch (error) {
      console.error("Erreur lors du retrait :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-black border border-emerald-500 rounded-2xl text-white shadow-2xl">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-6">
        GloireMedia Wallet
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Solde GloireCoin</p>
          <p className="text-4xl font-mono font-bold text-white">{balance} GC</p>
        </div>

        <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-900">
          <p className="text-emerald-400 text-sm">Valeur estimée</p>
          <p className="text-3xl font-bold text-emerald-400">{amountFcfa} FCFA</p>
        </div>
      </div>

      <button 
        onClick={handleWithdraw}
        disabled={loading}
        className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 transition-all font-bold rounded-xl uppercase tracking-widest text-sm"
      >
        {loading ? 'Traitement...' : 'Retirer vers Airtel Money'}
      </button>
    </div>
  );
}
