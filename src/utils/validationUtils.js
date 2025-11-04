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

/**
 * Validates that a value is one of the allowed values
 * param {Any} value - Value to validate
 * param {Array} allowedValues - Array of allowed values
 * param {String} fieldName - Name of the field (for error messages)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If value is not in allowed values
 * example
 * // Validate role
 * validateAllowedValues(role, ['admin', 'user'], 'role', 'User');
 * example
 * // Validate status
 * validateAllowedValues(status, ['active', 'inactive'], 'status', 'Order');
 */
export function validateAllowedValues(
  value,
  allowedValues,
  fieldName,
  entityName = 'Entity'
) {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      entityName,
      `${fieldName} must be one of: ${allowedValues.join(
        ', '
      )}. Received: ${value}`,
      { field: fieldName, value, allowedValues }
    );
  }
}

/**
 * Validates minimum length for string fields
 * param {String} value - Value to validate
 * param {Number} minLength - Minimum required length
 * param {String} fieldName - Name of the field (for error messages)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If value is shorter than minLength
 * example
 * // Validate password length
 * validateMinLength(password, 6, 'password', 'User');
 * example
 * // Validate username length
 * validateMinLength(username, 3, 'username', 'User');
 */
export function validateMinLength(
  value,
  minLength,
  fieldName,
  entityName = 'Entity'
) {
  if (value && value.length < minLength) {
    throw new ValidationError(
      entityName,
      `${fieldName} must be at least ${minLength} characters long. Current: ${value.length}`,
      { field: fieldName, value, minLength, actualLength: value.length }
    );
  }
}

/**
 * Validates maximum length for string fields
 * param {String} value - Value to validate
 * param {Number} maxLength - Maximum allowed length
 * param {String} fieldName - Name of the field (for error messages)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If value is longer than maxLength
 * example
 * // Validate description length
 * validateMaxLength(description, 500, 'description', 'Product');
 */
export function validateMaxLength(
  value,
  maxLength,
  fieldName,
  entityName = 'Entity'
) {
  if (value && value.length > maxLength) {
    throw new ValidationError(
      entityName,
      `${fieldName} must be at most ${maxLength} characters long. Current: ${value.length}`,
      { field: fieldName, value, maxLength, actualLength: value.length }
    );
  }
}

/**
 * Validates numeric range
 * param {Number} value - Value to validate
 * param {Number} min - Minimum value (inclusive)
 * param {Number} max - Maximum value (inclusive)
 * param {String} fieldName - Name of the field (for error messages)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If value is outside the allowed range
 * example
 * // Validate price range
 * validateNumericRange(price, 0, 10000, 'price', 'Product');
 * example
 * // Validate quantity range
 * validateNumericRange(quantity, 1, 100, 'quantity', 'Order');
 */
export function validateNumericRange(
  value,
  min,
  max,
  fieldName,
  entityName = 'Entity'
) {
  if (value < min || value > max) {
    throw new ValidationError(
      entityName,
      `${fieldName} must be between ${min} and ${max}. Received: ${value}`,
      { field: fieldName, value, min, max }
    );
  }
}

/**
 * Validates email format
 * param {String} email - Email to validate
 * param {String} [fieldName='email'] - Name of the field (for error messages)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If email format is invalid
 * example
 * // Validate user email
 * validateEmail(userEmail, 'email', 'User');
 * example
 * // Validate contact email with custom field name
 * validateEmail(contactEmail, 'contact_email', 'Business');
 */
export function validateEmail(
  email,
  fieldName = 'email',
  entityName = 'Entity'
) {
  const emailRegex = /^[^\s]+[^\s]+\.[^\s]+$/;
  if (email && !emailRegex.test(email)) {
    throw new ValidationError(
      entityName,
      `${fieldName} has an invalid format`,
      { field: fieldName, value: email, pattern: 'email' }
    );
  }
}

/**
 * Validates that an array is not empty
 * param {Array} array - Array to validate
 * param {String} fieldName - Name of the field (for error messages)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If array is empty
 * example
 * // Validate categories array
 * validateNonEmptyArray(categories, 'categories', 'Product');
 * example
 * // Validate tags array
 * validateNonEmptyArray(tags, 'tags', 'Article');
 */
export function validateNonEmptyArray(array, fieldName, entityName = 'Entity') {
  if (!Array.isArray(array) || array.length === 0) {
    throw new ValidationError(entityName, `${fieldName} cannot be empty`, {
      field: fieldName,
      value: array,
    });
  }
}

/**
 * Validates that a value is not null or undefined
 * param {Any} value - Value to validate
 * param {String} fieldName - Name of the field (for error messages)
 * param {String} [entityName] - Name of the entity (for error messages)
 * throws {ValidationError} If value is null or undefined
 * example
 * // Validate required reference
 * validateNotNull(personId, 'personId', 'Account');
 */
export function validateNotNull(value, fieldName, entityName = 'Entity') {
  if (value === null || value === undefined) {
    throw new ValidationError(entityName, `${fieldName} is required`, {
      field: fieldName,
      value,
    });
  }
}
