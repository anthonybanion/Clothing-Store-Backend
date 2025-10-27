// ==========================================
//
// Description: Validation rules for Product entity using express-validator
//
// File: productValidator.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import { body, param } from 'express-validator';

export const createProductValidation = [
  // Basic SKU format validation - Mongoose handles regex and uniqueness
  body('sku')
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be 3-20 characters')
    .trim()
    .toUpperCase(),

  // Product name - basic length check, Mongoose handles complex regex
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .trim(),

  // Optional image URL - basic URL format validation
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  // Mongoose handles HTTPS requirement

  // Optional description - length validation if provided
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
    .trim(),

  // Price validation - basic positive number check
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  // Mongoose handles custom validator for business rules

  // Stock validation - basic non-negative integer
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  // Active status - boolean validation
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false'),

  // Category reference - must be valid MongoDB ID
  body('category').isMongoId().withMessage('Valid category ID is required'),
];

export const updateProductValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),

  body('sku').optional().isLength({ min: 3, max: 20 }).trim().toUpperCase(),

  body('name').optional().isLength({ min: 2, max: 150 }).trim(),

  body('image').optional().isURL(),

  body('description').optional().isLength({ max: 2000 }).trim(),

  body('price').optional().isFloat({ min: 0.01 }),

  body('stock').optional().isInt({ min: 0 }),

  body('is_active').optional().isBoolean(),

  body('category').optional().isMongoId(),
];

export const productIdValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),
];

export const stockUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),

  body('quantity').isInt().withMessage('Quantity must be an integer'),
  // Business logic in service handles positive/negative values
];

export const bulkProductUpdateValidation = [
  body().isArray().withMessage('Request body must be an array'),

  body('*.sku').optional().isLength({ min: 3, max: 20 }).trim().toUpperCase(),

  body('*.price').optional().isFloat({ min: 0.01 }),

  body('*.stock').optional().isInt({ min: 0 }),
];
