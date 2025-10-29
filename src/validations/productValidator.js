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

  // FOR COMPLETE UPDATE - all fields required
  body('sku')
    .notEmpty()
    .withMessage('SKU is required for complete update')
    .bail() // ← Stop if empty
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be 3-20 characters')
    .bail() // ← Stop if length fails
    .trim()
    .toUpperCase(),

  body('name')
    .notEmpty()
    .withMessage('Product name is required for complete update')
    .bail() // ← Stop if empty
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .bail() // ← Stop if length fails
    .trim(),

  body('price')
    .notEmpty()
    .withMessage('Price is required for complete update')
    .bail() // ← Stop if empty
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),

  body('category')
    .notEmpty()
    .withMessage('Category is required for complete update')
    .bail() // ← Stop if empty
    .isMongoId()
    .withMessage('Valid category ID is required'),

  // Optional fields - no .notEmpty() needed
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
    .trim(),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false'),
];

export const updatePartialProductValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),

  // FOR PARTIAL UPDATE - all fields optional
  body('sku')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be 3-20 characters')
    .bail()
    .trim()
    .toUpperCase(),

  body('name')
    .optional()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .bail()
    .trim(),

  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),

  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
    .trim(),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false'),

  // Validate at least one field is provided
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error('At least one field must be provided for update');
    }
    return true;
  }),
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

export const updateProductStatusValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  
  body('is_active')
    .notEmpty()
    .withMessage('is_active field is required')
    .bail()
    .isBoolean()
    .withMessage('is_active must be true or false'),
];
