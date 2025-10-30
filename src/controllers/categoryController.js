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

export const createOneCategory = async (req, res, next) => {
  try {
    // Get new category data from body
    const categoryData = req.body;
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
export const updateOneCategory = async (req, res, next) => {
  try {
    // Get category ID and updated data
    const { id } = req.params;
    const categoryData = req.body;
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
export const updateOnePartialCategory = async (req, res, next) => {
  try {
    // Get category ID and partial updates
    const { id } = req.params;
    const updates = req.body;
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

export const deleteOneCategory = async (req, res, next) => {
  try {
    // Get category ID
    const { id } = req.params;
    // Delete category via service
    const deletedCategory = await categoryService.delete(id);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};
