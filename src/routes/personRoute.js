import { Router } from 'express';
import {
  getOnePerson,
  getAllPersons,
  createOnePerson,
  updateOnePerson,
  updatePartialPerson,
  updatePersonStatus,
  deleteOnePerson,
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
router.post(
  '/',
  createPersonValidation,
  handleValidationErrors,
  createOnePerson
);
router.put(
  '/:id',
  updatePersonValidation,
  handleValidationErrors,
  updateOnePerson
);
router.patch(
  '/:id',
  updatePartialPersonValidation,
  handleValidationErrors,
  updatePartialPerson
);
router.patch(
  '/:id/status',
  updatePersonStatusValidation,
  handleValidationErrors,
  updatePersonStatus
);
router.delete(
  '/:id',
  personIdValidation,
  handleValidationErrors,
  deleteOnePerson
);

export default router;
