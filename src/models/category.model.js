// ==========================================
//
// Description: Represents product categories.
//
// File: category.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String, // URL to category image
  },
  description: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Category', categorySchema);
