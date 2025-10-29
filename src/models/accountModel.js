// ==========================================
//
// Description: Represents a user account linked to a person, used for authentication.
//
// File: account.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes:Delete detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    // Unique username
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      comment: 'Unique username',
    },

    // Password hash
    password: {
      type: String,
      required: true,
      comment: 'Password hash (bcrypt or argon2)',
    },

    // User role
    role: {
      type: String,
      required: true,
      enum: ['client', 'admin'],
      default: 'client',
      comment: 'User role within the system',
    },

    // Account active status
    active: {
      type: Boolean,
      required: true,
      default: true,
      comment: 'Account active status',
    },

    // Reference to Person
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
      unique: true,
      comment: 'Reference to Person (1:1 relationship)',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Account', accountSchema);
