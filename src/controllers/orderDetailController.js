// ==========================================
// Description: OrderDetail application logic controller
// File: orderDetailController.js
// ==========================================

import OrderDetailService from '../services/orderDetailService.js';
import { CODE } from '../config/constants.js';

/**
 * Get one order detail by ID
 */
export const getOneOrderDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderDetail = await OrderDetailService.getOne(id);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: orderDetail,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all order details with optional filtering
 */
export const getAllOrderDetails = async (req, res, next) => {
  try {
    const { orderId, productId, minQuantity, maxQuantity, page, limit } =
      req.query;

    const filters = {
      ...(orderId && { orderId }),
      ...(productId && { productId }),
      ...(minQuantity && { minQuantity: parseInt(minQuantity) }),
      ...(maxQuantity && { maxQuantity: parseInt(maxQuantity) }),
      ...(page && limit && { page: parseInt(page), limit: parseInt(limit) }),
    };

    const orderDetails = await OrderDetailService.getAll(filters);

    res.status(CODE.OK).json({
      success: true,
      data: orderDetails,
      count: orderDetails.length,
      ...(filters.page &&
        filters.limit && {
          pagination: {
            page: filters.page,
            limit: filters.limit,
            total: orderDetails.length,
          },
        }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order details by order ID
 */
export const getOrderDetailsByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { page, limit } = req.query;

    const options = {
      ...(page && limit && { page: parseInt(page), limit: parseInt(limit) }),
    };

    const orderDetails = await OrderDetailService.getByOrder(orderId, options);

    // Calculate order totals
    const totals = OrderDetailService.calculateOrderTotals(orderDetails);

    res.status(CODE.OK).json({
      success: true,
      data: orderDetails,
      count: orderDetails.length,
      totals,
      ...(options.page &&
        options.limit && {
          pagination: {
            page: options.page,
            limit: options.limit,
            total: orderDetails.length,
          },
        }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order details by product ID
 */
export const getOrderDetailsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page, limit } = req.query;

    const options = {
      ...(page && limit && { page: parseInt(page), limit: parseInt(limit) }),
    };

    const orderDetails = await OrderDetailService.getByProduct(
      productId,
      options
    );

    res.status(CODE.OK).json({
      success: true,
      data: orderDetails,
      count: orderDetails.length,
      ...(options.page &&
        options.limit && {
          pagination: {
            page: options.page,
            limit: options.limit,
            total: orderDetails.length,
          },
        }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new order detail
 */
export const createOneOrderDetail = async (req, res, next) => {
  try {
    const orderDetailData = req.body;

    const orderDetail = await OrderDetailService.create(orderDetailData);

    res.status(CODE.CREATED).json({
      success: true,
      data: orderDetail,
      message: 'Order detail created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create multiple order details
 */
export const createMultipleOrderDetails = async (req, res, next) => {
  try {
    const { orderDetails } = req.body;

    const createdDetails = await OrderDetailService.createMultiple(
      orderDetails
    );

    res.status(CODE.CREATED).json({
      success: true,
      data: createdDetails,
      count: createdDetails.length,
      message: `${createdDetails.length} order details created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an order detail
 */
export const updateOneOrderDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const orderDetail = await OrderDetailService.update(id, updateData);

    res.status(CODE.OK).json({
      success: true,
      data: orderDetail,
      message: 'Order detail updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order detail quantity
 */
export const updateOrderDetailQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const orderDetail = await OrderDetailService.updateQuantity(id, quantity);

    res.status(CODE.OK).json({
      success: true,
      data: orderDetail,
      message: 'Order detail quantity updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an order detail
 */
export const deleteOneOrderDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderDetail = await OrderDetailService.delete(id);

    res.status(CODE.OK).json({
      success: true,
      data: orderDetail,
      message: 'Order detail deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all order details for an order
 */
export const deleteOrderDetailsByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const result = await OrderDetailService.deleteByOrder(orderId);

    res.status(CODE.OK).json({
      success: true,
      data: result,
      message: `${result.deletedCount} order details deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
