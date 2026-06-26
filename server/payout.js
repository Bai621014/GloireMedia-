import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

const MONETBIL_KEY = process.env.MONETBIL_SECRET_KEY;

router.post('/payout', async (req, res) => {
  try {
    const { amount, phone } = req.body; // phone = 62101468 sans +235

    if (!MONETBIL_KEY) return res.status(500).json({error: "Clé Monetbil manquante"});

    const response = await fetch('https://api.monetbil.com/v1/payout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONETBIL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        country: 'TD',
        operator: 'airtel',
        account_number: phone,
        amount: amount,
        currency: 'XAF',
        reference: `GLR-RETRAIT-${Date.now()}`
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
