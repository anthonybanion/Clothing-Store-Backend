// ==========================================
//
// Description: Jason Web Token
//
// File: jwtUtils.js
// Author: Anthony Bañon
// Created: 2025-11-04
// Last Updated: 2025-11-04
// ==========================================

import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig.js';
import {
  InvalidTokenError,
  TokenExpiredError,
} from '../errors/businessError.js';

class JWTUtils {
  /**
   * Generate JWT token
   *
   * param {object} payload - Payload to sign
   * returns {string} - Signed JWT token
   */
  static generateToken(payload) {
    // Get JWT config
    const { secret, expiresIn, issuer } = authConfig.jwt;
    // Sign and return token
    return jwt.sign(payload, secret, {
      expiresIn,
      issuer,
      subject: payload.id?.toString(),
    });
  }

  /**
   * Verify JWT token
   *
   * param {string} token - JWT token
   * returns {object} - Decoded token payload
   * throws {InvalidTokenError} - If token is invalid
   * throws {TokenExpiredError} - If token is expired
   */
  static verifyToken(token) {
    try {
      // Get JWT config
      const { secret, issuer } = authConfig.jwt;
      // Verify and return decoded token
      return jwt.verify(token, secret, { issuer });
    } catch (error) {
      // Handle JWT verification errors
      if (
        // Token expired errors
        error.name === 'TokenExpiredError'
      ) {
        throw new TokenExpiredError();
      } else if (
        // Invalid token errors
        error.name === 'JsonWebTokenError'
      ) {
        throw new InvalidTokenError();
      } else {
        // For other JWT errors
        throw new InvalidTokenError(error.message);
      }
    }
  }

  /**
   * Decode JWT token
   *
   * param {string} token - JWT token
   * returns {object} - Decoded token payload
   */
  static decodeToken(token) {
    try {
      //  Decode and return token payload without verifying
      return jwt.decode(token);
    } catch (error) {
      throw new InvalidTokenError('Failed to decode token');
    }
  }
}

export default JWTUtils;
