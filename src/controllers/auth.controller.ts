import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';


export const register = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // @ts-ignore
    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
    );

    res.json({ 
      accessToken: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName || null,
      }
    });
  } catch (err) {
    next(err);
  }
};
