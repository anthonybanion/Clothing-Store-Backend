// ==========================================
//
// Description: User account linked to a person, used for authentication.
//
// File: account.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
  },
  active: {
    type: Boolean,
    default: true,
  },
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person', // One-to-one relation with Person
    required: true,
    unique: true, // Ensure one-to-one relationship
  },
});

export default mongoose.model('Account', accountSchema);
