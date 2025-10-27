import { Router } from 'express';
import { getOneCategory } from '../controllers/categoryController.js';

const router = Router();

router.get('/:id', getOneCategory);

export default router;
