// /validations/authValidation.js
import { body, param } from 'express-validator';

export const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .toLowerCase(),

  body('password').notEmpty().withMessage('Password is required'),
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .isLength({ max: 255 })
    .withMessage('New password cannot exceed 255 characters')
    .custom((value, { req }) => {
      // Validar que nueva contraseña sea diferente a la actual
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),
];

export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token format'),
];

export const validateTokenValidation = [
  body('token').notEmpty().withMessage('Token is required'),
];
