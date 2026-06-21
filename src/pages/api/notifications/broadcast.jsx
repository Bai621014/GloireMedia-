import { SPIRITUAL_NOTIFICATIONS } from '../../../services/notificationMessages'; // 🎯 CORRECTION : "import" en minuscules
import { sendSmsNotification } from '../../../services/infobip';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { type, users } = req.body; // type: 'HEALING' ou 'TEACHING'

  if (!SPIRITUAL_NOTIFICATIONS[type]) {
    return res.status(400).json({ error: 'Type de notification invalide' });
  }

  try {
    // Boucle de simulation sur les utilisateurs ciblés
    for (const user of users) {
      const userLang = user.language || 'fr';
      const message = SPIRITUAL_NOTIFICATIONS[type][userLang] || SPIRITUAL_NOTIFICATIONS[type]['fr'];
      
      // Ajout du lien d'édification au message
      const fullMessage = `${message} Rejoignez le direct ici : https://healingstreams.tv/zone/ewcavz4`;

      if (user.phoneNumber) {
        await sendSmsNotification(user.phoneNumber, fullMessage);
      }
    }

    return res.status(200).json({ success: true, message: 'Diffusion spirituelle envoyée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la diffusion:', error);
    return res.status(500).json({ error: 'Échec de la diffusion des messages.' });
  }
}
