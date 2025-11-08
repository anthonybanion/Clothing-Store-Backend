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
  winston.format.timestamp({ format: 'HH:mm:ss' }), // Solo hora
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // Extraer solo lo esencial de meta
    const essentialMeta = {};
    if (meta.status) essentialMeta.status = meta.status;
    if (meta.duration) essentialMeta.duration = meta.duration;
    if (meta.ip) essentialMeta.ip = meta.ip.split('::ffff:').pop(); // Limpiar IP

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

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: fileFormat,
  defaultMeta: { service: 'your-app-name' }, // Identifies your app
  transports: [
    // Error logs (rotating)
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d', // Only 7 days of error logs
    }),

    // HTTP logs (rotating)
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'http-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d', // Only 7 days of HTTP logs
    }),

    // All logs (rotating)
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],

  // Uncaught exception handling
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

// Console only in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug', // Show more details in development
    })
  );
} else {
  // In production, console only for errors
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'error',
    })
  );
}

export default logger;
