// ==========================================
//
// Description: Validation rules for Person entity using express-validator
// Complementary validations - ONLY what Mongoose doesn't handle well
//
// File: personValidators.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-11-03
// Changes: Delete image processing validations
// ==========================================

import { body, param } from 'express-validator';

// Regular expressions (SINGLE SOURCE - moved from model)
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ']{2,50}$/;
const DNI_REGEX = /^[0-9]{8}$/;
const EMAIL_REGEX = /^[\w\.-]{1,64}@[\w\.-]+\.\w{2,63}$/;

// Common validation chains (REUSABLE)
const firstNameValidation = () =>
  body('first_name')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .matches(NAME_REGEX)
    .withMessage('First name contains invalid characters')
    .trim();

const lastNameValidation = () =>
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .matches(NAME_REGEX)
    .withMessage('Last name contains invalid characters')
    .trim();

const dniValidation = () =>
  body('dni')
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage('DNI must be exactly 8 digits')
    .matches(DNI_REGEX)
    .withMessage('DNI must contain only numbers (8 digits)');

const emailValidation = () =>
  body('email')
    .isEmail()
    .withMessage('Valid email address is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Email must be 5-100 characters')
    .matches(EMAIL_REGEX)
    .withMessage('Invalid email address format')
    .normalizeEmail()
    .toLowerCase()
    .trim();

const isActiveValidation = () =>
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false');

// Optional versions for partial updates
const optionalFirstNameValidation = () =>
  body('first_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .matches(NAME_REGEX)
    .withMessage('First name contains invalid characters')
    .trim();

const optionalLastNameValidation = () =>
  body('last_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .matches(NAME_REGEX)
    .withMessage('Last name contains invalid characters')
    .trim();

const optionalDniValidation = () =>
  body('dni')
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage('DNI must be exactly 8 digits')
    .matches(DNI_REGEX)
    .withMessage('DNI must contain only numbers (8 digits)');

const optionalEmailValidation = () =>
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email address is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Email must be 5-100 characters')
    .matches(EMAIL_REGEX)
    .withMessage('Invalid email address format')
    .normalizeEmail()
    .toLowerCase()
    .trim();

// Main validation exports
export const createPersonValidation = [
  firstNameValidation(),
  lastNameValidation(),
  dniValidation(),
  emailValidation(),
  isActiveValidation(),
];

export const updatePersonValidation = [
  param('id').isMongoId().withMessage('Invalid person ID'),
  firstNameValidation(),
  lastNameValidation(),
  dniValidation(),
  emailValidation(),
  isActiveValidation(),
];

export const updatePartialPersonValidation = [
  param('id').isMongoId().withMessage('Invalid person ID'),
  optionalFirstNameValidation(),
  optionalLastNameValidation(),
  optionalDniValidation(),
  optionalEmailValidation(),
  isActiveValidation(),
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0 && !req.file) {
      throw new Error('At least one field must be provided for update');
    }
    return true;
  }),
];

export const personIdValidation = [
  param('id').isMongoId().withMessage('Invalid person ID'),
];

export const updatePersonStatusValidation = [
  param('id').isMongoId().withMessage('Invalid person ID'),
  body('is_active')
    .notEmpty()
    .withMessage('is_active field is required')
    .isBoolean()
    .withMessage('is_active must be true or false'),
];
