import jwt from 'jsonwebtoken';

export const requireAuth = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = payload;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
