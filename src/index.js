// ==========================================
//
// Description: Entry point for the Express server
//
// File: server.js
// Author: Anthony Bañon
// Created: 2025-10-13
// Last Updated: 2025-10-27
// ==========================================

import express from 'express';
import env from 'dotenv';
import { corsMiddleware, corsErrorHandler } from './config/exports.js';
import apiRouter from './routes/api.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { swaggerSpec, swaggerUi } from './swagger/swaggerConfig.js';
import { requestLogger, errorLogger } from './middlewares/loggerMiddleware.js';
import { connectDatabase, validateEnvironment } from './config/exports.js';

// Load environment variables
env.config();

// Validate environment variables
validateEnvironment();

// Connect to MongoDB Atlas
connectDatabase();

// Define the port
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AGREGAR ESTO PARA DEBUGGEAR:
console.log('__dirname:', __dirname);
console.log('Static path:', path.join(__dirname, 'uploads'));

const app = express();

// Middleware to log requests
app.use(requestLogger);

// CORS Middleware
app.use(corsMiddleware);
app.use(corsErrorHandler);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static files serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Vercel health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: '✅ Backend funcionando en Vercel',
    timestamp: new Date().toISOString(),
    status: 'active',
  });
});

// All API routes
app.use('/api', apiRouter);

// Error Logging Middleware
app.use(errorLogger);

// Global Error Handling Middleware
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
