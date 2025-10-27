// ==========================================
//
// Description: Validation rules for Person entity using express-validator
// Complementary validations - ONLY what Mongoose doesn't handle well
//
// File: personValidators.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import { body, param } from 'express-validator';

export const createPersonValidation = [
  // Basic format validation + sanitization only
  body('first_name').notEmpty().withMessage('First name is required').trim(),

  body('last_name').notEmpty().withMessage('Last name is required').trim(),

  body('dni')
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage('DNI must be 8 digits'),
  // Mongoose handles the regex and uniqueness

  body('profile_photo')
    .optional()
    .isURL()
    .withMessage('Profile photo must be a valid URL'),
  // Mongoose handles the HTTPS requirement

  body('email')
    .isEmail()
    .withMessage('Valid email address is required')
    .normalizeEmail() // Sanitization only
    .toLowerCase(), // Sanitization only
  // Mongoose handles uniqueness, length, and custom regex

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be true or false'),
];

export const updatePersonValidation = [
  param('id').isMongoId().withMessage('Invalid person ID'),

  body('first_name').optional().trim(),

  body('last_name').optional().trim(),

  body('dni').optional().isLength({ min: 8, max: 8 }),

  body('profile_photo').optional().isURL(),

  body('email').optional().isEmail().normalizeEmail().toLowerCase(),

  body('is_active').optional().isBoolean(),
];

export const personIdValidation = [
  param('id').isMongoId().withMessage('Invalid person ID'),
];
