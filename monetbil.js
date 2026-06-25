// monetbil.js
// On récupère les clés que vous avez entrées dans Render
const SERVICE_KEY = import.meta.env.VITE_MONETBIL_SERVICE_KEY;
const SECRET_KEY = import.meta.env.VITE_MONETBIL_SECRET;

export const effectuerRetrait = async (amount, phone) => {
  try {
    const response = await fetch('https://api.monetbil.com/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}` // Utilisation de la Service Key
      },
      body: JSON.stringify({
        amount: amount,
        phone: phone,
        currency: 'XAF',
        secret: SECRET_KEY // Utilisation du Secret
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur API Monetbil:", error);
    throw error;
  }
};
