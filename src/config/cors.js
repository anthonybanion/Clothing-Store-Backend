import cors from 'cors';
import { CODE } from './constants.js';

/**
 * CORS settings for the application
 * Handles different configurations depending on the environment
 */

// Allowed origins based on environment
const getAllowedOrigins = () => {
  const baseOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5000',
    'http://localhost:5001',
    'https://clothing-store.com',
  ];

  // Filter undefined/null values
  return baseOrigins.filter((origin) => origin);
};

// Development configuration
const developmentConfig = {
  origin: true, // Allow all in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: CODE.NO_CONTENT,
};

// Configuration for production
const productionConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests without origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS Blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: CODE.NO_CONTENT,
};

// Select configuration based on environment
const corsOptions =
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;

export const corsMiddleware = cors(corsOptions);

// CORS error handler
export const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(CODE.FORBIDDEN).json({
      error: 'CORS policy: Origin not allowed',
      message: 'El origen de la solicitud no está permitido',
    });
  }
  next(err);
};

export default corsMiddleware;
