// ==========================================
//
// Description: Authentication Middleware
//
// File: authMiddleware.js
// Author: Anthony Bañon
// Created: 2025-11-04
// Last Updated: 2025-11-04
// ==========================================

import AuthService from '../services/authService.js';
import {
  InvalidTokenError,
  TokenExpiredError,
  AuthError,
  InvalidCredentialsError,
  AccessDeniedError,
} from '../errors/businessError.js';
import { CODE } from '../config/constants.js';

/**
 * Middleware to authenticate JWT token
 *
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 * throws {AuthError} - If authentication fails
 * Usage: app.use(authenticateToken);
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    // Split the header to get the token
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthError(
        'Access token required',
        CODE.UNAUTHORIZED,
        'MISSING_TOKEN'
      );
    }

    // Validate token and get user data
    const userData = await AuthService.validateToken(token);

    // Attach user data to request
    req.user = userData;
    next();
  } catch (error) {
    // Handle different types of authentication errors
    if (
      // Expired token errors
      error.name === 'TokenExpiredError' ||
      error.message.includes('expired')
    ) {
      next(new TokenExpiredError());
    } else if (
      // Invalid token errors
      error.name === 'JsonWebTokenError' ||
      error.message.includes('invalid')
    ) {
      next(new InvalidTokenError());
    } else if (
      // Not before errors
      error.name === 'NotBeforeError'
    ) {
      next(
        new AuthError('Token no activo', CODE.UNAUTHORIZED, 'TOKEN_NOT_ACTIVE')
      );
    } else {
      // If it is already an instance of our custom errors, we pass it directly
      if (
        error instanceof AuthError ||
        error instanceof InvalidTokenError ||
        error instanceof TokenExpiredError
      ) {
        next(error);
      } else {
        // For other unexpected errors
        next(
          new AuthError(
            `Error de autenticación: ${error.message}`,
            CODE.UNAUTHORIZED,
            'AUTH_FAILED'
          )
        );
      }
    }
  }
};

/**
 * Middleware to verify specific roles
 *
 * param {Array<string>} allowedRoles - Array of roles allowed to access the route
 * returns {Function} - Express middleware function
 * throws {AuthError} - If the user does not have the required role
 *
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthError(
          'Authentication required',
          CODE.UNAUTHORIZED,
          'AUTH_REQUIRED'
        );
      }

      const userRoles = Array.isArray(req.user.role)
        ? req.user.role
        : [req.user.role];
      const hasRequiredRole = userRoles.some((role) =>
        allowedRoles.includes(role)
      );

      if (!hasRequiredRole) {
        throw new AccessDeniedError(
          'resource',
          'access',
          `Roles required: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware for public routes that can have an authenticated user
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 *
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const userData = await AuthService.validateToken(token);
        req.user = userData;
      } catch (error) {
        // If the token is invalid, we continue without a user
        // We do not throw an error so as not to interrupt the flow of public routes
        console.warn('Invalid optional token:', error.message);
      }
    }

    next();
  } catch (error) {
    // In case of unexpected error, we continue without user
    console.warn('Optional authentication error:', error.message);
    next();
  }
};

/**
 * Middleware to verify that the user is the owner of the resource or admin
 *
 * param {Array<string>} allowedRoles - Array of roles allowed to access the route regardless of ownership
 * returns {Function} - Express middleware function
 * throws {AuthError} - If the user is neither the owner nor has the required role
 *
 */
export const requireOwnershipOrRole = (allowedRoles = ['admin']) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthError(
          'Authentication required',
          CODE.UNAUTHORIZED,
          'AUTH_REQUIRED'
        );
      }

      // If admin, allow access
      const userRoles = Array.isArray(req.user.role)
        ? req.user.role
        : [req.user.role];
      const hasRequiredRole = userRoles.some((role) =>
        allowedRoles.includes(role)
      );

      if (hasRequiredRole) {
        return next();
      }

      // Verify ownership (assuming the :id param is the accountId or personId)
      const resourceId = req.params.id;
      if (resourceId === req.user.id || resourceId === req.user.personId) {
        return next();
      }

      throw new AccessDeniedError(
        'resource',
        'access',
        'You are not the owner of the resource nor do you have the necessary roles'
      );
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check specific permissions
 *
 * param {string} permission - The required permission
 * returns {Function} - Express middleware function
 * throws {AccessDeniedError} - If the user lacks the required permission
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthError(
          'Authentication required',
          CODE.UNAUTHORIZED,
          'AUTH_REQUIRED'
        );
      }

      const userPermissions = Array.isArray(req.user.permissions)
        ? req.user.permissions
        : req.user.permissions
        ? [req.user.permissions]
        : [];

      if (!userPermissions.includes(permission)) {
        throw new AccessDeniedError(
          'resource',
          'access',
          `Permission required: ${permission}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
