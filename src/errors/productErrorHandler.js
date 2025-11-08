// ==========================================
//
// Description: Centralized error handler for product-related errors
//
// File: productErrorHandler.js
// Author: Anthony Bañon
// Created: 2025-10-26
// Last Updated: 2025-10-26
// Changes: Initial creation of product error handler
// ==========================================

import { handleMongooseError } from '../utils/mongooseErrorHandler.js';
import {
  ProductNotFoundError,
  DuplicateSkuError,
  InvalidStockError,
} from './productBusinessError.js';
import { CODE } from '../config/constants.js';

/**
 * Centralized error handler for product controllers
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @returns {Object} Express response
 */
export const handleProductError = (res, error) => {
  // 1. Handle business errors first
  if (error instanceof ProductNotFoundError) {
    return res.status(CODE.NOT_FOUND).json({
      message: error.message,
      code: error.code,
      productId: error.productId,
    });
  }

  if (error instanceof DuplicateSkuError) {
    return res.status(CODE.CONFLICT).json({
      message: error.message,
      code: error.code,
      sku: error.sku,
    });
  }

  if (error instanceof InvalidStockError) {
    return res.status(CODE.BAD_REQUEST).json({
      message: error.message,
      code: error.code,
    });
  }

  // 2. Handle technical errors (Mongoose)
  if (
    error.name === 'ValidationError' ||
    error.code === 11000 ||
    error.name === 'CastError'
  ) {
    const { statusCode, response } = handleMongooseError(error);
    return res.status(statusCode).json(response);
  }

  // 3. Handle unexpected errors
  console.error('Unexpected product error:', error);
  const errorResponse = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.details = error.message;
  }

  return res.status(CODE.INTERNAL_ERROR).json(errorResponse);
};
