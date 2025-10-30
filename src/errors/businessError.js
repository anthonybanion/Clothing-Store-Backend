// ==========================================
//
// Description: Generic business error classes for domain-specific errors
//              Reusable across all entities (products, categories, orders, etc.)
//
// File: businessError.js
// Author: Anthony Bañon
// Created: 2025-10-26
// Last Updated: 2025-10-30
// Changes: Initial creation of generic business error classes
// ==========================================

import { baseError } from './baseError.js';
import { CODE } from '../config/constants.js';

/**
 * Not Found Error
 * When searching for an entity that does not exist
 * Usage: new NotFoundError('Product', '12345')
 *       new NotFoundError('Category', 'Electronics')
 */
export class NotFoundError extends baseError {
  constructor(entity, identifier = null) {
    const message = identifier
      ? `${entity} with identifier '${identifier}' not found`
      : `${entity} not found`;

    super(message, CODE.NOT_FOUND, `${entity.toUpperCase()}_NOT_FOUND`, {
      entity,
      identifier,
    });
  }
}

/**
 * Duplicate Error
 * When you try to create/update with a unique value that already exists
 * Usage: new DuplicateError('Product', 'SKU', 'ABC123')
 *        new DuplicateError('Category', 'name', 'Electronics')
 */
export class DuplicateError extends baseError {
  constructor(entity, field, value) {
    super(
      `${entity} with ${field} '${value}' already exists`,
      CODE.CONFLICT,
      `${entity.toUpperCase()}_DUPLICATE_${field.toUpperCase()}`,
      { entity, field, value }
    );
  }
}

/**
 * Validation Error
 * When data does not meet validation rules
 * Usage: new ValidationError('Product', 'Price must be positive')
 *        new ValidationError('User', 'Email format is invalid')
 *        new ValidationError('User', 'Password must be at least 8 characters');
 *        new ValidationError('Order', 'Shipping address is required');
 */
export class ValidationError extends baseError {
  constructor(entity, message, details = null) {
    super(
      `${entity} validation failed: ${message}`,
      CODE.BAD_REQUEST,
      `${entity.toUpperCase()}_VALIDATION_ERROR`,
      { entity, details }
    );
  }
}

/**
 * Invalid Operation Error
 * When the operation is not allowed by the current state
 * Usage: new InvalidOperationError('Product', 'Cannot delete published product')
 *        new InvalidOperationError('Order', 'Order is already shipped')
 *        new InvalidOperationError('User', 'Cannot deactivate admin user');
 */
export class InvalidOperationError extends baseError {
  constructor(entity, operation, details = null) {
    super(
      `Invalid operation on ${entity}: ${operation}`,
      CODE.BAD_REQUEST,
      `${entity.toUpperCase()}_INVALID_OPERATION`,
      { entity, operation, details }
    );
  }
}

/**
 * Insufficient Resources Error
 * When there are not enough resources to complete the operation
 * Usage: new InsufficientResourceError('Product', 'stock', currentStock, requiredStock);
 *        new InsufficientResourceError('Account', 'balance', currentBalance, requiredAmount);
 *        new InsufficientResourceError('Inventory', 'items', currentItems, requiredItems);
 *        new InsufficientResourceError('Warehouse', 'capacity', currentCapacity, requiredSpace);
 */
export class InsufficientResourceError extends baseError {
  constructor(entity, resource, current, required) {
    super(
      `Insufficient ${resource} for ${entity}. Current: ${current}, Required: ${required}`,
      CODE.BAD_REQUEST,
      `${entity.toUpperCase()}_INSUFFICIENT_${resource.toUpperCase()}`,
      { entity, resource, current, required }
    );
  }
}

/**
 * Access Denied Error
 * When the user does not have permissions for the operation
 * Usage: new AccessDeniedError('Product', 'update', 'User lacks edit permissions')
 *        new AccessDeniedError('Order', 'delete', 'User is not an admin')
 *        new AccessDeniedError('Product', 'delete', 'Admin role required');
 *        new AccessDeniedError('Order', 'update', 'Only order owner can modify');
 *
 */
export class AccessDeniedError extends baseError {
  constructor(entity, action, reason = null) {
    const message = reason
      ? `Access denied to ${action} ${entity}: ${reason}`
      : `Access denied to ${action} ${entity}`;

    super(message, CODE.FORBIDDEN, `${entity.toUpperCase()}_ACCESS_DENIED`, {
      entity,
      action,
      reason,
    });
  }
}

//////////////////////////////
// Specific Errors
//////////////////////////////

/**
 * Rate Limit Exceeded Error
 * When the user exceeds allowed request limits
 * Usage: new RateLimitError('Too many requests', 100, '1 hour')
 *       new RateLimitError('API rate limit exceeded', 1000, '1 day')
 *      new RateLimitError('Request limit reached', 500, '30 minutes');
 */
export class RateLimitError extends baseError {
  constructor(message, limit, window) {
    super(
      message || `Rate limit exceeded. ${limit} requests per ${window} allowed`,
      CODE.TOO_MANY_REQUESTS,
      'RATE_LIMIT_EXCEEDED',
      { limit, window }
    );
  }
}

/**
 * Payment Processing Error
 * When there is an error during payment processing
 * Usage: new PaymentError('Payment gateway timeout', 'GATEWAY_TIMEOUT')
 *        new PaymentError('Insufficient funds', 'INSUFFICIENT_FUNDS')
 *        new PaymentError('Invalid payment method', 'INVALID_PAYMENT_METHOD');
 */
export class PaymentError extends baseError {
  constructor(message, paymentCode = null) {
    super(
      message,
      CODE.UNPROCESSABLE_ENTITY,
      paymentCode ? `PAYMENT_${paymentCode}` : 'PAYMENT_ERROR',
      { paymentCode }
    );
  }
}

/**
 * Out of Stock Error
 * When a product or item is out of stock
 * Usage: new OutOfStockError('Product', '12345')
 *        new OutOfStockError('Item', 'SKU-67890')
 */
export class OutOfStockError extends baseError {
  constructor(entity, identifier) {
    super(
      `${entity} with ID '${identifier}' is out of stock`,
      CODE.UNPROCESSABLE_ENTITY,
      `${entity.toUpperCase()}_OUT_OF_STOCK`,
      { entity, identifier }
    );
  }
}

/**
 * Token Expired Error
 * When an authentication token has expired
 * Usage: new TokenExpiredError()
 *       new TokenExpiredError();
 */
export class TokenExpiredError extends baseError {
  constructor() {
    super(
      'Authentication token has expired',
      CODE.UNAUTHORIZED,
      'TOKEN_EXPIRED'
    );
  }
}

/**
 * Invalid Token Error
 * When an authentication token is invalid
 * Usage: new InvalidTokenError()
 *       new InvalidTokenError();
 */
export class InvalidTokenError extends baseError {
  constructor() {
    super('Invalid authentication token', CODE.UNAUTHORIZED, 'INVALID_TOKEN');
  }
}

/**
 * Shipping Validation Error
 * When there is an error related to shipping details
 * Usage: new ShippingError('Invalid shipping address', 'INVALID_ADDRESS')
 *        new ShippingError('Unsupported shipping method', 'UNSUPPORTED_METHOD')
 */
export class ShippingError extends baseError {
  constructor(message, shippingCode = null) {
    super(
      message,
      CODE.UNPROCESSABLE_ENTITY,
      shippingCode ? `SHIPPING_${shippingCode}` : 'SHIPPING_ERROR',
      { shippingCode }
    );
  }
}
