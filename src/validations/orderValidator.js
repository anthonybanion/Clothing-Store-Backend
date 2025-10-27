// ==========================================
//
// Description: Validation rules for Order entity using express-validator
// Complementary validations - ONLY what Mongoose doesn't handle well
//
// File: orderValidator.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import { body, param } from 'express-validator';

export const createOrderValidation = [
  body('order_number')
    .notEmpty().withMessage('Order number is required')
    .isLength({ min: 4, max: 20 }).withMessage('Order number must be 4-20 characters')
    .trim()
    .toUpperCase(),
    // Mongoose handles the custom regex and uniqueness
  
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Order date cannot be in the future');
      }
      return true;
    }),
  
  body('status')
    .isIn(['pending', 'paid', 'shipped', 'cancelled', 'delivered'])
    .withMessage('Status must be: pending, paid, shipped, cancelled, or delivered'),
  
  body('account')
    .isMongoId().withMessage('Valid account ID is required')
];

export const updateOrderValidation = [
  param('id')
    .isMongoId().withMessage('Invalid order ID'),
  
  body('order_number')
    .optional()
    .isLength({ min: 4, max: 20 })
    .trim()
    .toUpperCase(),
  
  body('date')
    .optional()
    .isISO8601()
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Order date cannot be in the future');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'shipped', 'cancelled', 'delivered']),
  
  body('account')
    .optional()
    .isMongoId()
];

export const orderIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid order ID')
];

export const updateOrderStatusValidation = [
  param('id')
    .isMongoId().withMessage('Invalid order ID'),
  
  body('status')
    .isIn(['pending', 'paid', 'shipped', 'cancelled', 'delivered'])
    .withMessage('Status must be: pending, paid, shipped, cancelled, or delivered')
];