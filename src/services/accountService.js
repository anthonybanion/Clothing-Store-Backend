// ==========================================
//
// Description: Account Service
//
// File: accountService.js
// Author: Anthony Bañon
// Created: 2025-11-04
// Last Updated: 2025-11-04
// ==========================================

import Account from '../models/accountModel.js';
import {
  NotFoundError,
  DuplicateError,
  ValidationError,
} from '../errors/businessError.js';
import {
  validateUniqueness,
  validateRequiredFields,
  validateAllowedValues,
  validateMinLength,
  validateMaxLength,
  validateEmail,
} from '../utils/validationUtils.js';
import bcrypt from 'bcrypt';
import authConfig from '../config/authConfig.js';

class AccountService {
  async getOne(id) {
    const account = await Account.findById(id).populate('person').exec();
    if (!account) {
      throw new NotFoundError('Account', id);
    }
    return account;
  }

  async getAll() {
    return await Account.find({ is_active: true }).populate('person').exec();
  }

  /* Create a new account
   *
   * @param {Object} data - The account data
   * @returns {Promise<Account>} - The created account
   * @throws {DuplicateError} - If the username is already taken
   * @throws {ValidationError} - If required fields are missing
   */
  async create(data) {
    validateRequiredFields(data, ['username', 'password', 'person']);
    await validateUniqueness(Account, 'username', data.username);

    // Hash password before saving
    let hashedPassword;
    if (data.password) {
      hashedPassword = await bcrypt.hash(
        data.password,
        authConfig.bcrypt.saltRounds
      );
    }
    // Prepare account data
    const accountData = {
      ...data,
      password: hashedPassword,
    };

    const newAccount = new Account(accountData);
    return await newAccount.save();
  }

  /* Update account details
   *
   * @param {string} id - The ID of the account to update
   * @param {Object} data - The data to update
   * @returns {Promise<Account>} - The updated account
   * @throws {NotFoundError} - If the account is not found
   * @throws {DuplicateError} - If the username is already taken
   */
  async update(id, data) {
    // Fetch existing account
    const account = await this.getOne(id);

    // If username is being updated, check uniqueness
    if (data.username && data.username !== account.username) {
      await validateUniqueness(Account, 'username', data.username, id);
    }

    // Hash password if updating
    if (data.password) {
      data.password = await bcrypt.hash(
        data.password,
        authConfig.bcrypt.saltRounds
      );
      // When changing password, invalidate tokens
      data.refreshToken = null;
      data.refreshTokenExpires = null;
    }

    Object.assign(account, data);
    return await account.save();
  }

  /* Update account username
   *
   * @param {string} id - The ID of the account
   * @param {string} newUsername - The new username
   * @returns {Promise<Account>} - The updated account
   * @throws {NotFoundError} - If the account is not found
   * @throws {DuplicateError} - If the username is already taken
   * @throws {ValidationError} - If the new username is invalid
   */
  async updateUsername(id, newUsername) {
    validateMinLength(newUsername, 3, 'username', 'Account');
    validateMaxLength(newUsername, 50, 'username', 'Account');
    await validateUniqueness(Account, 'username', newUsername, id, 'Account');

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { username: newUsername },
      { new: true }
    )
      .populate('person')
      .exec();

    if (!updatedAccount) {
      throw new NotFoundError('Account', id);
    }

    return updatedAccount;
  }

  async updateRole(id, newRole) {
    // Validar role
    validateAllowedValues(newRole, ['client', 'admin'], 'role', 'Account');
    // Validar que no sea el último admin (si aplica)
    if (newRole !== 'admin') {
      await this.validateNotLastAdmin(id);
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true }
    )
      .populate('person')
      .exec();

    if (!updatedAccount) {
      throw new NotFoundError('Account', id);
    }

    return updatedAccount;
  }

  /* Validate that the account is not the last admin
   *
   *  param {string} accountId - The ID of the account to check
   *  throws {ValidationError} - If the account is the last admin
   */
  async validateNotLastAdmin(accountId) {
    const account = await Account.findById(accountId);
    if (account.role === 'admin') {
      const adminCount = await Account.countDocuments({
        role: 'admin',
        is_active: true,
      });
      if (adminCount <= 1) {
        throw new ValidationError('Account', 'Cannot remove the last admin');
      }
    }
  }

  /* Specific method to reset password by admin
   *
   * @param {string} id - The ID of the account
   * @param {string} newPassword - The new password to set
   * @returns {Promise<Account>} - The updated account
   * @throws {NotFoundError} - If the account is not found
   * @throws {ValidationError} - If the new password is not provided
   */
  async resetPassword(id, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new ValidationError(
        'Account',
        'Password must be at least 6 characters',
        {
          field: 'password',
          minLength: 6,
          actualLength: newPassword?.length || 0,
        }
      );
    }

    const account = await this.getOne(id);

    // Hash the new password
    account.password = await bcrypt.hash(
      newPassword,
      authConfig.bcrypt.saltRounds
    );
    // Invalidate tokens after password change
    account.refreshToken = null;
    account.refreshTokenExpires = null;

    return await account.save();
  }

  /* Update account active status
   *
   * @param {string} id - The ID of the account
   * @param {boolean} is_active - The new active status
   * @returns {Promise<Account>} - The updated account
   * @throws {NotFoundError} - If the account is not found
   */
  async updateStatus(id, is_active = false) {
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { is_active },
      { new: true }
    )
      .populate('person')
      .exec();

    if (!updatedAccount) {
      throw new NotFoundError('Account', id);
    }

    // Invalidate tokens when deactivating account
    if (!is_active) {
      updatedAccount.refreshToken = null;
      updatedAccount.refreshTokenExpires = null;
      await updatedAccount.save();
    }
    return updatedAccount;
  }

  /**
   * Force logout (invalidate tokens)
   * param {string} id - Account ID
   * returns {Promise<Object>} Updated account
   * throws {NotFoundError} If account not found
   */
  async forceLogout(id) {
    const account = await this.getOne(id);
    account.refreshToken = null;
    account.refreshTokenExpires = null;
    return await account.save();
  }

  /* Delete account by ID
   *
   * @param {string} id - The ID of the account to delete
   * @returns {Promise<Account>} - The deleted account
   * @throws {NotFoundError} - If the account is not found
   */
  async delete(id) {
    const deletedAccount = await Account.findByIdAndDelete(id).exec();
    if (!deletedAccount) {
      throw new NotFoundError('Account', id);
    }

    return deletedAccount;
  }
}

export default new AccountService();
