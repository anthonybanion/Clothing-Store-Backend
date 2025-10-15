// ==========================================
//
// Description: Product routes configuration
//
// File: product.routers.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-10-14
// ==========================================

import { Router } from 'express';
import {
  getOneProduct,
  getAllProducts,
  createOneProduct,
  updateOneProduct,
  updatePartialOneProduct,
  deleteOneProduct,
} from '../controllers/product.controlers.js';

const router = Router();

//GET whit a id
router.get('/:id', getOneProduct);

//GET all
router.get('/', getAllProducts);

//POST a new product
router.post('/', createOneProduct);

//PUT update a product
router.put('/:id', updateOneProduct);

//PATCH update a product partially
router.patch('/:id', updatePartialOneProduct);

//DELETE a product
router.delete('/:id', deleteOneProduct);

export default router;
