// ==========================================
//
// Description: Product service handling business logic
//
// File: productService.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-30
// Changes: Add JSDoc annotations for methods
// ==========================================

import Product from '../models/productModel.js';
import {
  NotFoundError,
  DuplicateError,
  InsufficientResourceError,
  ValidationError,
} from '../errors/businessError.js';

class ProductService {
  /**
   * Get one product by ID
   *
   * param {string} id - Product ID
   * returns {Promise<Object>} Product document
   * throws {NotFoundError} If product not found
   */
  async getOne(id) {
    const product = await Product.findById(id).exec();
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    return product;
  }

  /**
   * Get all active products
   *
   * returns {Promise<Array>} List of products
   */
  async getAll() {
    return await Product.find({ is_active: true }).exec();
  }

  /**
   * Create a new product
   *
   * param {Object} data - Product data
   * returns {Promise<Object>} Created product
   * throws {DuplicateError} If SKU already exists
   */
  async create(data) {
    const { sku } = data;

    // Validación de negocio EN EL SERVICE
    if (sku) {
      await this.validateSkuUniqueness(sku);
    }

    const product = new Product(data);
    return await product.save();
  }

  /**
   * Update a product completely
   *
   * param {string} id - Product ID
   * param {Object} data - Complete product data
   * returns {Promise<Object>} Updated product
   * throws {NotFoundError} If product not found
   * throws {DuplicateError} If SKU already exists
   */
  async update(id, data) {
    const { sku } = data;

    // Business validation IN THE SERVICE
    if (sku) {
      await this.validateSkuUniqueness(sku, id);
    }
    // Find existing product
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    // Update fields
    Object.assign(product, data);
    // Validates entire schema with save()
    return await product.save();
  }

  /**
   * Partially update a product
   *
   * param {string} id - Product ID
   * param {Object} updates - Partial product data
   * returns {Promise<Object>} Updated product
   * throws {NotFoundError} If product not found
   * throws {DuplicateError} If SKU already exists
   */
  async updatePartial(id, updates) {
    const { sku } = updates;

    // Validación de negocio EN EL SERVICE
    if (sku) {
      await this.validateSkuUniqueness(sku, id);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedProduct) {
      throw new NotFoundError('Product', id);
    }

    return updatedProduct;
  }

  /**
   * Update product status (soft delete)
   *
   * param {string} id - Product ID
   * param {boolean} is_active - Status
   * returns {Promise<Object>} Updated product
   * throws {NotFoundError} If product not found
   */
  async updateStatus(id, is_active = false) {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { is_active },
      { new: true }
    ).exec();

    if (!updatedProduct) {
      throw new NotFoundError('Product', id);
    }

    return updatedProduct;
  }

  /**
   * Delete a product permanently
   *
   * param {string} id - Product ID
   * returns {Promise<Object>} Deleted product
   * throws {NotFoundError} If product not found
   */
  async delete(id) {
    const deleteProduct = await Product.findByIdAndDelete(id).exec();

    if (!deleteProduct) {
      throw new NotFoundError('Product', id);
    }

    return deleteProduct;
  }

  /**
   * Get products by category
   *
   * param {string} categoryId - Category ID
   * returns {Promise<Array>} List of products in category
   */
  async getByCategory(categoryId) {
    return await Product.find({
      category: categoryId,
      is_active: true,
    }).exec();
  }

  /**
   * Update product stock with validation
   *
   * param {string} id - Product ID
   * param {number} quantity - Quantity to add/subtract
   * returns {Promise<Object>} Updated product
   * throws {NotFoundError} If product not found
   * throws {InsufficientResourceError} If stock would go negative
   */
  async updateStock(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    // Validate quantity is a number
    if (typeof quantity !== 'number') {
      throw new ValidationError('Product', 'Quantity must be a number', {
        field: 'quantity',
        value: quantity,
      });
    }

    //Do not allow negative stock
    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new InsufficientResourceError(
        'Product',
        'STOCK',
        product.stock,
        Math.abs(quantity)
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    ).exec();

    return updatedProduct;
  }

  /**
   * Validate SKU uniqueness (business logic)
   *
   * param {string} sku - SKU to check
   * param {string} excludeId - Product ID to exclude
   * throws {DuplicateError} If SKU already exists
   */
  async validateSkuUniqueness(sku, excludeId = null) {
    const query = { sku };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Product.findOne(query).exec();
    if (existing) {
      throw new DuplicateError('Product', 'SKU', sku);
    }
  }
}

// Export single instance (Singleton)
export default new ProductService();
