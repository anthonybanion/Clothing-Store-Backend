// ==========================================
//
// Description: Order application logic controller
//
// File: orderController.js
// Author: [Tu Nombre]
// Created: 2025-11-05
// ==========================================

import OrderService from '../services/orderService.js';
import { CODE } from '../config/constants.js';

/**
 * Get one order by ID
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const getOneOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const accountId = req.user?.id; // For ownership validation

    const order = await OrderService.getOne(id, accountId);

    res.status(CODE.OK).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;

    const orders = await OrderService.getAll(accountId);

    res.status(CODE.OK).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get orders by current account
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const accountId = req.user.id;

    const orders = await OrderService.getByAccount(accountId);

    res.status(CODE.OK).json({
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
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const createOneOrder = async (req, res, next) => {
  try {
    const orderData = req.body;

    // Auto-generate order number if not provided
    if (!orderData.order_number) {
      orderData.order_number = await OrderService.generateOrderNumber();
    }

    // Set account from authenticated user for non-admin
    if (req.user.role !== 'admin' && !orderData.account) {
      orderData.account = req.user.id;
    }

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
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const updateOneOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;

    const order = await OrderService.update(id, updateData, accountId);

    res.status(CODE.OK).json({
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
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const updatePartialOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;

    const order = await OrderService.updatePartial(id, updateData, accountId);

    res.status(CODE.OK).json({
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
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderService.updateStatus(id, status);

    res.status(CODE.OK).json({
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
 * param {Object} req - Express request
 * param {Object} res - Express response
 * param {Function} next - Express next function
 */
export const deleteOneOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const accountId = req.user?.role === 'admin' ? null : req.user?.id;

    const order = await OrderService.delete(id, accountId);

    res.status(CODE.OK).json({
      success: true,
      data: order,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
