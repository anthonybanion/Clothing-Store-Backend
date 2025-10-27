// ==========================================
//
// Description: Validation rules for Account entity using express-validator
// Complementary validations - ONLY what Mongoose doesn't handle well
//
// File: accountValidators.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import { body, param } from 'express-validator';

export const createAccountValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 2, max: 30 }).withMessage('Username must be 2-30 characters')
    .trim()
    .toLowerCase(),
    // Mongoose handles the custom regex and uniqueness
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 1 }).withMessage('Password cannot be empty'),
    // Password strength validation should be in application logic
  
  body('role')
    .isIn(['client', 'admin']).withMessage('Role must be client or admin'),
  
  body('active')
    .optional()
    .isBoolean().withMessage('Active status must be true or false'),
  
  body('person')
    .isMongoId().withMessage('Valid person ID is required')
];

export const updateAccountValidation = [
  param('id')
    .isMongoId().withMessage('Invalid account ID'),
  
  body('username')
    .optional()
    .isLength({ min: 2, max: 30 })
    .trim()
    .toLowerCase(),
  
  body('password')
    .optional()
    .isLength({ min: 1 }),
  
  body('role')
    .optional()
    .isIn(['client', 'admin']),
  
  body('active')
    .optional()
    .isBoolean(),
  
  body('person')
    .optional()
    .isMongoId()
];

export const accountIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid account ID')
];

export const loginValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .trim()
    .toLowerCase(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];