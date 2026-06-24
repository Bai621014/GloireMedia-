import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function UserProfile({ initialBalance = 0 }) { // Ajout de la valeur par défaut = 0
  const [balance] = useState(initialBalance);
  const [rate] = useState(100); 

  const amountFcfa = (balance * rate).toLocaleString();

  return (
    <div className="p-6 bg-black text-white rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold mb-4">GloireMedia Dashboard</h2>
      <p>Solde actuel : <strong>{balance} GC</strong></p>
      <div className="mt-4 p-4 bg-gray-900 rounded">
        <p className="text-sm text-gray-400">Valeur en FCFA :</p>
        <p className="text-3xl font-mono text-green-400">{amountFcfa} FCFA</p>
      </div>
      <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold transition">
        Retirer vers Airtel Money
      </button>
    </div>
  );
}
