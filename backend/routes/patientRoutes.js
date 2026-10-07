import express from 'express';
import {
  createOwner,
  getOwners,
  createPatient,
  getPatients,
  getPatientById,
} from '../controllers/patientController.js';
import { validate } from '../middlewares/validate.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import { createOwnerSchema, createPatientSchema } from '../validators/patientValidator.js';

const router = express.Router();

router.use(authenticateToken);

// Register Owner
router.post(
  '/owners',
  authorizeRoles('Receptionist', 'System administrator'),
  validate(createOwnerSchema),
  createOwner
);

router.get(
  '/owners',
  authorizeRoles('Receptionist', 'Veterinarian', 'System administrator'),
  getOwners
);

// Register Patient (Pet)
router.post(
  '/',
  authorizeRoles('Receptionist', 'System administrator'),
  validate(createPatientSchema),
  createPatient
);

// Search & List Patients
router.get(
  '/',
  authorizeRoles('Receptionist', 'Veterinarian', 'System administrator'),
  getPatients
);

// Get Patient Details & History by ID
router.get(
  '/:id',
  authorizeRoles('Receptionist', 'Veterinarian', 'System administrator'),
  getPatientById
);

export default router;