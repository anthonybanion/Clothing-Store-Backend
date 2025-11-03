// ==========================================
//
// Description: Category controller handling HTTP requests
//
// File: categoryController.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-30
// Changes: Added error handling to all controllers
// ==========================================

import categoryService from '../services/categoryService.js';
import { CODE } from '../config/constants.js';

/*
 *  Get one category by ID
 *
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category document
 * @throws {Error} If an error occurs during retrieval
 */
export const getOneCategory = async (req, res, next) => {
  try {
    // Get category by ID
    const { id } = req.params;
    // Fetch category from service
    const category = await categoryService.getOne(id);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: `Category retrieved successfully`,
      data: category,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/*
 * Get all categories
 *
 * @returns {Promise<Array>} List of category documents
 * @throws {Error} If an error occurs during retrieval
 */
export const getAllCategories = async (req, res, next) => {
  try {
    // Fetch all categories from service
    const categories = await categoryService.getAll();
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: `Categories retrieved successfully`,
      data: categories,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/*
 * Create one category
 *
 * @param {Object} categoryData - Data for the new category
 * @returns {Promise<Object>} Category document
 * @throws {Error} If an error occurs during creation
 */
export const createOneCategory = async (req, res, next) => {
  try {
    // Get new category data from body and file
    const categoryData = {
      ...req.body,
      image: req.file ? req.file.buffer : null, // Compressed image
    };
    // Create new category via service
    const newCategory = await categoryService.create(categoryData);
    // Successful response
    res.status(CODE.CREATED).json({
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/*
 * Update one category
 *
 * @param {String} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category document
 * @throws {Error} If an error occurs during update
 */
export const updateOneCategory = async (req, res, next) => {
  try {
    // Get category ID and updated data
    const { id } = req.params;
    const categoryData = {
      ...req.body,
      image: req.file ? req.file.buffer : null, // Compressed image
    };
    // Update category via service
    const updatedCategory = await categoryService.update(id, categoryData);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/*
 * Update one partial category
 *
 * @param {String} id - Category ID
 * @param {Object} updates - Partial category data
 * @returns {Promise<Object>} Updated category document
 * @throws {Error} If an error occurs during partial update
 */
export const updatePartialCategory = async (req, res, next) => {
  try {
    // Get category ID and partial updates
    const { id } = req.params;
    const updates = {
      ...req.body,
      image: req.file ? req.file.buffer : null, // Compressed image
    };
    // Partially update category via service
    const updatedCategory = await categoryService.updatePartial(id, updates);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Category partially updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/*
 * Update category status
 *
 * @param {String} id - Category ID
 * @param {boolean} is_active - Status
 * @returns {Promise<Object>} Updated category document
 * @throws {Error} If an error occurs during status update
 */

export const updateCategoryStatus = async (req, res, next) => {
  try {
    // Get category ID from params
    const { id } = req.params;
    const { is_active } = req.body;
    // Update category status
    const updatedCategory = await categoryService.updateStatus(id, is_active);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: `Category ${
        is_active ? 'restored' : 'deactivated'
      } successfully`,
      data: {
        id: updatedCategory._id,
        name: updatedCategory.name,
        is_active: updatedCategory.is_active,
      },
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/*
 * Delete one category
 *
 * @param {String} id - Category ID
 * @returns {Promise<Object>} Deleted category document
 * @throws {Error} If an error occurs during deletion
 */

export const deleteOneCategory = async (req, res, next) => {
  try {
    // Get category ID from params
    const { id } = req.params;
    // Delete category via service
    await categoryService.delete(id);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};
