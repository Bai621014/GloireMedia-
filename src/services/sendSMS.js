// src/services/sendSMS.js
const axios = require('axios');

async function envoyerOTP(numero, code) {
  const INFOBIP_URL = process.env.INFOBIP_URL; 
  const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY; 
  const SENDER = process.env.INFOBIP_SENDER || 'GloireMedia'; 

  try {
    const response = await axios.post(
      `${INFOBIP_URL}/sms/2/text/advanced`,
      {
        messages: [{
          from: SENDER,
          destinations: [{ to: numero }],
          text: `GloireMedia: Ton code de vérification est ${code}. Ne le partage avec personne.`,
          encoding: 'UNICODE' // Supprime les caractères incorrects (???)
        }]
      },
      {
        headers: {
          'Authorization': `App ${INFOBIP_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('SMS envoyé avec succès:', response.data);
    return true;
  } catch (error) {
    console.error('Erreur SMS Infobip:', error.response?.data || error.message);
    return false;
  }
}

module.exports = { envoyerOTP };
