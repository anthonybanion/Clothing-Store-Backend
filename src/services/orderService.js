// ==========================================
//
// Description: Order business logic service
//
// File: orderService.js
// Author: [Tu Nombre]
// Created: 2025-11-05
// ==========================================

import Order from '../models/orderModel.js';
import {
  NotFoundError,
  InsufficientResourceError,
  ValidationError,
  BusinessRuleError,
} from '../errors/businessError.js';
import {
  validateUniqueness,
  validateRequiredFields,
} from '../utils/validationUtils.js';

class OrderService {
  /**
   * Get one order by ID
   * param {string} id - Order ID
   * param {string} accountId - Optional account ID for ownership validation
   * returns {Promise<Object>} Order document
   * throws {NotFoundError} If order not found
   */
  async getOne(id, accountId = null) {
    const order = await Order.findById(id)
      .populate('account', 'username email')
      .exec();

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    // Validate ownership if accountId is provided
    if (accountId && order.account._id.toString() !== accountId) {
      throw new NotFoundError('Order', id); // Don't reveal existence to unauthorized users
    }

    return order;
  }

  /**
   * Get all orders
   * param {string} accountId - Optional account ID to filter by owner
   * returns {Promise<Array>} List of orders
   */
  async getAll(accountId = null) {
    const filter = accountId ? { account: accountId } : {};
    return await Order.find(filter)
      .populate('account', 'username email')
      .sort({ date: -1 })
      .exec();
  }

  /**
   * Get orders by account ID
   * param {string} accountId - Account ID
   * returns {Promise<Array>} List of orders for the account
   */
  async getByAccount(accountId) {
    return await Order.find({ account: accountId })
      .populate('account', 'username email')
      .sort({ date: -1 })
      .exec();
  }

  /**
   * Create a new order
   * param {Object} data - Order data
   * returns {Promise<Object>} Created order
   * throws {ValidationError} If required fields are missing or invalid
   */
  async create(data) {
    // Validate required fields
    validateRequiredFields(data, ['order_number', 'account'], 'Order');

    // Validate order number uniqueness
    await validateUniqueness(Order, 'order_number', data.order_number, 'Order');

    // Create and save the new order
    const newOrder = new Order(data);
    return await newOrder.save();
  }

  /**
   * Update an order completely
   * param {string} id - Order ID
   * param {Object} data - Order data
   * param {string} accountId - Optional account ID for ownership validation
   * returns {Promise<Object>} Updated order
   * throws {NotFoundError} If order not found
   * throws {ValidationError} If data is invalid
   */
  async update(id, data, accountId = null) {
    const order = await this.getOne(id, accountId);

    // Update fields
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        order[key] = data[key];
      }
    });

    return await order.save();
  }

  /**
   * Update an order partially
   * param {string} id - Order ID
   * param {Object} data - Partial order data
   * param {string} accountId - Optional account ID for ownership validation
   * returns {Promise<Object>} Updated order
   * throws {NotFoundError} If order not found
   */
  async updatePartial(id, data, accountId = null) {
    const order = await this.getOne(id, accountId);

    // Only update provided fields
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        order[key] = data[key];
      }
    });

    return await order.save();
  }

  /**
   * Update order status
   * param {string} id - Order ID
   * param {string} status - New status
   * param {string} accountId - Optional account ID for ownership validation
   * returns {Promise<Object>} Updated order
   * throws {NotFoundError} If order not found
   * throws {ValidationError} If status is invalid
   */
  async updateStatus(id, status, accountId = null) {
    const validStatuses = [
      'pending',
      'paid',
      'shipped',
      'cancelled',
      'delivered',
    ];

    if (!validStatuses.includes(status)) {
      throw new ValidationError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    return await this.updatePartial(id, { status }, accountId);
  }

  /**
   * Delete an order
   * param {string} id - Order ID
   * param {string} accountId - Optional account ID for ownership validation
   * returns {Promise<Object>} Deleted order
   * throws {NotFoundError} If order not found
   */
  async delete(id, accountId = null) {
    const order = await this.getOne(id, accountId);
    await Order.findByIdAndDelete(id);
    return order;
  }

  /**
   * Generate a unique order number
   * returns {string} Unique order number
   */
  async generateOrderNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Validate order ownership
   * param {string} orderId - Order ID
   * param {string} accountId - Account ID
   * returns {Promise<boolean>} True if account owns the order
   */
  async validateOwnership(orderId, accountId) {
    const order = await Order.findById(orderId);
    return order && order.account.toString() === accountId;
  }
}

export default new OrderService();
