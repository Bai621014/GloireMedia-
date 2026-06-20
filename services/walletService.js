// Taux de conversion DIRECTS : Combien vaut 1 GloireCoin dans chaque devise ?
const EXCHANGE_RATES = {
  XAF: 125,        // 1 GloireCoin = 125 FCFA (Afrique Centrale)
  XOF: 125,        // 1 GloireCoin = 125 FCFA (Afrique de l'Ouest)
  CDF: 560,        // 1 GloireCoin = 560 CDF (Franc Congolais)
  USD: 0.20,       // 1 GloireCoin = 0.20 USD (Dollar)
};

/**
 * Calcule le solde converti d'un utilisateur selon sa devise
 * @param {number} coinBalance - Le montant en GloireCoins
 * @param {string} currency - La devise locale (ex: XAF, XOF, USD)
 */
export function calculateLocalBalance(coinBalance, currency = 'XAF') {
  // Sécurité : Forcer en majuscules (ex: 'usd' -> 'USD')
  const targetCurrency = currency.toUpperCase();
  
  // Si la devise n'est pas supportée, on se rabat sur le XAF par défaut
  const rate = EXCHANGE_RATES[targetCurrency] || EXCHANGE_RATES.XAF;
  const finalCurrency = EXCHANGE_RATES[targetCurrency] ? targetCurrency : 'XAF';

  // Calcul du montant local
  let localAmount = coinBalance * rate;

  // Gestion des décimales : pas de centimes pour les Francs (CFA, CDF), mais 2 décimales pour l'USD
  const isDecimalCurrency = ['USD', 'EUR'].includes(finalCurrency);
  if (!isDecimalCurrency) {
    localAmount = Math.round(localAmount); // Arrondi à l'unité pour le FCFA/CDF
  }

  return {
    gloireCoins: coinBalance,
    amount: localAmount,
    currency: finalCurrency,
    formattedString: isDecimalCurrency
      ? `${localAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${finalCurrency}`
      : `${localAmount.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} ${finalCurrency}`
  };
}
