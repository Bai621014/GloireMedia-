import axios from 'axios';

export async function sendSmsNotification(phoneNumber, message) {
  const url = process.env.INFOBIP_URL || "http://jrwjyk.api.infobip.com";
  const apiKey = process.env.INFOBIP_API_KEY;
  const sender = process.env.INFOBIP_SENDER || "GloireMedia";

  if (!apiKey) {
    console.error("Clé API Infobip manquante dans les variables d'environnement.");
    throw new Error("Configuration SMS manquante.");
  }

  try {
    const response = await axios.post(
      `${url}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: phoneNumber }],
            from: sender,
            text: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `App ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS via Infobip:", error.response?.data || error.message);
    throw error;
  }
}
