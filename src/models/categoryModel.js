// ==========================================
// Description: Category model - DATA LAYER ONLY
// File: category.model.js
// ==========================================

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    // Category name
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      comment: 'Category name',
    },

    // URL of category image
    image: {
      type: String,
      default: null,
      comment: 'URL of category image',
    },

    // Category description
    description: {
      type: String,
      trim: true,
      default: null,
      comment: 'Category description',
    },

    // Category active status
    is_active: {
      type: Boolean,
      required: true,
      default: true,
      comment: 'Category active status',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Category', categorySchema);
