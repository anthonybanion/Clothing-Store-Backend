// ==========================================
//
// Description: Product controllers
//
// File: product.controlers.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-10-14
// ==========================================

import { productsService } from '../services/products.service.js';

const Service = productsService();

export const getOneProduct = (req, res) => {
  try {
    // Extract the variables from the request
    const { id } = req.params;

    // The service solves the logic
    const product = Service.getOne(Number(id));

    // Returns the result
    res.send({
      message: 'Product retrieved successfully: ' + id,
      data: product,
    });
  } catch (error) {
    res.send({ message: 'Error retrieving product' });
  }
};

export const getAllProducts = (req, res) => {
  try {
    // The service solves the logic
    const productsList = Service.getAll();

    // Returns the result
    res.send({
      message: 'Products retrieved successfully',
      data: productsList,
    });
  } catch (error) {
    // Handle the error
    res.send({ message: 'Error retrieving products' });
  }
};

export const createOneProduct = (req, res) => {
  try {
    // Extract the variables from the request
    const { name, price } = req.body;

    // The service solves the logic
    const newProduct = Service.create(name, price);

    // Returns the result
    res.send({
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    res.send({ message: 'Error retrieving products' });
  }
};

export const updateOneProduct = (req, res) => {
  try {
    // Extract the variables from the request
    const { id } = req.params;
    const { name, price } = req.body;

    // The service solves the logic
    const updatedProduct = Service.update(Number(id), name, price);

    // Returns the result
    res.send({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.send({ message: 'Error updating product' });
  }
};

export const updatePartialOneProduct = (req, res) => {
  try {
    // Extract the variables from the request
    const { id } = req.params;
    const updates = req.body;

    // The service solves the logic
    const updatedProduct = Service.updatePartial(Number(id), updates);

    // Returns the result
    res.send({
      message: 'Product partially updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.send({ message: 'Error partially updating product' });
  }
};

export const deleteOneProduct = (req, res) => {
  try {
    // Extract the variables from the request
    const { id } = req.params;

    // The service solves the logic
    const deleted = Service.deleted(Number(id));

    // Returns the result
    res.send({
      message: 'Product deleted successfully',
      data: deleted,
    });
  } catch (error) {
    res.send({ message: 'Error deleting product' });
  }
};
