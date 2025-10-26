// ==========================================
//
// Description: Represents a user account linked to a person, used for authentication.
//
// File: account.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-26
// Changes: Added detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

// Regular expressions (based on DB dictionary)
const USERNAME_REGEX = /^[a-zA-Z0-9._]{2,30}$/;

const accountSchema = new mongoose.Schema(
  {
    // Unique username (stored lowercase)
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [2, 'Username must be at least 2 characters long.'],
      maxlength: [30, 'Username cannot exceed 30 characters.'],
      match: [
        USERNAME_REGEX,
        'Username may only contain letters, numbers, dots, and underscores.',
      ],
      comment: 'Unique username. Stored in lowercase.',
    },

    // Password hash (bcrypt or argon2)
    password: {
      type: String,
      required: [true, 'Password hash is required.'],
      maxlength: [255, 'Password hash cannot exceed 255 characters.'],
      comment:
        'Stores only the password hash (bcrypt or argon2). Validation handled in application logic.',
    },

    // User role (ENUM: client, admin)
    role: {
      type: String,
      required: [true, 'User role is required.'],
      enum: {
        values: ['client', 'admin'],
        message: 'Role must be either "client" or "admin".',
      },
      default: 'client',
      comment: 'User role within the system.',
    },

    // Account active status
    active: {
      type: Boolean,
      required: [true, 'Account active status is required.'],
      default: true,
      enum: {
        values: [true, false],
        message: 'Active status must be true or false.',
      },
      comment: 'Indicates if the account is active.',
    },

    // Foreign key (1:1 relationship) with Person
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: [true, 'Person reference is required.'],
      unique: true,
      comment:
        'Foreign Key (1:1). References Persons(person_id). Each account is linked to exactly one person.',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

export default mongoose.model('Account', accountSchema);
