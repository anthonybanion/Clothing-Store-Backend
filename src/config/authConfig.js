// ==========================================
//
// Description:
//
// File: authConfig.js
// Author: Anthony Bañon
// Created: 2025-11-03
// Last Updated: 2025-11-03
// ==========================================

import { LIMIT } from './constants.js';

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    issuer: process.env.APP_NAME || 'clothing-store',
  },

  bcrypt: {
    saltRounds: 12,
  },

  cookie: {
    name: 'auth_token',
    maxAge: LIMIT.ACCOUNT_DELETION,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

export default authConfig;
