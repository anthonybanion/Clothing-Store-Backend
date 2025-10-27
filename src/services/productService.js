// ==========================================
//
// Description: Product service handling business logic
//
// File: productService.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-26
// Changes: Initial creation and implementation of product
// service methods with Class structure
// ==========================================

import Product from '../models/productModel.js';

class ProductService {
  /**
   * Get one product by ID
   * param {string} id - Product ID
   * returns {Promise<Object>} Product document
   */

  async getOne(id) {
    return await Product.findById(id).exec();
  }

  /**
   * Get all active products
   * returns {Promise<Array>} List of products
   */
  async getAll() {
    return await Product.find({ active: true }).exec();
  }

  /**
   * Create a new product
   * param {Object} data - Product data
   * returns {Promise<Object>} Created product
   */
  async create(data) {
    const product = new Product(data);
    return await product.save();
  }

  /**
   * Update a product completely
   * param {string} id - Product ID
   * param {Object} data - Complete product data
   * returns {Promise<Object>} Updated product
   */
  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Partially update a product
   * param {string} id - Product ID
   * param {Object} updates - Partial product data
   * returns {Promise<Object>} Updated product
   */
  async updatePartial(id, updates) {
    return await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Delete a product (soft delete)
   * param {string} id - Product ID
   * returns {Promise<Object>} Deleted product
   */
  async delete(id) {
    return await Product.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    ).exec();
  }

  /**
   * Get products by category
   * param {string} categoryId - Category ID
   * returns {Promise<Array>} List of products in category
   */
  async getByCategory(categoryId) {
    return await Product.find({
      category: categoryId,
      active: true,
    }).exec();
  }

  /**
   * Check if SKU already exists
   * param {string} sku - SKU to check
   * param {string} excludeId - Product ID to exclude (for updates)
   * returns {Promise<boolean>} True if SKU exists
   */
  async skuExists(sku, excludeId = null) {
    const query = { sku };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Product.findOne(query).exec();
    return !!existing;
  }

  /**
   * Update product stock
   * param {string} id - Product ID
   * param {number} quantity - Quantity to add/subtract
   * returns {Promise<Object>} Updated product
   */
  async updateStock(id, quantity) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    ).exec();
  }
}

// Export single instance (Singleton)
export default new ProductService();
