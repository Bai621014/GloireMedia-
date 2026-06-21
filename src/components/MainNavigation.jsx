'use client'
import React, { useState } from 'react'; // 🎯 CORRECTION : "import" en minuscules
import VideoFeed from './VideoFeed';      // 🎯 SANS ACCENT : Parfaitement aligné avec ton choix
import UserProfile from './UserProfile';
import OTPVerification from './OTPVerification';

export default function MainNavigation() {
  const [currentTab, setCurrentTab] = useState('play'); // play, search, create, profile, verify
  
  // Exemple de numéro pour la démo de vérification OTP
  const [userPhone] = useState('+23560000000'); 
  const [isVerified, setIsVerified] = useState(false);

  // Fonction pour afficher le bon écran en fonction de l'onglet actif
  const renderContent = () => {
    switch (currentTab) {
      case 'play':
        return <VideoFeed />;
      case 'search':
        return (
          <div className="h-screen w-full bg-gray-950 flex items-center justify-center text-gray-400">
            <p>Barre de recherche et découvertes à venir...</p>
          </div>
        );
      case 'create':
        return (
          <div className="h-screen w-full bg-gray-950 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <p className="text-lg">📸 Caméra GloireMedia</p>
            <p className="text-xs text-gray-500">Préparez vos vidéos et photos pour édifier la communauté</p>
          </div>
        );
      case 'profile':
        if (!isVerified) {
          return (
            <div className="h-screen w-full bg-gray-950 flex items-center justify-center p-4">
              <OTPVerification 
                numeroTelephone={userPhone} 
                onVerificationSuccess={() => setIsVerified(true)} 
              />
            </div>
          );
        }
        return <UserProfile userLanguage="fr" initialBalance={2500} />;
      default:
        return <VideoFeed />;
    }
  };

  return (
    <div className="h-screen w-full relative bg-black overflow-hidden">
      {/* Contenu principal de l'écran */}
      <div className="h-full w-full pb-16">
        {renderContent()}
      </div>

      {/* Barre de navigation inférieure fixe (Style TikTok) */}
      <div className="absolute bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-900 h-16 flex justify-around items-center text-white z-50">
        
        {/* Onglet Flux Vidéo */}
        <button 
          onClick={() => setCurrentTab('play')} 
          className={`flex flex-col items-center transition ${currentTab === 'play' ? 'text-amber-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">▶️</span>
          <span className="text-[10px] font-semibold mt-0.5">Play</span>
        </button>

        {/* Onglet Recherche */}
        <button 
          onClick={() => setCurrentTab('search')} 
          className={`flex flex-col items-center transition ${currentTab === 'search' ? 'text-amber-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-semibold mt-0.5">Découvrir</span>
        </button>

        {/* Bouton Central : Produire Vidéo/Photo */}
        <button 
          onClick={() => setCurrentTab('create')} 
          className="bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-full -mt-6 border-4 border-black shadow-lg transform active:scale-95 transition"
        >
          <span className="text-xl text-black">📸</span>
        </button>

        {/* Onglet Profil */}
        <button 
          onClick={() => setCurrentTab('profile')} 
          className={`flex flex-col items-center transition ${currentTab === 'profile' ? 'text-amber-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-semibold mt-0.5">Profil</span>
        </button>

      </div>
    </div>
  );
          }
