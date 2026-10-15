import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import roadmap from './routes/roadmap.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', auth);
app.use('/api/roadmap', roadmap);

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT || 5000, () => console.log('API running'));