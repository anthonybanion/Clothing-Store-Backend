// ==========================================
//
// Description: Product routes configuration
//
// File: productRouter.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-10-26
// Changes: Added express-validator middleware and new routes
// ==========================================

import { Router } from 'express';
// Controllers
import {
  getOneProduct,
  getAllProducts,
  getProductsByCategory,
  createOneProduct,
  updateOneProduct,
  updateOnePartialProduct,
  updateProductStock,
  deleteOneProduct,
} from '../controllers/productController.js';
// Validations
import {
  createProductValidation,
  updateProductValidation,
  updatePartialProductValidation,
  stockUpdateValidation,
  productIdValidation,
} from '../validations/productValidator.js';
// Middleware to handle validation errors
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

const router = Router();

// GET all products - NO validation needed (read-only)
router.get('/', getAllProducts);

// GET products by category - NO validation needed (read-only)
router.get('/category/:categoryId', getProductsByCategory);

// GET one product by ID - ID validation only
router.get('/:id', productIdValidation, handleValidationErrors, getOneProduct);

// POST a new product - Full validation required
router.post(
  '/',
  createProductValidation,
  handleValidationErrors,
  createOneProduct
);

// PUT update a product completely - Full validation
router.put(
  '/:id',
  updateProductValidation,
  handleValidationErrors,
  updateOneProduct
);

// PATCH update a product partially - Partial validation
router.patch(
  '/:id',
  updatePartialProductValidation,
  handleValidationErrors,
  updateOnePartialProduct
);

// PATCH update product stock - Quantity validation only
router.patch(
  '/:id/stock',
  stockUpdateValidation,
  handleValidationErrors,
  updateProductStock
);

// DELETE a product - ID validation only
router.delete(
  '/:id',
  productIdValidation,
  handleValidationErrors,
  deleteOneProduct
);

export default router;
