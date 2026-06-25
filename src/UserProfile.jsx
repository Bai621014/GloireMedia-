const handleWithdraw = async () => {
  // Vérification de sécurité avant l'appel
  if (!amountToWithdraw || !phoneNumber) {
    alert("Données de retrait invalides.");
    return;
  }

  try {
    alert("Traitement de votre retrait en cours... Veuillez patienter.");

    // 1. Appel à l'API Monetbil (via votre fichier monetbil.js)
    const resultat = await effectuerRetrait(amountToWithdraw, phoneNumber);
    
    // Vérification de la réponse Monetbil
    if (resultat && resultat.success) {
      
      // 2. Enregistrement dans Supabase
      const { error: dbError } = await supabase
        .from('withdrawals')
        .insert([{ 
          amount: amountToWithdraw, 
          phone: phoneNumber, 
          status: 'success' 
        }]);

      if (dbError) {
        alert("Paiement validé par Monetbil, mais erreur lors de la sauvegarde : " + dbError.message);
      } else {
        alert("Succès ! Votre retrait de " + amountToWithdraw.toLocaleString() + " FCFA a été traité.");
      }

    } else {
      // Si Monetbil refuse le paiement
      alert("Échec du paiement : " + (resultat?.message || "Veuillez vérifier votre solde ou votre numéro."));
    }
  } catch (err) {
    console.error("Erreur critique :", err);
    alert("Une erreur est survenue lors de la communication avec le serveur.");
  }
};
