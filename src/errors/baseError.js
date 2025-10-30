// ==========================================
// Base application error class
// ==========================================

export class baseError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Marks this as an expected, handled error

    Error.captureStackTrace(this, this.constructor);
  }
}
