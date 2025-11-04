// /routes/auth.js
import express from 'express';
import {
  login,
  getProfile,
  changePassword,
  validateToken,
  refreshToken,
} from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile (protegida)
router.get('/profile', authenticateToken, getProfile);

// POST /api/auth/change-password (protegida)
router.post('/change-password', authenticateToken, changePassword);

// GET /api/auth/validate (protegida)
router.get('/validate', authenticateToken, validateToken);

// POST /api/auth/refresh
router.post('/refresh', refreshToken);

export default router;
