// ==========================================
//
// Description: Validation rules for OrderDetail entity using express-validator
//
// File: orderDetailValidator.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes: Added comprehensive validations and reusable chains
// ==========================================

import { body, param } from 'express-validator';

// Common validation chains (REUSABLE)
const quantityValidation = () =>
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
    .isInt({ max: 999 })
    .withMessage('Quantity cannot exceed 999');

const historicalPriceValidation = () =>
  body('historical_price')
    .isFloat({ min: 0.01 })
    .withMessage('Historical price must be greater than 0')
    .isFloat({ max: 999999.99 })
    .withMessage('Historical price cannot exceed 999999.99');

const orderValidation = () =>
  body('order').isMongoId().withMessage('Valid order ID is required');

const productValidation = () =>
  body('product').isMongoId().withMessage('Valid product ID is required');

// Optional versions for partial updates
const optionalQuantityValidation = () =>
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
    .isInt({ max: 999 })
    .withMessage('Quantity cannot exceed 999');

const optionalHistoricalPriceValidation = () =>
  body('historical_price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Historical price must be greater than 0')
    .isFloat({ max: 999999.99 })
    .withMessage('Historical price cannot exceed 999999.99');

const optionalOrderValidation = () =>
  body('order')
    .optional()
    .isMongoId()
    .withMessage('Valid order ID is required');

const optionalProductValidation = () =>
  body('product')
    .optional()
    .isMongoId()
    .withMessage('Valid product ID is required');

// Main validation exports
export const createOrderDetailValidation = [
  quantityValidation(),
  historicalPriceValidation(),
  orderValidation(),
  productValidation(),
];

export const updateOrderDetailValidation = [
  param('id').isMongoId().withMessage('Invalid order detail ID'),
  quantityValidation(),
  historicalPriceValidation(),
  orderValidation(),
  productValidation(),
];

export const updatePartialOrderDetailValidation = [
  param('id').isMongoId().withMessage('Invalid order detail ID'),
  optionalQuantityValidation(),
  optionalHistoricalPriceValidation(),
  optionalOrderValidation(),
  optionalProductValidation(),
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error('At least one field must be provided for update');
    }
    return true;
  }),
];

export const orderDetailIdValidation = [
  param('id').isMongoId().withMessage('Invalid order detail ID'),
];

// Special validation for bulk order detail creation
export const bulkOrderDetailValidation = [
  body()
    .isArray({ min: 1 })
    .withMessage('Request body must be a non-empty array'),

  body('*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must have quantity at least 1')
    .isInt({ max: 999 })
    .withMessage('Each item quantity cannot exceed 999'),

  body('*.historical_price')
    .isFloat({ min: 0.01 })
    .withMessage('Each item must have price greater than 0')
    .isFloat({ max: 999999.99 })
    .withMessage('Each item price cannot exceed 999999.99'),

  body('*.order').isMongoId().withMessage('Each item must have valid order ID'),

  body('*.product')
    .isMongoId()
    .withMessage('Each item must have valid product ID'),
];

// Special validation for order details by order
export const orderDetailsByOrderValidation = [
  param('orderId').isMongoId().withMessage('Valid order ID is required'),
];

// Special validation for updating multiple order details
export const bulkOrderDetailUpdateValidation = [
  body()
    .isArray({ min: 1 })
    .withMessage('Request body must be a non-empty array'),

  body('*.id')
    .isMongoId()
    .withMessage('Each item must have valid order detail ID'),

  body('*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
    .isInt({ max: 999 })
    .withMessage('Quantity cannot exceed 999'),

  body('*.historical_price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Historical price must be greater than 0')
    .isFloat({ max: 999999.99 })
    .withMessage('Historical price cannot exceed 999999.99'),

  body().custom((value, { req }) => {
    // Validate that at least one field is provided in each update
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const fields = Object.keys(item).filter((key) => key !== 'id');
      if (fields.length === 0) {
        throw new Error(`Item ${i + 1} must have at least one field to update`);
      }
    }
    return true;
  }),
];
