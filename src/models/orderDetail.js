// ==========================================
//
// Description: Represents the relationship between Orders and Products.
//
// File: orderDetail.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import mongoose from 'mongoose';

const orderDetailSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  historicalPrice: {
    type: Number,
    required: true, // price at the time of purchase
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

export default mongoose.model('OrderDetail', orderDetailSchema);
