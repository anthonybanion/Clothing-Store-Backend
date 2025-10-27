// ==========================================
//
// Description: Product controllers using Mongoose and Joi validation.
//
// File: productController.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import productService from '../services/productService.js';
import { handleMongooseError } from '../utils/mongooseErrorHandler.js';

export const getOneProduct = async (req, res) => {
  try {
    // Get product by ID
    const { id } = req.params;
    // Fetch product from service
    const product = await productService.getOne(id);
    // If not found, return 404
    if (!product) {
      return res.status(404).json({
        message: `Product with ID ${id} not found`,
      });
    }
    // Successful response
    res.json({
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from service
    const productsList = await productService.getAll();
    // Successful response
    res.json({
      message: 'Products retrieved successfully',
      data: productsList,
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    // Get products by category ID
    const { categoryId } = req.params;
    // Fetch products from service
    const products = await productService.getByCategory(categoryId);
    // Successful response
    res.json({
      message: 'Products by category retrieved successfully',
      data: products,
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    // Custom response based on error type
    res.status(statusCode).json(response);
  }
};

export const createOneProduct = async (req, res) => {
  try {
    // Check for existing SKU to enforce uniqueness
    const { sku } = req.body;
    // Check if SKU already exists
    const skuExists = await productService.skuExists(sku);
    if (skuExists) {
      return res.status(409).json({
        message: 'Product with this SKU already exists',
      });
    }
    // Create new product
    const newProduct = await productService.create(req.body);
    // Successful response
    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    const { statusCode, response } = handleMongooseError(error);
    res.status(statusCode).json(response);
  }
};

export const updateOneProduct = async (req, res) => {
  try {
    // Get product ID from params and sku from body
    const { id } = req.params;
    const { sku } = req.body;

    if (sku) {
      // Check if SKU already exists excluding current product
      const skuExists = await productService.skuExists(sku, id);
      if (skuExists) {
        // Conflict response for duplicate SKU
        return res.status(409).json({
          message: 'Product with this SKU already exists',
        });
      }
    }
    // Update product completely
    const updatedProduct = await productService.update(id, req.body);

    if (!updatedProduct) {
      // If product not found, return 404
      return res.status(404).json({
        message: `Product with ID ${id} not found`,
      });
    }
    // Successful response
    res.json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    const { statusCode, response } = handleMongooseError(error);
    res.status(statusCode).json(response);
  }
};

export const updatePartialOneProduct = async (req, res) => {
  try {
    // Get product ID from params and updates from body
    const { id } = req.params;
    const updates = req.body;
    const { sku } = updates;

    if (sku) {
      // Check if SKU already exists excluding current product
      const skuExists = await productService.skuExists(sku, id);
      if (skuExists) {
        return res.status(409).json({
          message: 'Product with this SKU already exists',
        });
      }
    }
    // Partially update product
    const updatedProduct = await productService.updatePartial(id, updates);

    if (!updatedProduct) {
      // If product not found, return 404
      return res.status(404).json({
        message: `Product with ID ${id} not found`,
      });
    }
    // Successful response
    res.json({
      message: 'Product partially updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    const { statusCode, response } = handleMongooseError(error);
    res.status(statusCode).json(response);
  }
};

export const updateProductStock = async (req, res) => {
  try {
    // Get product ID and quantity from request
    const { id } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      // Validate quantity is a number
      return res.status(400).json({
        message: 'Quantity must be a number',
      });
    }
    // Update product stock
    const updatedProduct = await productService.updateStock(id, quantity);

    if (!updatedProduct) {
      // If product not found, return 404
      return res.status(404).json({
        message: `Product with ID ${id} not found`,
      });
    }
    // Successful response
    res.json({
      // Dynamic message based on quantity change
      message: `Product stock ${
        quantity >= 0 ? 'increased' : 'decreased'
      } successfully`,
      // Return updated product data
      data: updatedProduct,
    });
  } catch (error) {
    const { statusCode, response } = handleMongooseError(error);
    res.status(statusCode).json(response);
  }
};

export const deleteOneProduct = async (req, res) => {
  try {
    // Get product ID from params
    const { id } = req.params;
    // Soft delete product
    const deletedProduct = await productService.delete(id);

    if (!deletedProduct) {
      // If product not found, return 404
      return res.status(404).json({
        message: `Product with ID ${id} not found`,
      });
    }
    // Successful response
    res.json({
      message: 'Product deleted successfully',
      data: { id: deletedProduct._id, name: deletedProduct.name },
    });
  } catch (error) {
    // Handles ALL error types
    const { statusCode, response } = handleMongooseError(error);
    res.status(statusCode).json(response);
  }
};
