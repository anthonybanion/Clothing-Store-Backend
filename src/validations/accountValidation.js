// ==========================================
//
// Description: Validation rules for Account entity using express-validator
// Complementary validations - ONLY what Mongoose doesn't handle well
//
// File: accountValidators.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes: Added optional validations for partial updates
// ==========================================

import { body, param } from 'express-validator';

// Regular expressions (SINGLE SOURCE - moved from model)
const USERNAME_REGEX = /^[a-zA-Z0-9._]{2,30}$/;

// Common validation chains (REUSABLE)
const usernameValidation = () =>
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Username must be 2-30 characters')
    .matches(USERNAME_REGEX)
    .withMessage(
      'Username may only contain letters, numbers, dots, and underscores'
    )
    .trim()
    .toLowerCase();

const passwordValidation = () =>
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 255 })
    .withMessage('Password cannot exceed 255 characters');

const roleValidation = () =>
  body('role')
    .isIn(['client', 'admin'])
    .withMessage('Role must be either "client" or "admin"');

const activeValidation = () =>
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false');

const personValidation = () =>
  body('person').isMongoId().withMessage('Valid person ID is required');

// Optional versions for partial updates
const optionalUsernameValidation = () =>
  body('username')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('Username must be 2-30 characters')
    .matches(USERNAME_REGEX)
    .withMessage(
      'Username may only contain letters, numbers, dots, and underscores'
    )
    .trim()
    .toLowerCase();

const optionalPasswordValidation = () =>
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 255 })
    .withMessage('Password cannot exceed 255 characters');

const optionalRoleValidation = () =>
  body('role')
    .optional()
    .isIn(['client', 'admin'])
    .withMessage('Role must be either "client" or "admin"');

// Main validation exports
export const createAccountValidation = [
  usernameValidation(),
  passwordValidation(),
  roleValidation(),
  activeValidation(),
  personValidation(),
];

export const updateAccountValidation = [
  param('id').isMongoId().withMessage('Invalid account ID'),
  usernameValidation(),
  passwordValidation(),
  roleValidation(),
  activeValidation(),
  personValidation(),
];

export const updatePartialAccountValidation = [
  param('id').isMongoId().withMessage('Invalid account ID'),
  optionalUsernameValidation(),
  optionalPasswordValidation(),
  optionalRoleValidation(),
  activeValidation(),
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error('At least one field must be provided for update');
    }
    return true;
  }),
];

export const accountIdValidation = [
  param('id').isMongoId().withMessage('Invalid account ID'),
];

export const updateAccountStatusValidation = [
  param('id').isMongoId().withMessage('Invalid account ID'),
  body('active')
    .notEmpty()
    .withMessage('active field is required')
    .isBoolean()
    .withMessage('active must be true or false'),
];

// Special validation for login
export const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .toLowerCase(),

  body('password').notEmpty().withMessage('Password is required'),
];

// Special validation for password change
export const changePasswordValidation = [
  param('id').isMongoId().withMessage('Invalid account ID'),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .isLength({ max: 255 })
    .withMessage('New password cannot exceed 255 characters'),
];
