// ==========================================
//
// Description: Entry point for the Express server
//
// File: server.js
// Author: Anthony Bañon
// Created: 2025-10-13
// Last Updated: 2025-10-13
// ==========================================

import app from './app.js';
import env from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
env.config();

// Define the port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.URLDB)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
