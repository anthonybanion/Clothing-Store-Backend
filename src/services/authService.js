// /services/authService.js
import Account from '../models/accountModel.js';
import JWTUtils from '../utils/jwtUtils.js';
import {
  ValidationError,
  NotFoundError,
  InvalidCredentialsError,
  InvalidTokenError,
  TokenExpiredError,
} from '../errors/businessError.js';
import bcrypt from 'bcrypt';
import authConfig from '../config/authConfig.js';

class AuthService {
  /**
   * Login user and generate JWT token
   * param {string} username - The username
   * param {string} password - The password
   * returns {Object} - Object containing token and user data
   * throws {InvalidCredentialsError} - If username or password is incorrect
   * throws {ValidationError} - If required fields are missing
   */
  async login(username, password) {
    // Validate required fields
    if (!username?.trim() || !password?.trim()) {
      throw new ValidationError('Auth', 'Username and password are required');
    }

    // Find active account with person population
    const account = await Account.findOne({
      username: username.toLowerCase().trim(),
      is_active: true,
    }).populate('person');

    if (!account) {
      throw new InvalidCredentialsError();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate token payload
    const tokenPayload = {
      id: account._id.toString(),
      username: account.username,
      role: account.role,
      personId: account.person._id.toString(),
    };

    // Generate JWT token
    const accessToken = JWTUtils.generateAccessToken(tokenPayload); // '15m' from .env
    const refreshToken = JWTUtils.generateRefreshToken(tokenPayload); // '7d' from .env

    const refreshTokenDecoded = JWTUtils.decodeToken(refreshToken);
    const refreshTokenExpires = new Date(refreshTokenDecoded.exp * 1000); // Convertir timestamp a Date

    // SAVE REFRESH TOKEN IN DATABASE
    account.refreshToken = refreshToken;
    account.refreshTokenExpires = refreshTokenExpires;
    await account.save();

    // Return information (without password)
    return {
      accessToken,
      refreshToken,
      account,
    };
  }

  /**
   * Validate JWT token and return user data
   *
   * param {string} token - JWT token to validate
   * returns {Object} - User data from token
   * throws {InvalidTokenError} - If token is invalid
   * throws {TokenExpiredError} - If token has expired
   * throws {NotFoundError} - If account not found
   */
  async validateToken(token) {
    // Verify token and get decoded payload
    const decoded = JWTUtils.verifyToken(token);

    // Verify that the account still exists and is active
    const account = await Account.findOne({
      _id: decoded.id,
      is_active: true,
    }).populate('person');

    if (!account) {
      throw new NotFoundError('Account', decoded.id);
    }

    // Return updated user data
    return account;
  }

  /**
   * Change user password
   *
   * param {string} accountId - Account ID
   * param {string} currentPassword - Current password
   * param {string} newPassword - New password
   */
  async changePassword(accountId, currentPassword, newPassword) {
    const account = await Account.findById(accountId).populate('person');

    if (!account) {
      throw new NotFoundError('Account', accountId);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      account.password
    );
    if (!isCurrentPasswordValid) {
      throw new ValidationError('Auth', 'Incorrect current password', {
        field: 'currentPassword',
        reason: 'incorrect_password',
      });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      throw new ValidationError(
        'Auth',
        'Password must be at least 6 characters',
        {
          field: 'newPassword',
          minLength: 6,
          actualLength: newPassword?.length || 0,
        }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      authConfig.bcrypt.saltRounds
    );
    account.password = hashedPassword;

    await account.save();

    return account;
  }

  /**
   * Get current user profile
   *
   * param {string} accountId - Account ID
   * returns {Object} - User profile data
   * throws {NotFoundError} - If account not found
   */
  async getProfile(id) {
    // Find account with person population
    const account = await Account.findById(id)
      .populate('person')
      .select('-password');

    if (!account) {
      throw new NotFoundError('Account', id);
    }

    return account;
  }

  /**
   * Refresh JWT token using refresh token
   * param {string} refreshToken - Refresh token
   * returns {Object} - New access token and user data
   * throws {InvalidTokenError} - If refresh token is invalid
   * throws {TokenExpiredError} - If refresh token has expired
   * throws {NotFoundError} - If account not found
   */
  async refreshToken(refreshToken) {
    // Check if the refresh token is valid JWT
    const decoded = JWTUtils.verifyToken(refreshToken);

    // Find the account with THIS specific refresh token and that has not expired
    const account = await Account.findOne({
      _id: decoded.id,
      refreshToken: refreshToken, //MUST match exactly
      refreshTokenExpires: { $gt: new Date() }, //That has not expired in BD
      is_active: true,
    }).populate('person');

    if (!account) {
      throw new InvalidTokenError('Refresh token invalid or expired');
    }

    // Generate NEW access token (ONLY access token, not new refresh token)
    const tokenPayload = {
      id: account._id.toString(),
      username: account.username,
      role: account.role,
      personId: account.person._id.toString(),
    };

    const newAccessToken = JWTUtils.generateAccessToken(tokenPayload);

    return {
      userData: account,
      accessToken: newAccessToken, //New access token only
    };
  }

  /**
   * Logout user - invalidate refresh token
   * param {string} userId - User ID
   * returns {Promise<Object>} - Updated account
   */
  async logout(userId) {
    // Find account and validate it exists
    const account = await Account.findById(userId);
    if (!account) {
      throw new NotFoundError('Account', userId);
    }

    // Invalidate refresh token by clearing it from the database
    account.refreshToken = null;
    account.refreshTokenExpires = null;

    // Save the changes
    await account.save();

    return account;
  }
}

export default new AuthService();
