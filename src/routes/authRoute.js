// /routes/auth.js
import express from 'express';
import {
  login,
  getProfile,
  changePassword,
  validateToken,
  refreshToken,
} from '../controllers/authController.js';
import {
  loginValidation,
  changePasswordValidation,
  refreshTokenValidation,
  validateTokenValidation,
} from '../validations/authValidation.js';
import {
  authenticateToken,
  requireRole,
} from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, login);

// GET /api/auth/profile (protegida)
router.get('/profile', authenticateToken, getProfile);

// POST /api/auth/change-password (protegida)
router.post(
  '/change-password',
  authenticateToken,
  changePasswordValidation,
  handleValidationErrors,
  changePassword
);

// GET /api/auth/validate (protegida)
router.get(
  '/validate',
  authenticateToken,
  validateTokenValidation,
  handleValidationErrors,
  validateToken
);

// POST /api/auth/refresh
router.post(
  '/refresh',
  refreshTokenValidation,
  handleValidationErrors,
  refreshToken
);

export default router;
