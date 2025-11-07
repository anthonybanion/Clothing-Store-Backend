// ==========================================
//
// Description: OrderDetail routes
//
// File: OrderDetailRoute.js
// Author: Anthony Bañon
// Created: 2025-11-07
// Last Updated: 2025-11-07
// ==========================================

import { Router } from 'express';
import {
  getOneOrderDetail,
  getAllOrderDetails,
  getOrderDetailsByOrder,
  getOrderDetailsByProduct,
  createOneOrderDetail,
  createMultipleOrderDetails,
  updateOneOrderDetail,
  updateOrderDetailQuantity,
  deleteOneOrderDetail,
  deleteOrderDetailsByOrder,
} from '../controllers/orderDetailController.js';
import {
  createOrderDetailValidation,
  updateOrderDetailValidation,
  updatePartialOrderDetailValidation,
  orderDetailIdValidation,
  bulkOrderDetailValidation,
  orderDetailsByOrderValidation,
} from '../validations/orderDetailValidator.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';
import {
  authenticateToken,
  requireRole,
  requireOwnershipOrRole,
} from '../middlewares/authMiddleware.js';

const router = Router();

// 🔐 PROTECTED ROUTES

// GET /api/order-details - Get all order details (admin only)
router.get('/', authenticateToken, requireRole(['admin']), getAllOrderDetails);

// GET /api/order-details/:id - Get specific order detail
router.get(
  '/:id',
  authenticateToken,
  orderDetailIdValidation,
  handleValidationErrors,
  getOneOrderDetail
);

// GET /api/order-details/order/:orderId - Get order details by order ID
router.get(
  '/order/:orderId',
  authenticateToken,
  orderDetailsByOrderValidation,
  handleValidationErrors,
  getOrderDetailsByOrder
);

// GET /api/order-details/product/:productId - Get order details by product ID (admin only)
router.get(
  '/product/:productId',
  authenticateToken,
  requireRole(['admin']),
  getOrderDetailsByProduct
);

// POST /api/order-details - Create new order detail
router.post(
  '/',
  authenticateToken,
  createOrderDetailValidation,
  handleValidationErrors,
  createOneOrderDetail
);

// POST /api/order-details/bulk - Create multiple order details
router.post(
  '/bulk',
  authenticateToken,
  bulkOrderDetailValidation,
  handleValidationErrors,
  createMultipleOrderDetails
);

// PUT /api/order-details/:id - Full update
router.put(
  '/:id',
  authenticateToken,
  updateOrderDetailValidation,
  handleValidationErrors,
  updateOneOrderDetail
);

// PATCH /api/order-details/:id - Partial update
router.patch(
  '/:id',
  authenticateToken,
  updatePartialOrderDetailValidation,
  handleValidationErrors,
  updateOneOrderDetail
);

// PATCH /api/order-details/:id/quantity - Update quantity only
router.patch(
  '/:id/quantity',
  authenticateToken,
  orderDetailIdValidation,
  handleValidationErrors,
  updateOrderDetailQuantity
);

// DELETE /api/order-details/:id - Delete order detail
router.delete(
  '/:id',
  authenticateToken,
  orderDetailIdValidation,
  handleValidationErrors,
  deleteOneOrderDetail
);

// DELETE /api/order-details/order/:orderId - Delete all order details for an order
router.delete(
  '/order/:orderId',
  authenticateToken,
  requireRole(['admin']),
  orderDetailsByOrderValidation,
  handleValidationErrors,
  deleteOrderDetailsByOrder
);

export default router;
