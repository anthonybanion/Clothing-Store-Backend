import { Router } from 'express';
import {
  getAllCategories,
  getOneCategory,
  createOneCategory,
  updateOneCategory,
  updatePartialCategory,
  updateCategoryStatus,
  deleteOneCategory,
} from '../controllers/categoryController.js';

import {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  updateCategoryStatusValidation,
  updatePartialCategoryValidation,
} from '../validations/categoryValidation.js';

// Middleware to handle validation errors
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get(
  '/:id',
  categoryIdValidation,
  handleValidationErrors,
  getOneCategory
);
router.get('/', getAllCategories);
router.post(
  '/',
  createCategoryValidation,
  handleValidationErrors,
  createOneCategory
);
router.put(
  '/:id',
  updateCategoryValidation,
  handleValidationErrors,
  updateOneCategory
);
router.patch(
  '/:id',
  updatePartialCategoryValidation,
  handleValidationErrors,
  updatePartialCategory
);

router.patch(
  '/:id/status',
  updateCategoryStatusValidation,
  handleValidationErrors,
  updateCategoryStatus
);
router.delete(
  '/:id',
  categoryIdValidation,
  handleValidationErrors,
  deleteOneCategory
);

export default router;
