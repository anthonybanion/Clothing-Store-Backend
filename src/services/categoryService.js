// ==========================================
//
// Description: Category service handling business logic
//
// File: categoryService.js
// Author: Anthony Bañon
// Created: 2025-10-27
// Last Updated: 2025-10-30
// Changes: Add JSDoc annotations for methods
// ==========================================

import Category from '../models/categoryModel.js';
import { NotFoundError } from '../errors/businessError.js';
import {
  validateUniqueness,
  validateRequiredFields,
} from '../utils/validationUtils.js';
import { saveImageAndGetUrl } from '../utils/imageUtils.js';

class CategoryService {
  /**
   * Get one category by ID
   * param {string} id - Category ID
   * returns {Promise<Object>} Category document
   * throws {NotFoundError} If category not found
   */
  async getOne(id) {
    const category = await Category.findById(id).exec();
    if (!category) {
      throw new NotFoundError('Category', id);
    }
    return category;
  }

  /**
   * Get all active categories
   * returns {Promise<Array>} List of categories
   */
  async getAll() {
    return await Category.find({ is_active: true }).exec();
  }

  /**
   * Create a new category
   * param {Object} data - Category data
   * returns {Promise<Object>} Created category
   * throws {DuplicateError} If category name already exists
   * throws {ValidationError} If required fields are missing
   */
  async create(data) {
    // Validate required fields
    validateRequiredFields(data, ['name'], 'Category');

    // Validate uniqueness of category name
    await validateUniqueness(Category, 'name', data.name, null, 'Category');

    // If there is an image, save it and get URL
    if (data.image) {
      const imageUrl = await saveImageAndGetUrl(
        data.image,
        'products',
        'product'
      );
      data.image = imageUrl; // Replace buffer with URL
    }

    // Create and save category
    const category = new Category(data);
    return await category.save();
  }

  /**
   * Update a category completely
   * param {string} id - Category ID
   * param {Object} data - Complete category data
   * returns {Promise<Object>} Updated category
   * throws {NotFoundError} If category not found
   * throws {DuplicateError} If category name already exists
   */
  async update(id, data) {
    // Validate uniqueness only if name is being updated
    if (data.name) {
      await validateUniqueness(Category, 'name', data.name, id, 'Category');
    }
    // Find existing category and update
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError('Category', id);
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

    Object.assign(category, data);

    // Validates entire schema with save()
    return await category.save();
  }

  /**
   * Partially update a category
   * param {string} id - Category ID
   * param {Object} updates - Partial category data
   * returns {Promise<Object>} Updated category
   * throws {NotFoundError} If category not found
   * throws {DuplicateError} If category name already exists
   */
  async updatePartial(id, updates) {
    // Validate uniqueness only if name is being updated
    if (updates.name) {
      await validateUniqueness(Category, 'name', updates.name, id, 'Category');
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

    // Partial update with validators
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();
    // Validate existence
    if (!updatedCategory) {
      throw new NotFoundError('Category', id);
    }
    return updatedCategory;
  }

  /**
   * Soft delete a category by setting is_active to false
   * param {string} id - Category ID
   * returns {Promise<Object>} Deleted category
   * throws {NotFoundError} If category not found
   */
  async updateStatus(id, is_active = false) {
    // Validate category exists and update status
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { is_active },
      { new: true }
    ).exec();
    // Validate existence
    if (!updatedCategory) {
      throw new NotFoundError('Category', id);
    }

    return updatedCategory;
  }

  /**
   * Hard delete a category from the database
   * param {string} id - Category ID
   * returns {Promise<Object>} Deleted category
   * throws {NotFoundError} If category not found
   */
  async delete(id) {
    // Validate category exists and delete
    const deletedCategory = await Category.findByIdAndDelete(id).exec();

    if (!deletedCategory) {
      throw new NotFoundError('Category', id);
    }

    return deletedCategory;
  }
}

export default new CategoryService();
