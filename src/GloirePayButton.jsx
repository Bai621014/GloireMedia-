import React from 'react';

export default function GloirePayButton({ onAction }) {
  return (
    <button 
      onClick={onAction}
      className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-xl font-bold shadow-lg text-white hover:opacity-90 transition-opacity"
    >
      <span>🚀 Passerelle GloirePay</span>
    </button>
  );
}
