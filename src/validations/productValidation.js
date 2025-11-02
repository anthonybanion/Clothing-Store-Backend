// ==========================================
// 
// Description: Product validation rules
//
// File: productValidation.js
// Author: Anthony Bañon
// Created: 2025-11-02
// Last Updated: 2025-11-02
// ==========================================



import { body, param } from 'express-validator';

// Regular expressions (SINGLE SOURCE - moved from model)
const SKU_REGEX = /^[A-Z0-9-]{3,20}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,'\-]{2,150}$/;
const IMAGE_URL_REGEX = /^https:\/\/.*$/;

// Common validation chains (REUSABLE - no code duplication)
const skuValidation = () =>
  body('sku')
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be 3-20 characters')
    .matches(SKU_REGEX)
    .withMessage('SKU can only contain uppercase letters, numbers, and hyphen')
    .trim()
    .toUpperCase();

const nameValidation = () =>
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .matches(NAME_REGEX)
    .withMessage('Product name contains invalid characters')
    .trim();

const descriptionValidation = () =>
  body('description')
    .optional()
    .isLength({ min: 2, max: 2000 })
    .withMessage('Description must be 2-2000 characters')
    .trim();

const priceValidation = () =>
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0');

const stockValidation = () =>
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer');

const isActiveValidation = () =>
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false');

const categoryValidation = () =>
  body('category').isMongoId().withMessage('Valid category ID is required');

// Optional versions for partial updates
const optionalSkuValidation = () =>
  body('sku')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be 3-20 characters')
    .matches(SKU_REGEX)
    .withMessage('SKU format invalid')
    .trim()
    .toUpperCase();

const optionalNameValidation = () =>
  body('name')
    .optional()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .matches(NAME_REGEX)
    .withMessage('Product name contains invalid characters')
    .trim();

const optionalPriceValidation = () =>
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0');

const optionalCategoryValidation = () =>
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required');

// Main validation exports
export const createProductValidation = [
  skuValidation(),
  nameValidation(),
  descriptionValidation(),
  priceValidation(),
  stockValidation(),
  isActiveValidation(),
  categoryValidation(),
];

export const updateProductValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),

  // Complete update - all fields required
  skuValidation(),
  nameValidation(),
  descriptionValidation(),
  priceValidation(),
  stockValidation(),
  isActiveValidation(),
  categoryValidation(),
];

export const updatePartialProductValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),

  // Partial update - all fields optional but with same validation rules
  optionalSkuValidation(),
  optionalNameValidation(),
  descriptionValidation(), // Already optional
  optionalPriceValidation(),
  stockValidation(), // Already optional via .optional() in the chain
  isActiveValidation(), // Already optional
  optionalCategoryValidation(),

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
    .isBoolean()
    .withMessage('is_active must be true or false'),
];
