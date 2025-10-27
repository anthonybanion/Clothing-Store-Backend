// ==========================================
//
// Description: Validation rules for OrderDetail entity using express-validator
//
// File: orderDetailValidator.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import { body, param } from 'express-validator';

export const createOrderDetailValidation = [
  // Quantity validation - basic format check
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  // Mongoose handles integer validation and custom messages

  // Historical price validation - basic positive number check
  body('historical_price')
    .isFloat({ min: 0.01 })
    .withMessage('Historical price must be greater than 0'),
  // Mongoose handles custom validator and precise business rules

  // Reference validations - ensure valid MongoDB IDs
  body('order').isMongoId().withMessage('Valid order ID is required'),

  body('product').isMongoId().withMessage('Valid product ID is required'),
];

export const updateOrderDetailValidation = [
  param('id').isMongoId().withMessage('Invalid order detail ID'),

  body('quantity').optional().isInt({ min: 1 }),

  body('historical_price').optional().isFloat({ min: 0.01 }),

  body('order').optional().isMongoId(),

  body('product').optional().isMongoId(),
];

export const orderDetailIdValidation = [
  param('id').isMongoId().withMessage('Invalid order detail ID'),
];

// Special validation for bulk order detail creation
export const bulkOrderDetailValidation = [
  body().isArray().withMessage('Request body must be an array'),

  body('*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must have quantity at least 1'),

  body('*.historical_price')
    .isFloat({ min: 0.01 })
    .withMessage('Each item must have price greater than 0'),

  body('*.order').isMongoId().withMessage('Each item must have valid order ID'),

  body('*.product')
    .isMongoId()
    .withMessage('Each item must have valid product ID'),
];
