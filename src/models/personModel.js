// ==========================================
//
// Description: Represents a person entity in the system
//
// File: person.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes: Delete detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

const personSchema = new mongoose.Schema(
  {
    // First name
    first_name: {
      type: String,
      required: true,
      trim: true,
      comment: 'User first name',
    },

    // Last name
    last_name: {
      type: String,
      required: true,
      trim: true,
      comment: 'User last name',
    },

    // National ID (optional, unique)
    dni: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
      comment: 'Optional unique national ID',
    },

    // URL to profile image
    profile_photo: {
      type: String,
      default: null,
      comment: 'URL for user profile photo',
    },

    // Email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      comment: 'Unique email address',
    },

    // Account active status
    is_active: {
      type: Boolean,
      required: true,
      default: true,
      comment: 'Account active status',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Person', personSchema, 'persons');
