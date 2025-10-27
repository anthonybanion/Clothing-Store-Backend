// ==========================================
//
// Description:
//
// File: validationMiddleware.js
// Author: Anthony Bañon
// Created: 2025-10-26
// Last Updated: 2025-10-26
// ==========================================

// middlewares/validationMiddleware.js
import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors from express-validator
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }

  next();
};
