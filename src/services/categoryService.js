// ==========================================
//
// Description: Category service handling business logic
//
// File: categoryService.js
// Author: Anthony Bañon
// Created: 2025-10-27
// Last Updated: 2025-10-30
// Changes: Added uniqueness validation for category name
// ==========================================

import Category from '../models/categoryModel.js';
import { NotFoundError, DuplicateError } from '../errors/businessError.js';

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
   */
  async create(data) {
    const { name } = data;

    if (name) {
      await this.validateNameUniqueness(name);
    }
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
    const { name } = data;
    // Business validation IN THE SERVICE
    if (name) {
      await this.validateNameUniqueness(name, id);
    }
    // Find existing category
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError('Category', id);
    }

    // Replace all fields with new data
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
    const { name } = updates;
    // Business validation IN THE SERVICE
    if (name) {
      await this.validateNameUniqueness(name, id);
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedCategory) {
      throw new NotFoundError('Category', id);
    }

    return updatedCategory;
  }

  /**
   *  Soft delete a category by setting is_active to false
   * param {string} id - Category ID
   * returns {Promise<Object>} Deleted category
   */
  async updateStatus(id, is_active = false) {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { is_active: is_active },
      { new: true }
    ).exec();

    if (!updatedCategory) {
      throw new NotFoundError('Category', id);
    }

    return updatedCategory;
  }

  /**
   * Hard delete a category from the database
   * param {string} id - Category ID
   * returns {Promise<Object>} Deleted category
   */
  async delete(id) {
    const deleteCategory = await Category.findByIdAndDelete(id).exec();

    if (!deleteCategory) {
      throw new NotFoundError('Category', id);
    }
    return deleteCategory;
  }

  /**
   * Validate uniqueness of category name
   * param {string} name - Category name
   * param {string|null} excludeId - ID to exclude from check (for updates)
   * throws {Error} If a category with the same name exists
   */
  async validateNameUniqueness(name, excludeId = null) {
    const query = { name };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Category.findOne(query).exec();
    if (existing) {
      throw new DuplicateError('Category', 'name', name);
    }
  }
}

export default new CategoryService();
