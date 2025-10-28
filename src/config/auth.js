export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: process.env.APP_NAME || 'clothing-store',
  },

  bcrypt: {
    saltRounds: 12,
  },

  cookie: {
    name: 'auth_token',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

export default authConfig;
