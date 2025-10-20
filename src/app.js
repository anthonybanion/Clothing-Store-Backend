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
import userRoutes from './routes/users.route.js';
import productRoutes from './routes/products.router.js';

const app = express();

// Middleware to log request details
app.use((req, res, next) => {
  console.log(
    `Data received  at: ${new Date().toISOString()} | Method: ${
      req.method
    } | URL: ${req.url}`
  );
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

export default app;
