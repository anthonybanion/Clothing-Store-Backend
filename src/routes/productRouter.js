// ==========================================
//
// Description: Product routes configuration
//
// File: productRouter.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-10-26
// Changes: Added new routes for category and stock, updated file naming
// ==========================================

import { Router } from 'express';
import {
  getOneProduct,
  getAllProducts,
  getProductsByCategory,
  createOneProduct,
  updateOneProduct,
  updatePartialOneProduct,
  updateProductStock,
  deleteOneProduct,
} from '../controllers/productController.js';

const router = Router();

// GET all products - NO validation needed (read-only)
router.get('/', getAllProducts);

// GET products by category - NO validation needed (read-only)
router.get('/category/:categoryId', getProductsByCategory);

// GET one product by ID - NO validation needed (read-only)
router.get('/:id', getOneProduct);

// POST a new product - NEEDS validation
router.post('/', createOneProduct);

// PUT update a product completely - NEEDS validation
router.put('/:id', updateOneProduct);

// PATCH update a product partially - NEEDS validation
router.patch('/:id', updatePartialOneProduct);

// PATCH update product stock - NEEDS validation (quantity)
router.patch('/:id/stock', updateProductStock);

// DELETE a product - NO validation needed (no body data)
router.delete('/:id', deleteOneProduct);

export default router;
