// ==========================================
//
// Description: Represents products available for purchase.
//
// File: product.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL to product image
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Many-to-one relation
    required: true,
  },
});

export default mongoose.model('Product', productSchema);
