// ==========================================
//
// Description: Account Routes
//
// File: accountRoutes.js
// Author: Anthony Bañon
// Created: 2025-11-04
// Last Updated: 2025-11-04
// ==========================================

import express from 'express';
import {
  getOneAccount,
  getAllAccounts,
  createAccount,
  updateAccount,
  updateAccountUsername,
  updateAccountRole,
  resetAccountPassword,
  updateAccountStatus,
  forceLogout,
  deleteAccount,
} from '../controllers/accountController.js';

// Validations
import {
  createAccountValidation,
  updateAccountValidation,
  accountIdValidation,
  updateAccountStatusValidation,
  resetPasswordValidation,
  updateUsernameValidation,
  updateRoleValidation,
} from '../validations/accountValidation.js';

import {
  authenticateToken,
  requireRole,
  requireOwnershipOrRole,
} from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// GET all accounts (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), getAllAccounts);

// GET one account by ID
router.get(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  accountIdValidation,
  handleValidationErrors,
  getOneAccount
);

// POST create new account (Admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  createAccountValidation,
  handleValidationErrors,
  createAccount
);

// PUT update account (User can update their own, Admin can update any)
router.put(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  accountIdValidation,
  updateAccountValidation,
  handleValidationErrors,
  updateAccount
);

// PUT update username (User can update their own)
router.put(
  '/:id/username',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  accountIdValidation,
  updateUsernameValidation,
  handleValidationErrors,
  updateAccountUsername
);

// PUT update role (Admin only)
router.put(
  '/:id/role',
  authenticateToken,
  requireRole(['admin']),
  accountIdValidation,
  updateRoleValidation,
  handleValidationErrors,
  updateAccountRole
);

// POST reset password (Admin only)
router.post(
  '/:id/reset-password',
  authenticateToken,
  requireRole(['admin']),
  accountIdValidation,
  resetPasswordValidation,
  handleValidationErrors,
  resetAccountPassword
);

// PATCH update status (Admin only)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['admin']),
  accountIdValidation,
  updateAccountStatusValidation,
  handleValidationErrors,
  updateAccountStatus
);

// POST force logout (Admin only - invalidate tokens)
router.post(
  '/:id/force-logout',
  authenticateToken,
  requireRole(['admin']),
  accountIdValidation,
  handleValidationErrors,
  forceLogout
);

// DELETE account (Admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  accountIdValidation,
  handleValidationErrors,
  deleteAccount
);

export default router;
