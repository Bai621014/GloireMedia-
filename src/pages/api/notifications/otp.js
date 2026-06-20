const { envoyerOTP } = require('../../../services/sendSMS');

// Stockage temporaire sécurisé en mémoire
const otpStore = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { action, numero, code } = req.body;

  if (!numero) {
    return res.status(400).json({ success: false, message: 'Numéro de téléphone manquant' });
  }

  // Nettoyage des espaces et formatage strict pour le Tchad (+235)
  let formattedNumero = numero.replace(/\s+/g, '');
  if (formattedNumero.startsWith('0')) formattedNumero = '+235' + formattedNumero.slice(1);
  if (!formattedNumero.startsWith('+235')) formattedNumero = '+235' + formattedNumero;

  // ==========================================
  // 1. ACTION : DEMANDE D'ENVOI DU CODE OTP
  // ==========================================
  if (action === 'send') {
    // Anti-Spam : Limite d'un SMS par minute
    if (otpStore.has(formattedNumero)) {
      const last = otpStore.get(formattedNumero);
      if (Date.now() - last.time < 60000) {
        return res.json({ success: false, message: 'Veuillez attendre 60 secondes avant de renvoyer un code.' });
      }
    }

    // Génération d'un code aléatoire à 4 chiffres
    const generatedCode = Math.floor(1000 + Math.random() * 9000);
    
    // Sauvegarde avec expiration (5 minutes) et horodatage de sécurité
    otpStore.set(formattedNumero, { 
      code: generatedCode, 
      exp: Date.now() + 300000, 
      time: Date.now() 
    });

    // Appel du service Infobip
    const ok = await envoyerOTP(formattedNumero, generatedCode);
    
    if (ok) {
      // Nettoyage automatique de la mémoire après 5 minutes
      setTimeout(() => otpStore.delete(formattedNumero), 300000);
      return res.json({ success: true, message: 'Code OTP envoyé avec succès.' });
    } else {
      otpStore.delete(formattedNumero);
      return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du SMS via Infobip.' });
    }
  }

  // ==========================================
  // 2. ACTION : VÉRIFICATION DU CODE OTP
  // ==========================================
  if (action === 'verify') {
    if (!code) {
      return res.status(400).json({ success: false, message: 'Code de vérification manquant.' });
    }

    const stored = otpStore.get(formattedNumero);

    // Vérification de l'existence et de l'expiration du code
    if (!stored) {
      return res.json({ success: false, message: 'Code inexistant ou expiré.' });
    }
    
    if (Date.now() > stored.exp) {
      otpStore.delete(formattedNumero);
      return res.json({ success: false, message: 'Le code a expiré.' });
    }

    // Vérification de la validité du code saisi
    if (stored.code != code) {
      return res.json({ success: false, message: 'Code incorrect.' });
    }

    // Code valide : On le supprime pour éviter une réutilisation frauduleuse
    otpStore.delete(formattedNumero);
    return res.json({ success: true, message: 'Numéro vérifié avec succès !' });
  }

  return res.status(400).json({ success: false, message: 'Action non reconnue.' });
          }
