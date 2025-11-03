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

// Middleware to handle validation errors
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
// Middleware for image upload
import { uploadImage } from '../middlewares/uploadMiddleware.js';

const router = Router();
// GET one category by ID - ID validation only
router.get(
  '/:id',
  categoryIdValidation,
  handleValidationErrors,
  getOneCategory
);
// GET all categories - NO validation needed (read-only)
router.get('/', getAllCategories);
// POST a new category - Full validation required
router.post(
  '/',
  uploadImage,
  createCategoryValidation,
  handleValidationErrors,
  createOneCategory
);
// PUT update a category completely - Full validation
router.put(
  '/:id',
  uploadImage,
  updateCategoryValidation,
  handleValidationErrors,
  updateOneCategory
);
// PATCH update a category partially - Partial validation
router.patch(
  '/:id',
  uploadImage,
  updatePartialCategoryValidation,
  handleValidationErrors,
  updatePartialCategory
);
// PATCH update category status - Status validation only
router.patch(
  '/:id/status',
  updateCategoryStatusValidation,
  handleValidationErrors,
  updateCategoryStatus
);
// DELETE category image - ID validation only
router.delete(
  '/:id/image',
  categoryIdValidation,
  handleValidationErrors,
  deleteCategoryImage
);

// DELETE a category by ID - ID validation only
router.delete(
  '/:id',
  categoryIdValidation,
  handleValidationErrors,
  deleteOneCategory
);

export default router;
