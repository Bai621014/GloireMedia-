import { calculateLocalBalance } from '../../../services/walletService';
import { sendSmsNotification } from '../../../services/infobip';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { userId, phoneNumber, coinsToWithdraw, userCurrency } = req.body;

  try {
    // Simulation du solde actuel de l'utilisateur (à lier avec votre Base de Données)
    const currentCoins = 1000; 

    if (coinsToWithdraw > currentCoins) {
      return res.status(400).json({ error: 'Solde de GloireCoins insuffisant' });
    }

    // Calcul automatique de la conversion (1 Coin = 125 FCFA)
    const conversion = calculateLocalBalance(coinsToWithdraw, userCurrency);

    // [Ici vous ajouterez la ligne pour mettre à jour la base de données]
    // exemple: await db.user.update(...)

    // Envoi du SMS automatique via Infobip
    const smsMessage = `GloireMedia : Votre retrait de ${coinsToWithdraw} GloireCoins a été validé. Un montant de ${conversion.formattedString} a été transféré sur votre compte Mobile Money. Merci d'inspirer la communauté !`;
    
    if (phoneNumber) {
      await sendSmsNotification(phoneNumber, smsMessage);
    }

    return res.status(200).json({
      success: true,
      message: 'Retrait validé et converti avec succès',
      data: conversion
    });

  } catch (error) {
    console.error('Erreur lors du retrait:', error);
    return res.status(500).json({ error: 'Une erreur interne est survenue lors de la conversion.' });
  }
}
