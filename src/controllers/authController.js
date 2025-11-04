// ==========================================
//
// Description: Auth Controller
//
// File: authController.js
// Author: Anthony Bañon
// Created: 2025-11-04
// Last Updated: 2025-11-04
// ==========================================

import AuthService from '../services/authService.js';
import { CODE } from '../config/constants.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const { token, account } = await AuthService.login(username, password);

    res.status(CODE.SUCCESS).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: account._id,
          username: account.username,
          role: account.role,
          is_active: account.is_active,
          person: {
            id: account.person._id,
            name: account.person.name,
            email: account.person.email,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* Validate JWT token and return user data
 *
 *params {Object} req - Express request object
 *params {Object} res - Express response object
 *params {Function} next - Express next middleware function
 */
export const validateToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    const userData = await AuthService.validateToken(token);

    res.status(CODE.SUCCESS).json({
      success: true,
      message: 'Token is valid',
      data: {
        id: userData._id.toString(),
        username: userData.username,
        role: userData.role,
        personId: userData.person._id.toString(),
        person: userData.person,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.user; // From authenticated user
    const { currentPassword, newPassword } = req.body;

    const userData = await AuthService.changePassword(
      id,
      currentPassword,
      newPassword
    );

    res.status(CODE.SUCCESS).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        id: userData._id,
        username: userData.username,
        person: userData.person,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { id } = req.user; // From authenticated user

    const account = await AuthService.getProfile(id);
    res.status(CODE.SUCCESS).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
        person: {
          id: account.person._id,
          name: account.person.name,
          email: account.person.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    const { userData, newToken } = await AuthService.refreshToken(token);

    res.status(CODE.SUCCESS).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        user: {
          id: userData._id,
          username: userData.username,
          role: userData.role,
          personId: userData.personId,
          person: userData.person,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
