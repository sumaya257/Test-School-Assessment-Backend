import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import examRoutes from './routes/exam.routes';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is required');
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  app.get('/', (req, res) => {
  res.send('Welcome to Test_School Competency Assessment Platform');
});

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
