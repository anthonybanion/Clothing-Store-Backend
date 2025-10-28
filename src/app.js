// ==========================================
//
// Description: Express application setup
//
// File: app.js
// Author: Anthony Bañon
// Created: 2025-10-13
// Last Updated: 2025-10-13
// ==========================================

import express from 'express';
import { corsMiddleware, corsErrorHandler } from './config/exports.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import categoryRoute from './routes/categoryRoute.js';

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

// Routes
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/categories', categoryRoute);

export default app;
