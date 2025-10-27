// ==========================================
//
// Description: Mongoose error handling utilities
//
// File: mongooseErrorHandler.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

/**
 * Generic Mongoose error handler for all models
 * Processes ValidationError, duplicate key, and CastError
 */
export const handleMongooseError = (error) => {
  // Validation errors from schema constraints
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message, // Uses custom messages from model definitions
      type: err.kind,
    }));

    return {
      statusCode: 400,
      response: {
        message: 'Validation failed',
        errors: errors,
      },
    };
  }

  // Duplicate key errors (unique constraints)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];

    // Generic message works for any unique field across all models
    const message = `${field} '${value}' already exists`;

    return {
      statusCode: 409,
      response: {
        message: 'Duplicate entry',
        error: message,
        field: field,
        value: value,
      },
    };
  }

  // Invalid ObjectId format
  if (error.name === 'CastError') {
    return {
      statusCode: 400,
      response: {
        message: 'Invalid ID format',
        error: `Invalid ${error.path}: ${error.value}`,
      },
    };
  }

  // Unexpected errors
  return {
    statusCode: 500,
    response: {
      message: 'Internal server error',
      error: error.message,
    },
  };
};
