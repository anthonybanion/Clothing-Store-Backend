// ==========================================
//
// Description: Represents a person entity in the system
//
// File: person.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-26
// Changes: Added detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

// Regular expressions (based on DB dictionary)
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ']{2,50}$/;
const DNI_REGEX = /^[0-9]{8}$/;
const PHOTO_URL_REGEX = /^https:\/\/.*$/;
const EMAIL_REGEX = /^[\w\.-]{1,64}@[\w\.-]+\.\w{2,63}$/;

const personSchema = new mongoose.Schema(
  {
    // First name (atomic, no spaces)
    first_name: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long.'],
      maxlength: [50, 'First name cannot exceed 50 characters.'],
      match: [NAME_REGEX, 'First name contains invalid characters.'],
      comment: 'User first name (no spaces, only letters).',
    },

    // Last name (atomic, no spaces)
    last_name: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long.'],
      maxlength: [50, 'Last name cannot exceed 50 characters.'],
      match: [NAME_REGEX, 'Last name contains invalid characters.'],
      comment: 'User last name (no spaces, only letters).',
    },

    // National ID (optional, unique, 8 numeric characters)
    dni: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls for optional unique field
      minlength: [8, 'DNI must be exactly 8 digits.'],
      maxlength: [8, 'DNI must be exactly 8 digits.'],
      match: [DNI_REGEX, 'DNI must contain only numbers (8 digits).'],
      default: null,
      comment: 'Optional unique national ID (8 digits).',
    },

    // URL to profile image (optional, must start with https)
    profile_photo: {
      type: String,
      match: [PHOTO_URL_REGEX, 'Profile photo must be a valid HTTPS URL.'],
      default: null,
      comment: 'Optional URL for user profile photo.',
    },

    // Email address (unique, required, lowercase)
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [5, 'Email address must be at least 5 characters long.'],
      maxlength: [100, 'Email address cannot exceed 100 characters.'],
      match: [EMAIL_REGEX, 'Invalid email address format.'],
      comment: 'Unique email; stored in lowercase.',
    },

    // Account active status (boolean, default true)
    is_active: {
      type: Boolean,
      required: [true, 'Account active status is required.'],
      default: true,
      enum: {
        values: [true, false],
        message: 'Active status must be true or false.',
      },
      comment: 'Indicates if the account is active.',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

export default mongoose.model('Person', personSchema);
