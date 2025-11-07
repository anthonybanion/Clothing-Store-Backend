// ==========================================
// Description: Order application logic service
// File: orderService.js
// ==========================================

import Order from '../models/orderModel.js';
import { NotFoundError, ValidationError } from '../errors/businessError.js';
import { validateEntityExists } from '../utils/validationUtils.js';

export class OrderService {
  /**
   * Get order by ID with optional ownership validation
   */
  static async getOne(id, accountId = null) {
    const order = await Order.findById(id)
      .populate('account', 'username email')
      .exec();

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    // Validate ownership if accountId is provided
    if (accountId && order.account._id.toString() !== accountId) {
      throw new NotFoundError('Order', id);
    }

    return order;
  }

  /**
   * Get all orders with optional account filtering
   */
  static async getAll(accountId = null, options = {}) {
    const filter = accountId ? { account: accountId } : {};

    // Add additional filters if provided
    if (options.status) filter.status = options.status;
    if (options.dateFrom) filter.createdAt = { $gte: options.dateFrom };
    if (options.dateTo) {
      filter.createdAt = { ...filter.createdAt, $lte: options.dateTo };
    }

    const query = Order.find(filter)
      .populate('account', 'username email')
      .sort({ createdAt: -1 });

    // Add pagination if provided
    if (options.page && options.limit) {
      const skip = (options.page - 1) * options.limit;
      query.skip(skip).limit(options.limit);
    }

    return await query.exec();
  }

  /**
   * Get orders by account ID
   */
  static async getByAccount(accountId, options = {}) {
    return this.getAll(accountId, options);
  }

  /**
   * Create a new order
   */
  static async create(orderData) {
    // Auto-generate order number if not provided
    if (!orderData.order_number) {
      orderData.order_number = await this.generateOrderNumber();
    }

    // Validate required fields
    this.validateOrderData(orderData);

    const order = new Order(orderData);
    return await order.save();
  }

  /**
   * Update an order completely
   */
  static async update(id, updateData, accountId = null) {
    await this.validateOrderExistsAndOwned(id, accountId);

    this.validateOrderData(updateData, true);

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('account', 'username email');

    return order;
  }

  /**
   * Update an order partially
   */
  static async updatePartial(id, updateData, accountId = null) {
    await this.validateOrderExistsAndOwned(id, accountId);

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('account', 'username email');

    return order;
  }

  /**
   * Update order status
   */
  static async updateStatus(id, status) {
    const allowedStatuses = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      throw new ValidationError(
        'Order',
        `Status must be one of: ${allowedStatuses.join(', ')}`
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('account', 'username email');

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    return order;
  }

  /**
   * Delete an order
   */
  static async delete(id, accountId = null) {
    await this.validateOrderExistsAndOwned(id, accountId);

    const order = await Order.findByIdAndDelete(id);
    return order;
  }

  /**
   * Generate unique order number
   */
  static async generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  // ============ PRIVATE METHODS ============

  /**
   * Validate order exists and is owned by account (if provided)
   */
  static async validateOrderExistsAndOwned(id, accountId = null) {
    const order = await Order.findById(id);

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    if (accountId && order.account.toString() !== accountId) {
      throw new NotFoundError('Order', id);
    }

    return order;
  }

  /**
   * Validate order data
   */
  static validateOrderData(orderData, isUpdate = false) {
    const requiredFields = ['account', 'items', 'total_amount'];

    if (!isUpdate) {
      const missingFields = requiredFields.filter((field) => !orderData[field]);
      if (missingFields.length > 0) {
        throw new ValidationError(
          'Order',
          `Missing required fields: ${missingFields.join(', ')}`
        );
      }
    }

    // Validate items array
    if (
      orderData.items &&
      (!Array.isArray(orderData.items) || orderData.items.length === 0)
    ) {
      throw new ValidationError('Order', 'Items must be a non-empty array');
    }

    // Validate total amount
    if (orderData.total_amount && orderData.total_amount < 0) {
      throw new ValidationError('Order', 'Total amount must be positive');
    }
  }
}

export default OrderService;
