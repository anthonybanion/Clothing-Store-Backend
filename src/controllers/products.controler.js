// ==========================================
//
// Description: Product controllers using Mongoose and Joi validation.
//
// File: product.controller.js
// Author: Anthony Bañon
// Created: 2025-10-21
// Last Updated: 2025-10-21
// ==========================================

import { productsService } from '../services/products.service.js';

const Service = productsService();

/**
 * Get one product by ID
 * - Uses Mongoose to retrieve product from database
 * - Returns 404 if not found
 */
export const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve product using service
    const product = await Service.getOne(id);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    res.json({
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving product', error: error.message });
  }
};

/**
 * Get all products
 * - Retrieves all products from the database
 */
export const getAllProducts = async (req, res) => {
  try {
    const productsList = await Service.getAll();
    res.json({
      message: 'Products retrieved successfully',
      data: productsList,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving products', error: error.message });
  }
};

/**
 * Create a new product
 * - Data is already validated by Joi middleware
 * - Creates and saves a new product in MongoDB
 */
export const createOneProduct = async (req, res) => {
  try {
    const newProduct = await Service.create(req.body);

    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating product', error: error.message });
  }
};

/**
 * Update a product completely
 * - Replaces product data using Mongoose findByIdAndUpdate
 * - runValidators ensures schema validations are applied
 */
export const updateOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Service.update(id, req.body);

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    res.json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating product', error: error.message });
  }
};

/**
 * Partially update a product
 * - Only updates provided fields
 * - runValidators ensures schema validations are applied
 */
export const updatePartialOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Service.updatePartial(id, updates);

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    res.json({
      message: 'Product partially updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error partially updating product',
        error: error.message,
      });
  }
};

/**
 * Delete a product by ID
 * - Removes the product from MongoDB
 * - Returns true if deleted, false if not found
 */
export const deleteOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.deleted(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    res.json({
      message: 'Product deleted successfully',
      data: deleted,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting product', error: error.message });
  }
};
