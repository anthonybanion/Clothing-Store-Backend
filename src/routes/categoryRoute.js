// ==========================================
//
// Description: Category routes configuration
//
// File: categoryRouter.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-11-02
// Changes: Added middleware for image upload
// ==========================================

import { Router } from 'express';
import {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  updatePartialCategory,
  updateCategoryStatus,
  deleteCategoryImage,
  deleteOneCategory,
} from '../controllers/categoryController.js';

import {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  updateCategoryStatusValidation,
  updatePartialCategoryValidation,
} from '../validations/categoryValidation.js';

// Middlewares
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
import { uploadImage } from '../middlewares/uploadMiddleware.js';
import {
  authenticateToken,
  requireRole,
} from '../middlewares/authMiddleware.js';

const router = Router();

// 🔓 PUBLIC ROUTES (no authentication)
// GET one category by ID - ID validation only
router.get(
  '/:id',
  categoryIdValidation,
  handleValidationErrors,
  getOneCategory
);
// GET all categories - NO validation needed (read-only)
router.get('/', getAllCategories);

// 🔐 PROTECTED ROUTES (require authentication)
// POST a new category - Full validation required
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  uploadImage,
  createCategoryValidation,
  handleValidationErrors,
  createOneCategory
);
// PUT update a category completely - Full validation
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  uploadImage,
  updateCategoryValidation,
  handleValidationErrors,
  updateOneCategory
);
// PATCH update a category partially - Partial validation
router.patch(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  uploadImage,
  updatePartialCategoryValidation,
  handleValidationErrors,
  updatePartialCategory
);
// PATCH update category status - Status validation only
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['admin']),
  updateCategoryStatusValidation,
  handleValidationErrors,
  updateCategoryStatus
);
// DELETE category image - ID validation only
router.delete(
  '/:id/image',
  authenticateToken,
  requireRole(['admin']),
  categoryIdValidation,
  handleValidationErrors,
  deleteCategoryImage
);

// DELETE a category by ID - ID validation only
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  categoryIdValidation,
  handleValidationErrors,
  deleteOneCategory
);

export default router;
