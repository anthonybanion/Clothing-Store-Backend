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

// All API routes
app.use('/api', apiRouter);

export default app;
