// ==========================================
// Description: Category validation rules - SINGLE SOURCE OF TRUTH
// File: categoryValidator.js
// ==========================================

import { body, param } from 'express-validator';

// Regular expressions (SINGLE SOURCE - moved from model)
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,'\-]{2,150}$/;
const IMAGE_URL_REGEX = /^https:\/\/.*$/;

// Common validation chains (REUSABLE)
const nameValidation = () =>
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .matches(NAME_REGEX)
    .withMessage('Category name contains invalid characters')
    .trim();

const imageValidation = () =>
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
    .matches(IMAGE_URL_REGEX)
    .withMessage('Image must be HTTPS URL');

const descriptionValidation = () =>
  body('description')
    .optional()
    .isLength({ min: 2, max: 2000 })
    .withMessage('Description must be 2-2000 characters')
    .trim();

const isActiveValidation = () =>
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false');

// Optional versions for partial updates
const optionalNameValidation = () =>
  body('name')
    .optional()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters')
    .matches(NAME_REGEX)
    .withMessage('Category name contains invalid characters')
    .trim();

// Required versions for complete updates
const requiredImageValidation = () =>
  body('image')
    .notEmpty()
    .withMessage('Image is required for complete update')
    .isURL()
    .withMessage('Image must be a valid URL')
    .matches(IMAGE_URL_REGEX)
    .withMessage('Image must be HTTPS URL');

const requiredDescriptionValidation = () =>
  body('description')
    .notEmpty()
    .withMessage('Description is required for complete update')
    .isLength({ min: 2, max: 2000 })
    .withMessage('Description must be 2-2000 characters')
    .trim();

const requiredIsActiveValidation = () =>
  body('is_active')
    .notEmpty()
    .withMessage('Active status is required for complete update')
    .isBoolean()
    .withMessage('Active status must be true or false');

// Main validation exports
export const createCategoryValidation = [
  nameValidation(),
  imageValidation(),
  descriptionValidation(),
  isActiveValidation(),
];

export const updateCategoryValidation = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  nameValidation(),
  requiredImageValidation(),
  requiredDescriptionValidation(),
  requiredIsActiveValidation(),
];

export const updatePartialCategoryValidation = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  optionalNameValidation(),
  imageValidation(),
  descriptionValidation(),
  isActiveValidation(),
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

export const updateCategoryStatusValidation = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('is_active')
    .notEmpty()
    .withMessage('is_active field is required')
    .isBoolean()
    .withMessage('is_active must be true or false'),
];
