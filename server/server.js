import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import auth from './routes/auth.js';
import roadmap from './routes/roadmap.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));
app.use('/api/auth', auth);
app.use('/api/roadmap', roadmap);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error('Database connection error: MONGO_URI environment variable is not defined.');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    app.listen(PORT, () => {
      console.log(`SkillPath AI API running on port ${PORT}`);
    });
  } catch (err) {
    // Sanitize credentials from connection string error logs
    const sanitizedMsg = err?.message
      ? err.message.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
      : 'Unknown connection error';
    console.error('Failed to connect to MongoDB:', sanitizedMsg);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
}

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith('server.js')
);

if (isMain) {
  startServer();
}

export default app;