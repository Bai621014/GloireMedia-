import axios from 'axios'; // 🎯 CORRECTION : "import" en minuscules

/**
 * Envoie une notification SMS via l'API Infobip
 * @param {string} numero - Le numéro de téléphone du destinataire (format international ex: +235...)
 * @param {string} message - Le contenu du SMS
 */
export async function sendSmsNotification(numero, message) {
  const INFOBIP_URL = process.env.INFOBIP_URL;
  const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY;
  const SENDER = process.env.INFOBIP_SENDER || 'GloireMedia';

  if (!INFOBIP_URL || !INFOBIP_API_KEY) {
    console.warn("⚠️ Configuration Infobip manquante dans les variables d'environnement.");
    return;
  }

  try {
    // Nettoyage de l'URL pour éviter les doubles slashes optionnels
    const baseUrl = INFOBIP_URL.replace(/\/$/, '');
    
    const response = await axios.post(
      `${baseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            from: SENDER,
            destinations: [{ to: numero }],
            text: message
          }
        ]
      },
      {
        headers: {
          'Authorization': `App ${INFOBIP_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS via Infobip:", error.response?.data || error.message);
    throw error;
  }
}
