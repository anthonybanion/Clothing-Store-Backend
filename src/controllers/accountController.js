// ==========================================
//
// Description: Account Controller
//
// File: accountController.js
// Author: Anthony Bañon
// Created: 2025-11-04
// Last Updated: 2025-11-04
// ==========================================

import accountService from '../services/accountService.js';
import { CODE } from '../config/constants.js';

/**
 * Get one account by ID
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const getOneAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.getOne(id);

    res.status(CODE.SUCCESS).json({
      message: 'Account retrieved successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
        person: account.person,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all active accounts
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await accountService.getAll();

    res.status(CODE.SUCCESS).json({
      message: 'Accounts retrieved successfully',
      data: accounts.map((account) => ({
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
        person: account.person,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new account
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const createAccount = async (req, res, next) => {
  try {
    const accountData = req.body;
    const account = await accountService.create(accountData);

    res.status(CODE.CREATED).json({
      message: 'Account created successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
        person: account.person,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update account (full update)
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const updateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const accountData = req.body;
    const account = await accountService.update(id, accountData);

    res.status(CODE.SUCCESS).json({
      message: 'Account updated successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
        person: account.person,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update account username
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const updateAccountUsername = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const account = await accountService.updateUsername(id, username);

    res.status(CODE.SUCCESS).json({
      message: 'Username updated successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
        person: account.person,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update account role (admin only)
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const updateAccountRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const account = await accountService.updateRole(id, role);

    res.status(CODE.SUCCESS).json({
      message: 'Role updated successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
        person: account.person,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset account password (admin)
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const resetAccountPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const account = await accountService.resetPassword(id, newPassword);

    res.status(CODE.SUCCESS).json({
      message: 'Account password reset successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update account status
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const updateAccountStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const account = await accountService.updateStatus(id, is_active);

    res.status(CODE.SUCCESS).json({
      message: `Account ${
        is_active ? 'activated' : 'deactivated'
      } successfully`,
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Force logout (invalidate tokens)
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const forceLogout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.forceLogout(id);

    res.status(CODE.SUCCESS).json({
      message: 'Force logout completed successfully',
      data: {
        id: account._id,
        username: account.username,
        role: account.role,
        is_active: account.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete account
 * param {Object} req - Express request object
 * param {Object} res - Express response object
 * param {Function} next - Express next middleware function
 */
export const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    await accountService.delete(id);

    res.status(CODE.NO_CONTENT).json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
