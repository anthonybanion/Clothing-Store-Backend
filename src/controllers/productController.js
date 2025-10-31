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

/*
 * Get one product by ID

 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product document
 * @throws {Error} If an error occurs during retrieval
 */

export const getOneProduct = async (req, res, next) => {
  try {
    // Get one product by ID
    const { id } = req.params;
    // Fetch product from service
    const product = await productService.getOne(id);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/*
 * Get all products
 *
 * @returns {Promise<Array>} List of products
 * @throws {Error} If an error occurs during retrieval
 */

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

/*
 * Get products by category ID
 *
 * @param {string} categoryId - Category ID
 * @returns {Promise<Array>} List of products
 * @throws {Error} If an error occurs during retrieval
 */

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

/*
 * Create one product
 *
 * @param {Object} productData - Data for the new product
 * @returns {Promise<Object>} Created product
 * @throws {Error} If an error occurs during creation
 */

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

/*
 * Update one product
 *
 * @param {String} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product document
 * @throws {Error} If an error occurs during update
 */

export const updateOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const updatedProduct = await productService.update(id, productData);

    res.status(CODE.SUCCESS).json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Update one partial product
 *
 * @param {String} id - Product ID
 * @param {Object} updates - Partial product data
 * @returns {Promise<Object>} Updated product document
 * @throws {Error} If an error occurs during partial update
 */

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

/*
 * Update product stock
 *
 * @param {String} id - Product ID
 * @param {number} quantity - Quantity to adjust stock by
 * @returns {Promise<Object>} Updated product document
 * @throws {Error} If an error occurs during stock update
 */
export const updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { quantity } = req.body;

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

/*
 * Update product status
 *
 * @param {String} id - Product ID
 * @param {boolean} is_active - Status
 * @returns {Promise<Object>} Updated product document
 * @throws {Error} If an error occurs during status update
 */

export const updateProductStatus = async (req, res, next) => {
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

/*
 * Delete one product
 *
 * @param {String} id - Product ID
 * @returns {Promise<Object>} Deleted product document
 * @throws {Error} If an error occurs during deletion
 */

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
