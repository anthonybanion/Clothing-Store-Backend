import { Router } from 'express';
import {
  getOnePerson,
  getAllPersons,
} from '../controllers/personController.js';
import {
  createPersonValidation,
  updatePersonValidation,
  updatePartialPersonValidation,
  personIdValidation,
  updatePersonStatusValidation,
} from '../validations/personValidation.js';
// Middleware to handle validation errors
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get('/:id', personIdValidation, handleValidationErrors, getOnePerson);
router.get('/', getAllPersons);

export default router;
