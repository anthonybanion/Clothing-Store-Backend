// ==========================================
//
// Description: Winston
//
// File: winston.js
// Author: Anthony Bañon
// Created: 2025-11-28
// Last Updated: 2025-11-28
// ==========================================

import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

// Definition of logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Console format (more readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }), // Time only
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // Extract only essential meta
    const essentialMeta = {};
    if (meta.status) essentialMeta.status = meta.status;
    if (meta.duration) essentialMeta.duration = meta.duration;
    if (meta.ip) essentialMeta.ip = meta.ip.split('::ffff:').pop(); // Clean IP

    return `${timestamp} [${level}]: ${message} ${
      Object.keys(essentialMeta).length ? JSON.stringify(essentialMeta) : ''
    }`;
  })
);

// File format (more detailed)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // Includes stack traces
  winston.format.json()
);

// FIX FOR VERCEL: Use different logger configuration based on environment
let logger;

if (process.env.NODE_ENV === 'production') {
  // PRODUCTION (Vercel): Console only - no file system access
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format: consoleFormat, // Use console format in production
    defaultMeta: { service: 'your-app-name' },
    transports: [
      new winston.transports.Console({
        format: consoleFormat,
        level: 'info', // Show info and above in production
      }),
    ],
    // No exceptionHandlers in production - let Vercel handle exceptions
  });
} else {
  // DEVELOPMENT: Files + console
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format: fileFormat,
    defaultMeta: { service: 'your-app-name' },
    transports: [
      // Error logs (rotating)
      new DailyRotateFile({
        filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
      }),

      // HTTP logs (rotating)
      new DailyRotateFile({
        filename: path.join(process.cwd(), 'logs', 'http-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'http',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
      }),

      // All logs (rotating)
      new DailyRotateFile({
        filename: path.join(process.cwd(), 'logs', 'application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new winston.transports.Console({
        format: consoleFormat,
        level: 'debug', // Show more details in development
      }),
    ],
    exceptionHandlers: [
      new DailyRotateFile({
        filename: path.join(process.cwd(), 'logs', 'exceptions-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
      }),
    ],
  });
}

export default logger;
