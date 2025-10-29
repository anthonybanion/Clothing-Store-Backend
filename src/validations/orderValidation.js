// ==========================================
//
// Description: Validation rules for Order entity using express-validator
// Complementary validations - ONLY what Mongoose doesn't handle well
//
// File: orderValidator.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes: Added comprehensive validations and reusable chains
// ==========================================

import { body, param } from 'express-validator';

// Regular expressions (SINGLE SOURCE - moved from model)
const ORDER_NUMBER_REGEX = /^[A-Z0-9-_]{4,20}$/;

// Status values (SINGLE SOURCE)
const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'cancelled', 'delivered'];

// Common validation chains (REUSABLE)
const orderNumberValidation = () =>
  body('order_number')
    .notEmpty()
    .withMessage('Order number is required')
    .isLength({ min: 4, max: 20 })
    .withMessage('Order number must be 4-20 characters')
    .matches(ORDER_NUMBER_REGEX)
    .withMessage(
      'Order number can only contain uppercase letters, numbers, hyphen, and underscore'
    )
    .trim()
    .toUpperCase();

const dateValidation = () =>
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Order date cannot be in the future');
      }
      return true;
    });

const statusValidation = () =>
  body('status')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`);

const accountValidation = () =>
  body('account').isMongoId().withMessage('Valid account ID is required');

// Optional versions for partial updates
const optionalOrderNumberValidation = () =>
  body('order_number')
    .optional()
    .isLength({ min: 4, max: 20 })
    .withMessage('Order number must be 4-20 characters')
    .matches(ORDER_NUMBER_REGEX)
    .withMessage('Order number format invalid')
    .trim()
    .toUpperCase();

const optionalStatusValidation = () =>
  body('status')
    .optional()
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`);

const optionalAccountValidation = () =>
  body('account')
    .optional()
    .isMongoId()
    .withMessage('Valid account ID is required');

// Main validation exports
export const createOrderValidation = [
  orderNumberValidation(),
  dateValidation(),
  statusValidation(),
  accountValidation(),
];

export const updateOrderValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  orderNumberValidation(),
  dateValidation(),
  statusValidation(),
  accountValidation(),
];

export const updatePartialOrderValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  optionalOrderNumberValidation(),
  dateValidation(),
  optionalStatusValidation(),
  optionalAccountValidation(),
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error('At least one field must be provided for update');
    }
    return true;
  }),
];

export const orderIdValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
];

export const updateOrderStatusValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status')
    .notEmpty()
    .withMessage('Status field is required')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
];

// Special validation for order date range filtering
export const orderDateRangeValidation = [
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format'),

  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be in ISO 8601 format')
    .custom((value, { req }) => {
      if (
        req.body.start_date &&
        new Date(value) < new Date(req.body.start_date)
      ) {
        throw new Error('End date cannot be before start date');
      }
      return true;
    }),
];

// Special validation for bulk status update
export const bulkOrderStatusValidation = [
  body('order_ids')
    .isArray({ min: 1 })
    .withMessage('Order IDs must be a non-empty array'),

  body('order_ids.*').isMongoId().withMessage('Each order ID must be valid'),

  body('status')
    .notEmpty()
    .withMessage('Status field is required')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
];
