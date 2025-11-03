// ==========================================
//
// Description: Product routes configuration
//
// File: productRouter.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-11-02
// Changes: Added middleware for image upload
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
// Middleware to handle validation errors
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
// Middleware for image upload
import { uploadImage } from '../middlewares/uploadMiddleware.js';

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
  uploadImage,
  createProductValidation,
  handleValidationErrors,
  createOneProduct
);

// PUT update a product completely - Full validation
router.put(
  '/:id',
  uploadImage,
  updateProductValidation,
  handleValidationErrors,
  updateOneProduct
);

// PATCH update a product partially - Partial validation
router.patch(
  '/:id',
  uploadImage,
  updatePartialProductValidation,
  handleValidationErrors,
  updatePartialProduct
);

// PATCH update product stock - Quantity validation only
router.patch(
  '/:id/stock',
  stockUpdateValidation,
  handleValidationErrors,
  updateProductStock
);

// PATCH update product status (soft delete or restore)
router.patch(
  '/:id/status',
  updateProductStatusValidation,
  handleValidationErrors,
  updateProductStatus
);
// DELETE product image - ID validation only
router.delete(
  '/:id/image',
  productIdValidation,
  handleValidationErrors,
  deleteProductImage
);

// DELETE a product - ID validation only
router.delete(
  '/:id',
  productIdValidation,
  handleValidationErrors,
  deleteOneProduct
);

export default router;
