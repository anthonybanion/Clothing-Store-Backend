// ==========================================
//
// Description: Express application setup
//
// File: app.js
// Author: Anthony Bañon
// Created: 2025-9-13
// Last Updated: 2025-10-28
// Changes: Added CORS middleware, request logging and organized routes
// ==========================================

import express from 'express';
import { corsMiddleware, corsErrorHandler } from './config/exports.js';
import apiRouter from './routes/api.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { swaggerSpec, swaggerUi } from './swagger/swaggerConfig.js';
import { requestLogger, errorLogger } from './middlewares/loggerMiddleware.js';

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

// All API routes
app.use('/api', apiRouter);

// Error Logging Middleware
app.use(errorLogger);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
