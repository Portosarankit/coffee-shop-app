import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecretkey';
    const user = jwt.verify(token, secret);
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Invalid or expired token' } });
  }
};
