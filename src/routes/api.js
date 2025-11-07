import express from 'express';
import productRoute from './productRoute.js';
import categoryRoute from './categoryRoute.js';
import personRoute from './personRoute.js';
import authRoute from './authRoute.js';
import accountRoute from './accountRoute.js';

const router = express.Router();

// Todas estas rutas estarán bajo /api
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/accounts', accountRoute);
router.use('/persons', personRoute);
router.use('/auth', authRoute);

export default router;
