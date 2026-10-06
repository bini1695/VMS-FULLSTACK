import express from 'express';
import {
  registerOwnerAndPet,
  checkInPatient,
  getDailyQueue,
  updateQueueStatus,
} from '../controllers/receptionController.js';
import { validate } from '../middlewares/validate.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  registerOwnerPetSchema,
  checkInSchema,
  updateQueueStatusSchema,
} from '../validators/receptionValidator.js';

const router = express.Router();

router.use(authenticateToken);

// POST /api/v1/reception/register-owner-pet -> One-step registration
router.post(
  '/register-owner-pet',
  authorizeRoles('Receptionist', 'System administrator'),
  validate(registerOwnerPetSchema),
  registerOwnerAndPet
);

// POST /api/v1/reception/check-in -> Arrive patient into queue
router.post(
  '/check-in',
  authorizeRoles('Receptionist', 'System administrator'),
  validate(checkInSchema),
  checkInPatient
);

// GET /api/v1/reception/queue -> View active waiting room queue
router.get(
  '/queue',
  authorizeRoles('Receptionist', 'Veterinarian', 'System administrator'),
  getDailyQueue
);

// PATCH /api/v1/reception/queue/:id/status -> Transition patient status
router.patch(
  '/queue/:id/status',
  authorizeRoles('Receptionist', 'Veterinarian', 'System administrator'),
  validate(updateQueueStatusSchema),
  updateQueueStatus
);

export default router;