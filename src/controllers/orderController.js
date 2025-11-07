// ==========================================
//
// Description: Order application logic controller
//
// File: orderController.js
// Author: [Tu Nombre]
// Created: 2025-11-05
// ==========================================

// ==========================================
// Description: Order application logic controller
// File: orderController.js
// ==========================================

import OrderService from '../services/orderService.js';
import { CODE } from '../config/constants.js';

/**
 * Get one order by ID
 */
export const getOneOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const accountId = req.user?.id; // For ownership validation

    const order = await OrderService.getOne(id, accountId);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders with optional filtering and pagination
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;
    const { status, dateFrom, dateTo, page, limit } = req.query;

    const options = {
      ...(status && { status }),
      ...(dateFrom && { dateFrom: new Date(dateFrom) }),
      ...(dateTo && { dateTo: new Date(dateTo) }),
      ...(page && limit && { page: parseInt(page), limit: parseInt(limit) }),
    };

    const orders = await OrderService.getAll(accountId, options);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: orders,
      count: orders.length,
      ...(options.page &&
        options.limit && {
          pagination: {
            page: options.page,
            limit: options.limit,
            total: orders.length,
          },
        }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get orders for current authenticated user
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const accountId = req.user.id;
    const { page, limit } = req.query;

    const options = {
      ...(page && limit && { page: parseInt(page), limit: parseInt(limit) }),
    };

    const orders = await OrderService.getByAccount(accountId, options);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new order
 */
export const createOneOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      // Set account from authenticated user for non-admin
      account: req.user.role !== 'admin' ? req.user.id : req.body.account,
    };

    const order = await OrderService.create(orderData);

    res.status(CODE.CREATED).json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an order completely
 */
export const updateOneOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;

    const order = await OrderService.update(id, updateData, accountId);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an order partially
 */
export const updatePartialOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;

    const order = await OrderService.updatePartial(id, updateData, accountId);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderService.updateStatus(id, status);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an order
 */
export const deleteOneOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;

    const order = await OrderService.delete(id, accountId);

    res.status(CODE.SUCCESS).json({
      success: true,
      data: order,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
