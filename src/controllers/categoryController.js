import categoryService from '../services/categoryService.js';
import { handleMongooseError } from '../utils/mongooseErrorHandler.js';
import { CODE } from '../config/constants.js';

export const getOneCategory = async (req, res) => {
  try {
    // Get category by ID
    const { id } = req.params;
    // Fetch category from service
    const category = await categoryService.getOne(id);
    // If not found, return 404
    if (!category) {
      return res.status(CODE.BAD_REQUEST).json({
        message: `Category with ID ${id} no found`,
      });
    }
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: `Category retrieved successfully`,
      data: category,
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from service
    const categories = await categoryService.getAll();
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: `Categories retrieved successfully`,
      data: categories,
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};

export const createOneCategory = async (req, res) => {
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
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};
export const updateOneCategory = async (req, res) => {
  try {
    // Get category ID and updated data
    const { id } = req.params;
    const categoryData = req.body;
    // Update category via service
    const updatedCategory = await categoryService.update(id, categoryData);
    // If not found, return 404
    if (!updatedCategory) {
      return res.status(CODE.BAD_REQUEST).json({
        message: `Category with ID ${id} no found`,
      });
    }
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};
export const updateOnePartialCategory = async (req, res) => {
  try {
    // Get category ID and partial updates
    const { id } = req.params;
    const updates = req.body;
    // Partially update category via service
    const updatedCategory = await categoryService.updatePartial(id, updates);
    // If not found, return 404
    if (!updatedCategory) {
      return res.status(CODE.BAD_REQUEST).json({
        message: `Category with ID ${id} no found`,
      });
    }
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Category partially updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};

export const updateCategoryStatus = async (req, res) => {
  try {
    // Get category ID from params
    const { id } = req.params;
    const { is_active } = req.body;
    // Update category status
    const updatedCategory = await categoryService.updateStatus(id, is_active);

    if (!updatedCategory) {
      // If category not found, return 404
      return res.status(CODE.BAD_REQUEST).json({
        message: `Category with ID ${id} no found`,
      });
    }
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
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};

export const deleteOneCategory = async (req, res) => {
  try {
    // Get category ID
    const { id } = req.params;
    // Delete category via service
    const deletedCategory = await categoryService.delete(id);
    // If not found, return 404
    if (!deletedCategory) {
      return res.status(CODE.BAD_REQUEST).json({
        message: `Category with ID ${id} no found`,
      });
    }
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};
