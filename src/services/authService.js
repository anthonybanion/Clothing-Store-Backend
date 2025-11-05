// /services/authService.js
import Account from '../models/Account.js';
import JWTUtils from '../utils/jwtUtils.js';
import {
  ValidationError,
  NotFoundError,
  InvalidCredentialsError,
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
    const token = JWTUtils.generateToken(tokenPayload);

    // Return information (without password)
    return {
      token,
      account, // Returns the full account, the controller decides which fields to use
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
   * Refresh JWT token
   *
   * param {string} oldToken - Old JWT token
   * returns {Object} - New token and user data
   * throws {InvalidTokenError} - If token is invalid
   * throws {TokenExpiredError} - If token has expired
   * throws {NotFoundError} - If account not found
   */
  async refreshToken(oldToken) {
    // Validate old token
    const userData = await this.validateToken(oldToken);

    // Generate new token
    const newToken = JWTUtils.generateToken({
      id: userData.id,
      username: userData.username,
      role: userData.role,
      personId: userData.personId,
    });

    return { userData, newToken };
  }
}

export default new AuthService();
