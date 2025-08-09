import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_school')
  .then(() => console.log('Mongo connected'))
  .catch((e) => console.error('Mongo error', e));

  app.get('/', (req, res) => {
  res.send('Welcome to Test_School Competency Assessment Platform');
});

app.use('/api/auth', authRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
