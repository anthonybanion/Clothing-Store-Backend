// ==========================================
//
// Description: Represents the relationship between Orders and Products
//
// File: orderDetail.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-26
// Changes: Added detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

const orderDetailSchema = new mongoose.Schema(
  {
    // Quantity of the product in the order
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [1, 'Quantity must be at least 1.'],
      integer: true,
      default: 1,
      comment: 'Quantity of the product in the order. Must be at least 1.',
    },

    // Historical unit price at the time of order
    historical_price: {
      type: Number,
      required: [true, 'Historical price is required.'],
      min: [0.01, 'Historical price must be greater than 0.'],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'Historical price must be greater than 0.',
      },
      comment:
        "Historical unit price at the time of order. Snapshot that does not change if the product's current price changes.",
    },

    // Reference to the parent order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required.'],
      comment: 'Foreign Key. References Orders. The parent order.',
    },

    // Reference to the product being purchased
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required.'],
      comment: 'Foreign Key. References Products. The product being purchased.',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

// Add compound unique index to ensure unique order-product combinations
orderDetailSchema.index({ order: 1, product: 1 }, { unique: true });

export default mongoose.model('OrderDetail', orderDetailSchema);
