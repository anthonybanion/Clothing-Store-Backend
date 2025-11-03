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
// Middleware for image upload
import { uploadImage } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.get('/:id', personIdValidation, handleValidationErrors, getOnePerson);
router.get('/', getAllPersons);
router.post(
  '/',
  uploadImage,
  createPersonValidation,
  handleValidationErrors,
  createOnePerson
);
router.put(
  '/:id',
  uploadImage,
  updatePersonValidation,
  handleValidationErrors,
  updateOnePerson
);
router.patch(
  '/:id',
  uploadImage,
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
