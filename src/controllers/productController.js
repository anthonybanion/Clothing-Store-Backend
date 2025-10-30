// ==========================================
//
// Description: Product controllers handling HTTP requests
//
// File: productController.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-30
// Changes: Added error handling to all controllers
// ==========================================

import productService from '../services/productService.js';
import { CODE } from '../config/constants.js';

export const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getOne(id);

    res.status(CODE.SUCCESS).json({
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const productsList = await productService.getAll();

    res.status(CODE.SUCCESS).json({
      message: 'Products retrieved successfully',
      data: productsList,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const products = await productService.getByCategory(categoryId);

    res.status(CODE.SUCCESS).json({
      message: 'Products by category retrieved successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const createOneProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.create(req.body);

    res.status(CODE.CREATED).json({
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedProduct = await productService.update(id, data);

    res.status(CODE.SUCCESS).json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOnePartialProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await productService.updatePartial(id, updates);

    res.status(CODE.SUCCESS).json({
      message: 'Product partially updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { quantity } = req.body;

    // Validación de formato (sí pertenece al controller)
    if (typeof quantity !== 'number') {
      return res.status(CODE.BAD_REQUEST).json({
        message: 'Quantity must be a number',
      });
    }

    const updatedProduct = await productService.updateStock(id, quantity);

    res.status(CODE.SUCCESS).json({
      message: `Product stock ${
        quantity >= 0 ? 'increased' : 'decreased'
      } successfully`,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const updatedProduct = await productService.updateStatus(id, is_active);

    res.status(CODE.SUCCESS).json({
      message: `Product ${is_active ? 'restored' : 'deactivated'} successfully`,
      data: {
        id: updatedProduct._id,
        name: updatedProduct.name,
        is_active: updatedProduct.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await productService.delete(id);

    res.status(CODE.NO_CONTENT).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
