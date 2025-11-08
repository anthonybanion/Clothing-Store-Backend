// ==========================================
//
// Description: Auth Route
//
// File: authRoute.js
// Author: Anthony Bañon
// Created: 2025-11-08
// Last Updated: 2025-11-08
// ==========================================

import express from 'express';
import {
  login,
  getProfile,
  changePassword,
  validateToken,
  refreshToken,
  logout,
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

// PATCH /api/auth/change-password (protegida)
router.patch(
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

// POST /api/auth/logout
router.post('/logout', authenticateToken, logout);

export default router;
