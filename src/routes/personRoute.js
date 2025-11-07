import { Router } from 'express';
import {
  getOnePerson,
  getAllPersons,
  createOnePerson,
  updateOnePerson,
  updatePartialPerson,
  updatePersonStatus,
  deletePersonImage,
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
import {
  authenticateToken,
  requireRole,
  requireOwnershipOrRole,
} from '../middlewares/authMiddleware.js';

const router = Router();

// 🔐 PROTECTED ROUTES
router.get('/', authenticateToken, requireRole(['admin']), getAllPersons);

router.get(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  personIdValidation,
  handleValidationErrors,
  getOnePerson
);

router.post(
  '/',
  uploadImage,
  createPersonValidation,
  handleValidationErrors,
  createOnePerson
);
router.put(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  uploadImage,
  updatePersonValidation,
  handleValidationErrors,
  updateOnePerson
);
router.patch(
  '/:id',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  uploadImage,
  updatePartialPersonValidation,
  handleValidationErrors,
  updatePartialPerson
);
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['admin']),
  updatePersonStatusValidation,
  handleValidationErrors,
  updatePersonStatus
);

router.delete(
  '/:id/image',
  authenticateToken,
  requireOwnershipOrRole(['admin']),
  personIdValidation,
  handleValidationErrors,
  deletePersonImage
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  personIdValidation,
  handleValidationErrors,
  deleteOnePerson
);

export default router;
