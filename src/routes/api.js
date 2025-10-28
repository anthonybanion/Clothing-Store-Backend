import express from 'express';
import userRoute from './userRoute.js';
import productRoute from './productRoute.js';
import categoryRoute from './categoryRoute.js';

const router = express.Router();

// Todas estas rutas estarán bajo /api
router.use('/users', userRoute);
router.use('/products', productRoute);
router.use('/categories', categoryRoute);

export default router;
