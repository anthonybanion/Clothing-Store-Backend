// ==========================================
//
// Description: Represents products available for purchase
//
// File: product.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes: Added product model with basic validations
// ==========================================

// ==========================================
// Description: Product model - DATA LAYER ONLY
// File: product.model.js
// ==========================================

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Unique stock keeping unit
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      comment: 'Unique stock keeping unit',
    },

    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
      comment: 'Product name',
    },

    // URL of product image
    image: {
      type: String,
      default: null,
      comment: 'URL of product image',
    },

    // Product description
    description: {
      type: String,
      trim: true,
      default: null,
      comment: 'Product description',
    },

    // Current price
    price: {
      type: Number,
      required: true,
      comment: "The product's current price",
    },

    // Available quantity
    stock: {
      type: Number,
      required: true,
      default: 0,
      comment: 'Available quantity',
    },

    // Product active status
    is_active: {
      type: Boolean,
      required: true,
      default: true,
      comment: 'Product active status',
    },

    // Reference to category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      comment: 'Product category reference',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Product', productSchema);
