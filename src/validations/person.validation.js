// ==========================================
//
// Description: Validation schema for Person entity using Joi.
//
// File: person.validation.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import Joi from 'joi';

export const validatePerson = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 1 character',
      'string.max': 'Name cannot exceed 50 characters',
    }),
    lastname: Joi.string().min(1).max(50).required().messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
    dni: Joi.string()
      .pattern(/^\d{4}$/)
      .required()
      .messages({
        'string.empty': 'DNI is required',
        'string.pattern.base': 'DNI must be exactly 4 digits',
      }),
    photo: Joi.string().uri().optional().messages({
      'string.uri': 'Photo must be a valid URL',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email',
    }),
    active: Joi.boolean().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};
