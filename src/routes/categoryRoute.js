import { Router } from 'express';
import {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  updateOnePartialCategory,
  deleteOneCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/:id', getOneCategory);
router.get('/', getAllCategories);
router.post('/:id', createOneCategory);
router.put('/:id', updateOneCategory);
router.patch('/:id', updateOnePartialCategory);
router.delete('/:id', deleteOneCategory);

export default router;
