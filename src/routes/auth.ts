import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';


const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, passwordHash, fullName });
    res.json({ id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid' });
    const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    res.json({ accessToken: token });
  } catch (err) {
    next(err);
  }
});

export default router;
