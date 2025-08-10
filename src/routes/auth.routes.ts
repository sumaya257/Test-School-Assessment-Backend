import { Router } from 'express';
import { register, login, verifyEmail, refreshToken, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;