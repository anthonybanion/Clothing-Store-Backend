// ==========================================
//
// Description: Represents product categories
//
// File: category.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-26
// Changes: Added detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

// Regular expressions (based on DB dictionary)
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,'\-]{2,150}$/;
const IMAGE_URL_REGEX = /^https:\/\/.*$/;

const categorySchema = new mongoose.Schema(
  {
    // Category name
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters long.'],
      maxlength: [150, 'Category name cannot exceed 150 characters.'],
      match: [NAME_REGEX, 'Category name contains invalid characters.'],
      comment:
        'Category name. Allows letters, numbers, spaces, and common punctuation.',
    },

    // URL of category image
    image: {
      type: String,
      match: [IMAGE_URL_REGEX, 'Category image must be a valid HTTPS URL.'],
      default: null,
      comment: 'URL of category image',
    },

    // Category description
    description: {
      type: String,
      trim: true,
      minlength: [2, 'Description must be at least 2 characters long.'],
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
      default: null,
      comment:
        'Category description. Optional but must be 2-2000 characters if provided.',
    },

    // Category active status
    is_active: {
      type: Boolean,
      required: [true, 'Active status is required.'],
      default: true,
      enum: {
        values: [true, false],
        message: 'Active status must be true or false.',
      },
      comment: 'Category active status',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

export default mongoose.model('Category', categorySchema);
