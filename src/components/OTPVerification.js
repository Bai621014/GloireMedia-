'use client'
import React, { useState, useEffect } from 'react'; // 🎯 CORRECTION : "import" tout en minuscules

export default function OTPVerification({ numeroTelephone, onVerificationSuccess }) {
  const [step, setStep] = useState(1); // 1: Demande, 2: Saisie du code
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [timer, setTimer] = useState(0);

  // Gère le compte à rebours de 60 secondes pour l'anti-spam
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Fonction pour demander ou renvoyer le code SMS
  const handleSendOTP = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/notifications/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', numero: numeroTelephone })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Le code de vérification a été envoyé par SMS.' });
        setStep(2);
        setTimer(60); // Bloque le renvoi pendant 60s
      } else {
        setMessage({ type: 'error', text: data.message || "Une erreur est survenue." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Impossible de joindre le serveur de messagerie." });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour valider le code entré par l'utilisateur
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 4) {
      setMessage({ type: 'error', text: 'Veuillez entrer un code valide à 4 chiffres.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/notifications/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', numero: numeroTelephone, code: code })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Numéro de téléphone vérifié avec succès !' });
        if (onVerificationSuccess) {
          onVerificationSuccess(); // Déclenche l'action de suite
        }
      } else {
        setMessage({ type: 'error', text: data.message || "Code incorrect ou expiré." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Erreur lors de la validation du code." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
        Vérification du numéro
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Pour sécuriser votre compte GloireMedia, nous devons valider le <span className="font-semibold text-gray-700">{numeroTelephone}</span>.
      </p>

      {message.text && (
        <div className={`p-3 rounded-lg mb-4 text-sm text-center ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {step === 1 ? (
        <button
          onClick={handleSendOTP}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Recevoir le code par SMS'}
        </button>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
              Entrez le code à 4 chiffres
            </label>
            <input
              type="text"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              className="w-full text-center tracking-widest text-2xl font-bold border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Vérification...' : 'Valider le code'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={timer > 0 || loading}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {timer > 0 ? `Renvoyer le SMS dans (${timer}s)` : 'Renvoyer un nouveau code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
