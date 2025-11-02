// ==========================================
//
// Description: Validations
//
// File: validationUtils.js
// Author: Anthony Bañon
// Created: 2025-10-31
// Last Updated: 2025-10-31
// ==========================================

import {
  DuplicateError,
  ValidationError,
  NotFoundError,
  InvalidOperationError,
} from '../errors/businessError.js';

/**
 * Validates uniqueness of a field in a model
 * param {Object} model - Mongoose model
 * param {String} field - Field name to check
 * param {Any} value - Value to check for uniqueness
 * param {String} [excludeId] - ID to exclude from the check (for updates)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {DuplicateError} If a duplicate value is found
 * example
 * // Create: Check if email is unique
 * await validateUniqueness(User, 'email', 'testexample.com', null, 'User');
 * example
 * // Update: Check if email is unique excluding current user
 * await validateUniqueness(User, 'email', 'newexample.com', 'userId123', 'User');
 */
export async function validateUniqueness(
  model,
  field,
  value,
  excludeId = null,
  entityName = null
) {
  // Build query with field value
  const query = { [field]: value };

  // Exclude current document for updates
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  // Check if document already exists
  const existing = await model.findOne(query).exec();
  if (existing) {
    const entity = entityName || model.modelName;
    throw new DuplicateError(entity, field, value);
  }
}

/**
 * Validates that an entity exists by ID
 * param {Object} model - Mongoose model
 * param {String} id - Entity ID
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {NotFoundError} If entity not found
 * example
 * // Validate user exists
 * await validateEntityExists(User, 'userId123', 'User');
 * example
 * // Validate product exists
 * await validateEntityExists(Product, 'productId456', 'Product');
 */
export async function validateEntityExists(model, id, entityName = null) {
  // Find entity by ID
  const entity = await model.findById(id).exec();
  if (!entity) {
    const name = entityName || model.modelName;
    throw new NotFoundError(name, id);
  }
}

/**
 * Validates required fields for any entity
 * param {Object} data - The data object to validate
 * param {Array<String>} requiredFields - List of required field names
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If any required fields are missing
 * example
 * // Validate user creation data
 * validateRequiredFields(userData, ['name', 'email', 'password'], 'User');
 * example
 * // Validate product creation data
 * validateRequiredFields(productData, ['name', 'price', 'category'], 'Product');
 */
export function validateRequiredFields(
  data,
  requiredFields,
  entityName = 'Entity'
) {
  // Filter missing fields (undefined, null, or empty string)
  const missing = requiredFields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  // Throw error if any required fields are missing
  if (missing.length > 0) {
    throw new ValidationError(
      entityName,
      `Missing required fields: ${missing.join(', ')}`
    );
  }
}
