// ==========================================
//
// Description: Represents a customer's order
//
// File: order.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-26
// Changes: Add detailed validation and comments
// ==========================================

import mongoose from 'mongoose';

// Regular expressions (based on DB dictionary)
const ORDER_NUMBER_REGEX = /^[A-Z0-9-_]{4,20}$/;

const orderSchema = new mongoose.Schema(
  {
    // Unique order identifier
    order_number: {
      type: String,
      required: [true, 'Order number is required.'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [4, 'Order number must be at least 4 characters long.'],
      maxlength: [20, 'Order number cannot exceed 20 characters.'],
      match: [
        ORDER_NUMBER_REGEX,
        'Order number can only contain uppercase letters, numbers, hyphen, and underscore.',
      ],
      comment:
        'Unique order identifier. Format: uppercase letters, numbers, hyphen, underscore. (e.g., "ORD-2024-001", "INV-A1B2").',
    },

    // Date when the order was placed
    date: {
      type: Date,
      required: [true, 'Order date is required.'],
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Order date cannot be in the future.',
      },
      comment: 'Date when the order was placed (ISO 8601 format: YYYY-MM-DD).',
    },

    // Current state of the order
    status: {
      type: String,
      required: [true, 'Order status is required.'],
      enum: {
        values: ['pending', 'paid', 'shipped', 'cancelled', 'delivered'],
        message:
          'Status must be one of: pending, paid, shipped, cancelled, delivered.',
      },
      default: 'pending',
      comment: 'Current state of the order in the fulfillment workflow.',
    },

    // Reference to the customer account
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Account reference is required.'],
      comment:
        'Foreign Key. References Account. Identifies the customer who placed the order.',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

export default mongoose.model('Order', orderSchema);
