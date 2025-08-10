import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/user';
import { sendResetPasswordEmail, sendVerificationEmail } from '../services/email.service';


// Registration with email verification token
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await UserModel.create({
      email,
      fullName,
      passwordHash,
      verificationToken,
      verified: false,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User created. Verification email sent.' });
  } catch (err) {
    next(err);
  }
};

// Email verification handler
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string')
      return res.status(400).json({ message: 'Invalid token' });

    const user = await UserModel.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

// Login with verification check & JWT tokens
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.verified) return res.status(401).json({ message: 'Email not verified' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    // @ts-ignore
    const accessToken = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
    );
    
    // @ts-ignore
    const refreshToken = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET || 'refreshsecret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Refresh access token using refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshsecret') as any;
    const user = await UserModel.findById(payload.sub);

    if (!user || user.refreshToken !== token)
      return res.status(401).json({ message: 'Invalid token' });

    // @ts-ignore
    const newAccessToken = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

// Logout (invalidate refresh token)
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshsecret') as any;
    const user = await UserModel.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    user.refreshToken = undefined;
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// Forgot password: send reset link
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: 'Reset password email sent' });
  } catch (err) {
    next(err);
  }
};

// Reset password using token
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: 'Token and new password are required' });

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};
