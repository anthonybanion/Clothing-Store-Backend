// ==========================================
//
// Description: Represents a customer's order
//
// File: order.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-29
// Changes: Delete detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Unique order identifier
    order_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      comment: 'Unique order identifier',
    },

    // Date when the order was placed
    date: {
      type: Date,
      required: true,
      default: Date.now,
      comment: 'Date when the order was placed',
    },

    // Current state of the order
    status: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
      comment: 'Current state of the order',
    },

    // Reference to the customer account
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      comment: 'Reference to customer account',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Order', orderSchema);
