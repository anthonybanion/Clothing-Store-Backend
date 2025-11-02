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
  InsufficientResourceError,
  ValidationError,
} from '../errors/businessError.js';
import {
  validateUniqueness,
  validateRequiredFields,
} from '../utils/validationUtils.js';
import { saveImageAndGetUrl } from '../utils/imageUtils.js';

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
    // Validate required fields
    validateRequiredFields(
      data,
      ['sku', 'name', 'price', 'category'],
      'Product'
    );
    // Validate uniqueness of SKU
    await validateUniqueness(Product, 'sku', data.sku, null, 'Product');

    // If there is an image, save it and get URL
    if (data.image) {
      const imageUrl = await saveImageAndGetUrl(
        data.image,
        'products',
        'product'
      );
      data.image = imageUrl; // Replace buffer with URL
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
    // Business validation IN THE SERVICE
    if (data.sku) {
      await validateUniqueness(Product, 'sku', data.sku, id, 'Product');
    }
    // Find existing product
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // If there is an image, save it and get URL
    if (data.image) {
      const imageUrl = await saveImageAndGetUrl(
        data.image,
        'products',
        'product'
      );
      data.image = imageUrl; // Replace buffer with URL
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
    // Business validation IN THE SERVICE
    if (updates.sku) {
      await validateUniqueness(Product, 'sku', updates.sku, id, 'Product');
    }

    // If there is an image, save it and get URL
    if (updates.image) {
      const imageUrl = await saveImageAndGetUrl(
        updates.image,
        'products',
        'product'
      );
      updates.image = imageUrl; // Replace buffer with URL
    }
    // Partial update with validators
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();
    // Validate existence
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
    // Validate product exists
    const product = await Product.findById(id);
    // Validate existence
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
    // Update stock atomically
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    ).exec();

    return updatedProduct;
  }
}

// Export single instance (Singleton)
export default new ProductService();
