// ==========================================
//
// Description: Entry point for the Express server
//
// File: server.js
// Author: Anthony Bañon
// Created: 2025-10-13
// Last Updated: 2025-10-27
// ==========================================
import env from 'dotenv';
import app from './app.js';
import { connectDatabase, validateEnvironment } from './config/exports.js';

// Load environment variables
env.config();

// Define the port
const PORT = process.env.PORT || 5000;

// Validate environment variables
validateEnvironment();

// Connect to MongoDB Atlas
connectDatabase();

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
