// ==========================================
//
// Description: Logger Middleware
//
// File: loggerMiddleware.js
// Author: Anthony Bañon
// Created: 2025-11-08
// Last Updated: 2025-11-08
// ==========================================

import logger from '../config/winston.js';

// Paths that should not be logged to reduce noise and exposure
const EXCLUDED_PATHS = ['/health', '/metrics', '/favicon.ico'];

// Sensitive headers that should NEVER be logged
const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'proxy-authorization',
  'x-api-key',
  'x-auth-token',
];

/**
 * Middleware to log HTTP requests with response time and status
 * Logs after the response is finished to capture final status code
 * Includes security enhancements to prevent sensitive data exposure
 */
export const requestLogger = (req, res, next) => {
  // Skip logging for excluded paths to reduce noise
  if (EXCLUDED_PATHS.includes(req.path)) {
    return next();
  }

  const start = Date.now();

  // Log when response is completed
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Secure logging data - never include sensitive information
    const logData = {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      // Only include user ID if available (never sensitive data)
      userId: req.user?.id || 'anonymous',
    };

    // Determine log level based on HTTP status code
    let logLevel = 'http';
    if (res.statusCode >= 500) {
      logLevel = 'error';
    } else if (res.statusCode >= 400) {
      logLevel = 'warn';
    }

    logger[logLevel](`${req.method} ${req.originalUrl}`, logData);
  });

  next();
};

/**
 * Global error handling middleware
 * Logs unhandled errors with stack trace and request context
 * Includes security measures for production environments
 */
export const errorLogger = (error, req, res, next) => {
  // Skip logging for excluded paths
  if (EXCLUDED_PATHS.includes(req.path)) {
    return next(error);
  }

  logger.error('Unhandled error', {
    error: error.message,
    // Hide full stack traces in production for security
    stack:
      process.env.NODE_ENV === 'production'
        ? 'Stack trace hidden'
        : error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
  });

  next(error);
};
