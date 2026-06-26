import express from 'express';
import cors from 'cors';
import payoutRouter from './payout.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', payoutRouter); // <- toutes les routes payout passent ici

app.get('/', (req, res) => res.send('API GLR OK'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
