// ==========================================
//
// Description: Global error handling middleware
//
// File: globalErrorHandler.js
// Author: Anthony Bañon
// Created: 2025-10-29
// Last Updated: 2025-10-29
// ==========================================

import { handleMongooseError } from '../utils/mongooseErrorHandler.js';
import { baseError } from '../errors/baseError.js';
import { CODE } from '../config/constants.js';

export const globalErrorHandler = (error, req, res, next) => {
  // 1. Handle our custom baseErrors (business errors)
  if (error instanceof baseError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
        // Include stack trace only in development
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
        }),
      },
    });
  }

  // 2. Handle technical errors (Mongoose)
  if (
    error.name === 'ValidationError' ||
    error.code === 11000 ||
    error.name === 'CastError'
  ) {
    const { statusCode, response } = handleMongooseError(error);
    return res.status(statusCode).json({
      success: false,
      error: response,
    });
  }

  // 3. Handle other common technical errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(CODE.UNAUTHORIZED).json({
      success: false,
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
      },
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(CODE.UNAUTHORIZED).json({
      success: false,
      error: {
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      },
    });
  }

  // 4. Handle unexpected errors
  console.error('🚨 Unexpected error:', error);

  const errorResponse = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
    errorResponse.error.details = error.message;
  }

  return res.status(CODE.INTERNAL_ERROR).json(errorResponse);
};
