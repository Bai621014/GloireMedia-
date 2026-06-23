Import { SPIRITUAL_NOTIFICATIONS } from '../../../utils/notifications';
import { sendSmsNotification } from '../../../services/infobip';

export default async function handler(req, res) {
  // 1. Vérification de la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { type, users } = req.body; 

  // 2. Vérification basique
  if (!type || !users || !Array.isArray(users)) {
    return res.status(400).json({ error: 'Données invalides : type et liste d\'utilisateurs requis.' });
  }

  if (!SPIRITUAL_NOTIFICATIONS[type]) {
    return res.status(400).json({ error: 'Type de notification invalide' });
  }

  try {
    // 3. Diffusion des messages avec gestion de sécurité
    const results = { success: 0, failed: 0 };

    for (const user of users) {
      // Sécurité : on vérifie que l'utilisateur possède un numéro avant de lancer l'envoi
      if (!user.phoneNumber) {
        results.failed++;
        continue;
      }

      try {
        const userLang = user.language?.toLowerCase() || 'fr';
        // Fallback sur le français si la langue n'existe pas
        const message = SPIRITUAL_NOTIFICATIONS[type][userLang] || SPIRITUAL_NOTIFICATIONS[type]['fr'];
        const fullMessage = `${message} Rejoignez le direct ici : https://healingstreams.tv/zone/ewcavz4`;

        await sendSmsNotification(user.phoneNumber, fullMessage);
        results.success++;
      } catch (err) {
        console.error(`Erreur envoi pour ${user.phoneNumber}:`, err.message);
        results.failed++;
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Diffusion terminée.', 
      details: results 
    });
  } catch (error) {
    console.error('Erreur globale lors de la diffusion:', error);
    return res.status(500).json({ error: 'Échec critique du processus de diffusion.' });
  }
}
