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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AGREGAR ESTO PARA DEBUGGEAR:
console.log('__dirname:', __dirname);
console.log('Static path:', path.join(__dirname, 'uploads'));

const app = express();

// CORS Middleware
app.use(corsMiddleware);
app.use(corsErrorHandler);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log request details
app.use((req, res, next) => {
  console.log(
    `Data received at: ${new Date().toISOString()} | Method: ${
      req.method
    } | URL: ${req.url}`
  );
  next();
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static files serving
app.use('/static', express.static(path.join(process.cwd(), 'uploads')));

// All API routes
app.use('/api', apiRouter);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
