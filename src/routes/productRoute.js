// ==========================================
//
// Description: Product routes configuration
//
// File: productRouter.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-11-05
// Changes: Added JWT authentication and role-based access control
// ==========================================

import { Router } from 'express';
// Controllers
import {
  getOneProduct,
  getAllProducts,
  getProductsByCategory,
  createOneProduct,
  updateOneProduct,
  updatePartialProduct,
  updateProductStock,
  updateProductStatus,
  deleteProductImage,
  deleteOneProduct,
} from '../controllers/productController.js';
// Validations
import {
  createProductValidation,
  updateProductValidation,
  updatePartialProductValidation,
  stockUpdateValidation,
  productIdValidation,
  updateProductStatusValidation,
} from '../validations/productValidation.js';
// Middlewares
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
import { uploadImage } from '../middlewares/uploadMiddleware.js';
import {
  authenticateToken,
  requireRole,
} from '../middlewares/authMiddleware.js';

const router = Router();
// 🔓 PUBLIC ROUTES (no authentication)
// GET all products - NO validation needed (read-only)
router.get('/', getAllProducts);

// GET products by category - NO validation needed (read-only)
router.get('/category/:categoryId', getProductsByCategory);

// GET one product by ID - ID validation only
router.get('/:id', productIdValidation, handleValidationErrors, getOneProduct);

// 🔐 PROTECTED ROUTES (require authentication)
// POST a new product - Full validation required
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  uploadImage,
  createProductValidation,
  handleValidationErrors,
  createOneProduct
);

// PUT update a product completely - Full validation
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  uploadImage,
  updateProductValidation,
  handleValidationErrors,
  updateOneProduct
);

// PATCH update a product partially - Partial validation
router.patch(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  uploadImage,
  updatePartialProductValidation,
  handleValidationErrors,
  updatePartialProduct
);

// PATCH update product stock - Quantity validation only
router.patch(
  '/:id/stock',
  authenticateToken,
  requireRole(['admin']),
  stockUpdateValidation,
  handleValidationErrors,
  updateProductStock
);

// PATCH update product status (soft delete or restore)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['admin']),
  updateProductStatusValidation,
  handleValidationErrors,
  updateProductStatus
);
// DELETE product image - ID validation only
router.delete(
  '/:id/image',
  authenticateToken,
  requireRole(['admin']),
  productIdValidation,
  handleValidationErrors,
  deleteProductImage
);

// DELETE a product - ID validation only
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  productIdValidation,
  handleValidationErrors,
  deleteOneProduct
);

export default router;
