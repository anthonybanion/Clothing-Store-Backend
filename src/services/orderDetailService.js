// ==========================================
// Description: OrderDetail application logic service
// File: orderDetailService.js
// ==========================================

import OrderDetail from '../models/orderDetailModel.js';
import { NotFoundError, ValidationError } from '../errors/businessError.js';
import { validateEntityExists } from '../utils/validationUtils.js';

export class OrderDetailService {
  /**
   * Get order detail by ID
   */
  static async getOne(id) {
    const orderDetail = await OrderDetail.findById(id)
      .populate('order', 'order_number status total_amount')
      .populate('product', 'name sku price images')
      .exec();

    if (!orderDetail) {
      throw new NotFoundError('OrderDetail', id);
    }

    return orderDetail;
  }

  /**
   * Get all order details with optional filtering
   */
  static async getAll(filters = {}) {
    const { orderId, productId, minQuantity, maxQuantity, page, limit } =
      filters;

    const filter = {};

    if (orderId) filter.order = orderId;
    if (productId) filter.product = productId;
    if (minQuantity || maxQuantity) {
      filter.quantity = {};
      if (minQuantity) filter.quantity.$gte = minQuantity;
      if (maxQuantity) filter.quantity.$lte = maxQuantity;
    }

    const query = OrderDetail.find(filter)
      .populate('order', 'order_number status')
      .populate('product', 'name sku price')
      .sort({ createdAt: -1 });

    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    return await query.exec();
  }

  /**
   * Get order details by order ID
   */
  static async getByOrder(orderId, options = {}) {
    await validateEntityExists(OrderDetail, orderId, 'Order');

    const query = OrderDetail.find({ order: orderId })
      .populate('product', 'name sku price images category')
      .sort({ createdAt: 1 });

    if (options.page && options.limit) {
      const skip = (options.page - 1) * options.limit;
      query.skip(skip).limit(options.limit);
    }

    return await query.exec();
  }

  /**
   * Get order details by product ID
   */
  static async getByProduct(productId, options = {}) {
    await validateEntityExists(OrderDetail, productId, 'Product');

    const query = OrderDetail.find({ product: productId })
      .populate('order', 'order_number status date')
      .sort({ createdAt: -1 });

    if (options.page && options.limit) {
      const skip = (options.page - 1) * options.limit;
      query.skip(skip).limit(options.limit);
    }

    return await query.exec();
  }

  /**
   * Create a new order detail
   */
  static async create(orderDetailData) {
    this.validateOrderDetailData(orderDetailData);

    // Check if order-product combination already exists
    const existingDetail = await OrderDetail.findOne({
      order: orderDetailData.order,
      product: orderDetailData.product,
    });

    if (existingDetail) {
      throw new ValidationError(
        'OrderDetail',
        'Product already exists in this order'
      );
    }

    const orderDetail = new OrderDetail(orderDetailData);
    return await orderDetail.save();
  }

  /**
   * Create multiple order details at once
   */
  static async createMultiple(orderDetailsData) {
    if (!Array.isArray(orderDetailsData) || orderDetailsData.length === 0) {
      throw new ValidationError(
        'OrderDetail',
        'Order details array cannot be empty'
      );
    }

    // Validate each order detail
    for (const detailData of orderDetailsData) {
      this.validateOrderDetailData(detailData);
    }

    // Check for duplicates in the batch
    const orderProductCombinations = new Set();
    for (const detailData of orderDetailsData) {
      const key = `${detailData.order}-${detailData.product}`;
      if (orderProductCombinations.has(key)) {
        throw new ValidationError(
          'OrderDetail',
          'Duplicate product in the same order within the batch'
        );
      }
      orderProductCombinations.add(key);
    }

    // Check for existing order-product combinations in database
    const existingDetails = await OrderDetail.find({
      $or: orderDetailsData.map((detail) => ({
        order: detail.order,
        product: detail.product,
      })),
    });

    if (existingDetails.length > 0) {
      throw new ValidationError(
        'OrderDetail',
        'Some products already exist in their respective orders'
      );
    }

    return await OrderDetail.insertMany(orderDetailsData);
  }

  /**
   * Update an order detail
   */
  static async update(id, updateData) {
    this.validateOrderDetailData(updateData, true);

    const orderDetail = await OrderDetail.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('order', 'order_number status')
      .populate('product', 'name sku price');

    if (!orderDetail) {
      throw new NotFoundError('OrderDetail', id);
    }

    return orderDetail;
  }

  /**
   * Update order detail quantity
   */
  static async updateQuantity(id, quantity) {
    if (quantity <= 0) {
      throw new ValidationError(
        'OrderDetail',
        'Quantity must be greater than 0'
      );
    }

    const orderDetail = await OrderDetail.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    )
      .populate('order', 'order_number status')
      .populate('product', 'name sku price');

    if (!orderDetail) {
      throw new NotFoundError('OrderDetail', id);
    }

    return orderDetail;
  }

  /**
   * Delete an order detail
   */
  static async delete(id) {
    const orderDetail = await OrderDetail.findByIdAndDelete(id);

    if (!orderDetail) {
      throw new NotFoundError('OrderDetail', id);
    }

    return orderDetail;
  }

  /**
   * Delete all order details for an order
   */
  static async deleteByOrder(orderId) {
    const result = await OrderDetail.deleteMany({ order: orderId });
    return result;
  }

  /**
   * Calculate total for an order detail
   */
  static calculateLineTotal(orderDetail) {
    return orderDetail.quantity * orderDetail.historical_price;
  }

  /**
   * Calculate totals for multiple order details
   */
  static calculateOrderTotals(orderDetails) {
    const subtotal = orderDetails.reduce((total, detail) => {
      return total + detail.quantity * detail.historical_price;
    }, 0);

    return {
      subtotal,
      itemCount: orderDetails.length,
      totalQuantity: orderDetails.reduce(
        (total, detail) => total + detail.quantity,
        0
      ),
    };
  }

  // ============ PRIVATE METHODS ============

  /**
   * Validate order detail data
   */
  static validateOrderDetailData(orderDetailData, isUpdate = false) {
    const requiredFields = ['quantity', 'historical_price', 'order', 'product'];

    if (!isUpdate) {
      const missingFields = requiredFields.filter(
        (field) => !orderDetailData[field]
      );
      if (missingFields.length > 0) {
        throw new ValidationError(
          'OrderDetail',
          `Missing required fields: ${missingFields.join(', ')}`
        );
      }
    }

    // Validate quantity
    if (orderDetailData.quantity !== undefined) {
      if (orderDetailData.quantity <= 0) {
        throw new ValidationError(
          'OrderDetail',
          'Quantity must be greater than 0'
        );
      }
      if (!Number.isInteger(orderDetailData.quantity)) {
        throw new ValidationError('OrderDetail', 'Quantity must be an integer');
      }
    }

    // Validate historical price
    if (orderDetailData.historical_price !== undefined) {
      if (orderDetailData.historical_price < 0) {
        throw new ValidationError(
          'OrderDetail',
          'Historical price cannot be negative'
        );
      }
    }
  }
}

export default OrderDetailService;
