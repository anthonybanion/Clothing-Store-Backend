// ==========================================
//
// Description: Represents a customer's order.
//
// File: order.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending',
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', // One account can have many orders
    required: true,
  },
});

export default mongoose.model('Order', orderSchema);
