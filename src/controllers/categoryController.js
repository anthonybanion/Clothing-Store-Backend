import categoryService from '../services/categoryService.js';
import { handleMongooseError } from '../utils/mongooseErrorHandler.js';

export const getOneCategory = async (req, res) => {
  try {
    // Get category by ID
    const { id } = req.params;
    // Fetch category from service
    const category = await categoryService.getOne(id);
    // If not found, return 404
    if (!category) {
      return res.status(404).json({
        message: `Category with ID ${id} no found`,
      });
    }
    // Successful response
    res.status(200).json({
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
export const getAllCategories = async (req, res) => {};
export const createCategory = async (req, res) => {};
export const updateCategory = async (req, res) => {};
export const updatePartialCategory = async (req, res) => {};
export const deleteCategory = async (req, res) => {};
