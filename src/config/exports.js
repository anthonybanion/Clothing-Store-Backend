// ==========================================
//
// Description: Centralized exports for configuration modules
//
// File: exports.js
// Author: Anthony Bañon
// Created: 2025-10-28
// Last Updated: 2025-10-28
// ==========================================

// Cors configuration
export { corsMiddleware, corsErrorHandler } from './cors.js';
// Database configuration and connection
export { dbConfig, connectDatabase } from './database.js';
// Authentication configuration
export { authConfig } from './auth.js';
// Server configuration
export { getServerConfig } from './serverConfig.js';
// Environment variable validation and configuration
export { validateEnvironment } from './environment.js';
// Export constants
export { ROLE, CODE, PAGINATION, LIMIT } from './constants.js';
