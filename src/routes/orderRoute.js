// ==========================================
//
// Description: Order routes with validation and authentication
//
// File: orderRoute.js
// Author: [Tu Nombre]
// Created: 2025-11-05
// ==========================================

import { Router } from 'express';
import {
  getOneOrder,
  getAllOrders,
  getMyOrders,
  createOneOrder,
  updateOneOrder,
  updatePartialOrder,
  updateOrderStatus,
  deleteOneOrder,
} from '../controllers/orderController.js';
import {
  createOrderValidation,
  updateOrderValidation,
  updatePartialOrderValidation,
  orderIdValidation,
  updateOrderStatusValidation,
} from '../validations/orderValidation.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
import {
  authenticateToken,
  requireRole,
  requireOwnershipOrRole,
} from '../middlewares/authMiddleware.js';

const router = Router();

// 🔐 PROTECTED ROUTES

// GET /api/orders - Get all orders (admin sees all, users see their own)
router.get('/', authenticateToken, getAllOrders);

// GET /api/orders/my-orders - Get current user's orders
router.get('/my-orders', authenticateToken, getMyOrders);

// GET /api/orders/:id - Get specific order (users can only see their own)
router.get(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  orderIdValidation,
  handleValidationErrors,
  getOneOrder
);

// POST /api/orders - Create new order (users create their own, admin can create for anyone)
router.post(
  '/',
  authenticateToken,
  createOrderValidation,
  handleValidationErrors,
  createOneOrder
);

// PUT /api/orders/:id - Full update (users can only update their own)
router.put(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  updateOrderValidation,
  handleValidationErrors,
  updateOneOrder
);

// PATCH /api/orders/:id - Partial update (users can only update their own)
router.patch(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  updatePartialOrderValidation,
  handleValidationErrors,
  updatePartialOrder
);

// PATCH /api/orders/:id/status - Update order status (admin only)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['admin']),
  updateOrderStatusValidation,
  handleValidationErrors,
  updateOrderStatus
);

// DELETE /api/orders/:id - Delete order (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  orderIdValidation,
  handleValidationErrors,
  deleteOneOrder
);

export default router;
