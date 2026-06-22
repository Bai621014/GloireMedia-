import { calculateLocalBalance } from '../../../utils/currency';
import { sendSmsNotification } from '../../../services/infobip';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  // 1. Initialiser Supabase et vérifier l'identité de l'utilisateur
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Utilisateur non authentifié.' });
  }

  const userId = session.user.id;
  const { phoneNumber, coinsToWithdraw, userCurrency } = req.body;

  // 2. Validation des entrées
  if (!phoneNumber || !coinsToWithdraw) {
    return res.status(400).json({ error: 'Données manquantes (phoneNumber ou montant requis).' });
  }

  const amount = parseFloat(coinsToWithdraw);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Le montant doit être un nombre supérieur à 0.' });
  }

  try {
    // 3. Appel de la fonction stockée Supabase (RPC)
    const { data: transaction, error: dbError } = await supabase.rpc('process_wallet_withdrawal', {
      p_user_id: userId,
      p_amount: amount
    });

    if (dbError || !transaction?.success) {
      return res.status(400).json({ error: transaction?.message || 'Solde insuffisant ou erreur de transaction.' });
    }

    // 4. Calcul automatique de la conversion via l'utilitaire
    const targetCurrency = userCurrency || 'XAF';
    const conversion = calculateLocalBalance(amount, targetCurrency);

    // 5. Formulation et Envoi du SMS de succès
    const smsMessage = `GloireMedia : Votre retrait de ${amount} GloireCoins a été validé. Un montant de ${conversion.formattedString} a été transféré sur votre compte Mobile Money. Merci d'inspirer la communauté !`;
    
    try {
      await sendSmsNotification(phoneNumber, smsMessage);
      
      // Mettre à jour le statut en 'SUCCESS' en base
      await supabase.from('transactions').update({ status: 'SUCCESS' }).eq('id', transaction.id);
    } catch (smsError) {
      console.error("Le SMS n'a pas pu être envoyé mais le débit a eu lieu:", smsError);
    }

    return res.status(200).json({
      success: true,
      message: 'Retrait validé et converti avec succès',
      data: {
        transactionId: transaction.id,
        conversion: conversion
      }
    });

  } catch (error) {
    console.error('Erreur interne lors du retrait:', error);
    return res.status(500).json({ error: 'Une erreur interne est survenue.' });
  }
}
