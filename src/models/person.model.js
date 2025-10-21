// ==========================================
//
// Description: Represents a person entity in the system.
//
// File: person.model.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String, // URL to the photo
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Person', personSchema);
