  const handleWithdraw = async () => {
    const amountFCFA = balance * rate;
    
    // Enregistrement dans une nouvelle table appelée 'withdrawals'
    const { data, error } = await supabase
      .from('withdrawals')
      .insert([
        { 
          user_id: 'votre_id_utilisateur', // Vous pourrez automatiser cela
          amount: amountFCFA, 
          phone: "62101468", 
          status: 'pending' // En attente de traitement
        }
      ]);

    if (error) {
      alert("Erreur lors de la demande : " + error.message);
    } else {
      alert("Demande de retrait de " + amountFCFA + " FCFA envoyée avec succès au 62101468 !");
    }
  };
