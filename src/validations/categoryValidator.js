// ==========================================
//
// Description: Validation rules for Category entity using express-validator
//
// File: categoryValidator.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import { body, param } from 'express-validator';

export const createCategoryValidation = [
  // Category name - basic format validation
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .trim(),
  // Mongoose handles unique constraint and complex regex validation

  // Optional image - basic URL validation
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  // Mongoose handles HTTPS requirement specifically

  // Optional description - length validation if provided
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
    .trim(),
  // Mongoose handles minimum length when description is provided

  // Active status - boolean validation with default
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false'),
];

export const updateCategoryValidation = [
  param('id').isMongoId().withMessage('Invalid category ID'),

  // FOR COMPLETE UPDATE - all fields required
  body('name')
    .notEmpty()
    .withMessage('Category name is required for complete update')
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .bail()
    .trim(),

  body('image')
    .notEmpty()
    .withMessage('Image is required for complete update')
    .bail()
    .isURL()
    .withMessage('Image must be a valid URL'),

  body('description')
    .notEmpty()
    .withMessage('Description is required for complete update')
    .bail()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
    .bail()
    .trim(),

  body('is_active')
    .notEmpty()
    .withMessage('Active status is required for complete update')
    .bail()
    .isBoolean()
    .withMessage('Active status must be true or false'),
];

export const updatePartialCategoryValidation = [
  param('id').isMongoId().withMessage('Invalid category ID'),

  // FOR PARTIAL UPDATE - all fields optional
  body('name')
    .optional()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .bail()
    .trim(),

  body('image').optional().isURL().withMessage('Image must be a valid URL'),

  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
    .bail()
    .trim(),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false'),

  // Validate at least one field is provided for partial update
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error('At least one field must be provided for update');
    }
    return true;
  }),
];

export const categoryIdValidation = [
  param('id').isMongoId().withMessage('Invalid category ID'),
];

// Special validation for category status updates only
export const updateCategoryStatusValidation = [
  param('id').isMongoId().withMessage('Invalid category ID'),

  body('is_active')
    .notEmpty()
    .withMessage('is_active field is required')
    .bail()
    .isBoolean()
    .withMessage('is_active must be true or false'),
];
