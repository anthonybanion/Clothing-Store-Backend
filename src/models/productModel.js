// ==========================================
//
// Description: Represents products available for purchase
//
// File: product.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-26
// Changes: Added detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

// Regular expressions (based on DB dictionary)
const SKU_REGEX = /^[A-Z0-9-]{3,20}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,'\-]{2,150}$/;
const IMAGE_URL_REGEX = /^https:\/\/.*$/;

const productSchema = new mongoose.Schema(
  {
    // Unique stock keeping unit
    sku: {
      type: String,
      required: [true, 'SKU is required.'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'SKU must be at least 3 characters long.'],
      maxlength: [20, 'SKU cannot exceed 20 characters.'],
      match: [
        SKU_REGEX,
        'SKU can only contain uppercase letters, numbers, and hyphen.',
      ],
      comment:
        'Unique stock keeping unit. Internal product identifier. TEC-IPH14-128-BK. Means: Technology - iPhone 14 - 128GB – Black',
    },

    // Product name
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long.'],
      maxlength: [150, 'Product name cannot exceed 150 characters.'],
      match: [NAME_REGEX, 'Product name contains invalid characters.'],
      comment:
        'Product name. Allows letters, numbers, spaces, and common punctuation.',
    },

    // URL of product image
    image: {
      type: String,
      match: [IMAGE_URL_REGEX, 'Product image must be a valid HTTPS URL.'],
      default: null,
      comment: 'URL of product image',
    },

    // Product description
    description: {
      type: String,
      trim: true,
      minlength: [2, 'Description must be at least 2 characters long.'],
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
      default: null,
      comment:
        'Product description. Optional but must be 2-2000 characters if provided.',
    },

    // Current price
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0.01, 'Price must be greater than 0.'],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'Price must be greater than 0.',
      },
      comment: "The product's current price",
    },

    // Available quantity
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required.'],
      min: [0, 'Stock cannot be negative.'],
      integer: true,
      default: 0,
      comment: 'Available quantity. 0 when out of stock.',
    },

    // Product active status
    is_active: {
      type: Boolean,
      required: [true, 'Active status is required.'],
      default: true,
      enum: {
        values: [true, false],
        message: 'Active status must be true or false.',
      },
      comment: 'Product active status',
    },

    // Reference to category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required.'],
      comment: 'Foreign Key. References Categories. Product category.',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

export default mongoose.model('Product', productSchema);
