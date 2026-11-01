import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { LoginSchema } from '@coffee-shop/shared';
import { authenticateToken } from '../middleware/auth.middleware.js';

export const createAuthRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.post('/login', async (req, res) => {
    try {
      const validation = LoginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid login payload' }
        });
      }

      const { username, password } = validation.data;
      const user = await prisma.staffUser.findUnique({ where: { name: username } });
      if (!user) {
        return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } });
      }

      const secret = process.env.JWT_SECRET || 'supersecretkey';
      const token = jwt.sign({ userId: user.id, name: user.name, role: user.role }, secret, { expiresIn: '12h' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000,
      });

      res.json({ data: { token, user: { id: user.id, name: user.name, role: user.role } } });
    } catch (error: any) {
      console.error('Login Error:', error);
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Login failed' } });
    }
  });

  router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ data: { success: true } });
  });

  router.get('/me', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const user = await prisma.staffUser.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      }
      res.json({ data: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch user' } });
    }
  });

  return router;
};
