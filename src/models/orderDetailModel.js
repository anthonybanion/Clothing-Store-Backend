// ==========================================
//
// Description: Represents the relationship between Orders and Products
//
// File: orderDetail.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes: Delete detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

const orderDetailSchema = new mongoose.Schema(
  {
    // Quantity of the product in the order
    quantity: {
      type: Number,
      required: true,
      default: 1,
      comment: 'Quantity of the product in the order',
    },

    // Historical unit price at the time of order
    historical_price: {
      type: Number,
      required: true,
      comment: 'Historical unit price at the time of order',
    },

    // Reference to the parent order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      comment: 'Reference to parent order',
    },

    // Reference to the product being purchased
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      comment: 'Reference to product being purchased',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Add compound unique index to ensure unique order-product combinations
orderDetailSchema.index({ order: 1, product: 1 }, { unique: true });

export default mongoose.model('OrderDetail', orderDetailSchema);
