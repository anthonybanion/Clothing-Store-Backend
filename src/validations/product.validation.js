// ==========================================
//
// Description: Validation schema for Product entity using Joi.
//
// File: product.validation.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import Joi from 'joi';

export const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(150).required().messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 1 character',
      'string.max': 'Product name cannot exceed 150 characters',
    }),
    description: Joi.string().max(350).optional().messages({
      'string.max': 'Description cannot exceed 350 characters',
    }),
    image: Joi.string().uri().optional().messages({
      'string.uri': 'Image must be a valid URL',
    }),
    price: Joi.number()
      .precision(2) // Allows up to 2 decimals
      .positive()
      .required()
      .messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be greater than 0',
        'any.required': 'Price is required',
      }),
    stock: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative',
    }),
    active: Joi.boolean().optional(),
    category: Joi.string().required().messages({
      'string.empty': 'Category is required',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};
