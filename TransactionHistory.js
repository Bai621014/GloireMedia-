'use client'
import React, { useMemo } from 'react';
import { exchangeRates } from './exchangeRates';

export default function TransactionHistory({ transactions = [], currency = 'XAF' }) {
  // Optimisation : le taux est recalculé seulement si la devise change
  const rate = useMemo(() => exchangeRates[currency] || 1, [currency]);

  // Icônes Web3 pour les types de transactions
  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit': return '💎';
      case 'withdraw': return '🚀';
      default: return '✨';
    }
  };

  return (
    <div className="mt-8 bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-2xl">
      <h3 className="text-xl font-bold tracking-wide text-white mb-6">
        Historique GloireMedia
      </h3>

      {transactions.length === 0 ? (
        <div className="text-center py-10 text-gray-500 italic">
          Aucune transaction pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => {
            const convertedAmount = (tx.amountGC * rate).toLocaleString(undefined, { minimumFractionDigits: 2 });
            const isWithdraw = tx.type === 'withdraw';
            
            return (
              <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-800 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-100">{tx.description}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{tx.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-black ${isWithdraw ? 'text-amber-500' : 'text-emerald-400'}`}>
                    {isWithdraw ? '-' : '+'}{convertedAmount} <span className="text-[10px] text-gray-500">{currency}</span>
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 ${
                    tx.status === 'validated' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {tx.status === 'validated' ? '✅ Validé' : '⌛ En attente'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
              }
