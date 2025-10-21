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
env.config();

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
