import React from 'react';

export default function MainNavigation({ onNavigate }) {
  return (
    <div className="flex justify-around items-center bg-black text-white p-4 fixed bottom-0 w-full">
      {/* Bouton Flux principal (Style TikTok) */}
      <button onClick={() => onNavigate('feed')} className="flex flex-col items-center">
        <span className="text-xl">▶️</span>
        <span className="text-xs">Play</span>
      </button>

      {/* Bouton Recherche */}
      <button onClick={() => onNavigate('search')} className="flex flex-col items-center">
        <span className="text-xl">🔍</span>
        <span className="text-xs">Découvrir</span>
      </button>

      {/* Bouton Central : Caméra / Publier */}
      <button onClick={() => onNavigate('create')} className="bg-blue-600 p-3 rounded-full -mt-6 border-4 border-black">
        <span className="text-xl text-white">📸</span>
      </button>

      {/* Bouton Profil / Paramètres (Où se cache le portefeuille) */}
      <button onClick={() => onNavigate('profile')} className="flex flex-col items-center">
        <span className="text-xl">👤</span>
        <span className="text-xs">Profil</span>
      </button>
    </div>
  );
}
