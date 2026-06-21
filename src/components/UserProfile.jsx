'use client'
import React, { useState } from 'react'; // 🎯 CORRECTION : "import" en minuscules

// Traductions pour l'internationalisation de la communauté
const translations = {
  fr: {
    title: "Profil de Foi",
    balance: "Mon Solde GloireCoins",
    withdraw: "Demander un Retrait",
    history: "Historique des Dons & Gains",
    currency: "Devise locale",
    language: "Langue de l'application",
    security: "Sécurité & Confidentialité",
    minPayout: "Seuil minimum non atteint",
    status: "Fidèle Serviteur"
  },
  en: {
    title: "Faith Profile",
    balance: "My GloireCoins Balance",
    withdraw: "Request Payout",
    history: "Gifts & Earnings History",
    currency: "Local Currency",
    language: "App Language",
    security: "Security & Privacy",
    minPayout: "Minimum threshold not met",
    status: "Faithful Servant"
  },
  sw: {
    title: "Profaili ya Imani",
    balance: "Salio langu la GloireCoins",
    withdraw: "Omba Malipo",
    history: "Historia ya Zawadi",
    currency: "Sarafu ya Kienyeji",
    language: "Lugha ya Programu",
    security: "Usalama na Faragha",
    minPayout: "Kiwango cha chini hakijafikiwa",
    status: "Mtumishi Mwaminifu"
  },
  ln: {
    title: "Profil ya Kondima",
    balance: "Solde na ngai ya GloireCoins",
    withdraw: "Senga Mosolo",
    history: "Istware ya Makabo",
    currency: "Mosolo ya Mboka",
    language: "Monoko ya l'Application",
    security: "Libateli & Secret",
    minPayout: "Talo ya nse ekoki te",
    status: "Mosali ya Sembo"
  }
};

// Taux de conversion indicatifs (Exemple basé sur l'écosystème)
const exchangeRates = {
  XAF: 655.95, // Franc CFA
  USD: 1.00,   // Dollar US
  EUR: 0.92,   // Euro
  PI: 0.0314   // Écosystème Pi Network (Valeur indicative projetée)
};

export default function UserProfile({ userLanguage = 'fr', initialBalance = 1250 }) {
  const [lang, setLang] = useState(userLanguage);
  const [currency, setCurrency] = useState('XAF');
  const t = translations[lang] || translations.fr;

  // Calcul de la conversion
  const convertedBalance = (initialBalance * (exchangeRates[currency] || 1)).toFixed(2);

  const handleWithdrawRequest = () => {
    // Vérification de sécurité pour le retrait
    if (initialBalance < 5000) {
      alert(`⚠️ ${t.minPayout} (Minimum: 5000 GloireCoins)`);
    } else {
      alert("✅ Demande de retrait cryptée et envoyée aux modérateurs pour validation.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 font-sans selection:bg-amber-500 selection:text-black">
      {/* En-tête du Profil */}
      <div className="flex flex-col items-center my-6 space-y-3">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-xl shadow-amber-500/10">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-amber-500">
            N
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-wide">Frère Norman</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            ✨ {t.status}
          </span>
        </div>
      </div>

      {/* Carte Portefeuille Invisible / Sécurisée */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 border border-gray-800 shadow-2xl relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{t.balance}</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
            {initialBalance.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-amber-500 tracking-widest">GC</span>
        </div>

        {/* Section Conversion Secrète */}
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-500 uppercase">{t.currency}</p>
            <p className="text-lg font-bold text-gray-300">
              {convertedBalance} <span className="text-xs text-gray-400">{currency}</span>
            </p>
          </div>
          
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-950 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-amber-500"
          >
            <option value="XAF">Franc CFA (XAF)</option>
            <option value="USD">Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="PI">Pi Network (Pi)</option>
          </select>
        </div>

        {/* Action Retrait */}
        <button
          onClick={handleWithdrawRequest}
          className="w-full mt-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-amber-500/10 text-sm tracking-wide"
        >
          🔑 {t.withdraw}
        </button>
      </div>

      {/* Menu des Paramètres */}
      <div className="space-y-2">
        {/* Sélecteur de Langue */}
        <div className="bg-gray-900 rounded-xl p-4 flex justify-between items-center border border-gray-800/60">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🌍</span>
            <span className="text-sm font-medium">{t.language}</span>
          </div>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-gray-950 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-amber-500"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
            <option value="ln">Lingála</option>
          </select>
        </div>

        {/* Historique simulé */}
        <div className="bg-gray-900 rounded-xl p-4 flex justify-between items-center border border-gray-800/60 cursor-pointer hover:bg-gray-800/50 transition">
          <div className="flex items-center space-x-3">
            <span className="text-lg">📜</span>
            <span className="text-sm font-medium">{t.history}</span>
          </div>
          <span className="text-gray-500 text-sm">➔</span>
        </div>

        {/* Sécurité */}
        <div className="bg-gray-900 rounded-xl p-4 flex justify-between items-center border border-gray-800/60 cursor-pointer hover:bg-gray-800/50 transition">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🛡️</span>
            <span className="text-sm font-medium">{t.security}</span>
          </div>
          <span className="text-gray-500 text-sm">➔</span>
        </div>
      </div>

      {/* Verset de protection au bas de l'écran */}
      <div className="mt-8 text-center text-[11px] text-gray-600 italic px-6 leading-relaxed">
        "L'Éternel est mon berger : je ne manquerai de rien." - Psaume 23:1
      </div>
    </div>
  );
  }
