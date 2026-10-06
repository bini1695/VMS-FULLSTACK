import express from 'express';
import {
  getInventory,
  addInventoryItem,
  createPrescription,
  dispensePrescription,
} from '../controllers/pharmacyController.js';
import { validate } from '../middlewares/validate.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import { createItemSchema, createPrescriptionSchema } from '../validators/pharmacyValidator.js';

const router = express.Router();

// Enforce JWT authentication on all pharmacy & inventory endpoints
router.use(authenticateToken);

/**
 * INVENTORY ENDPOINTS
 */

// GET /api/v1/pharmacy/inventory -> View stock levels (Supports ?low_stock=true)
router.get(
  '/inventory',
  authorizeRoles('Veterinarian', 'Receptionist', 'System administrator'),
  getInventory
);

// POST /api/v1/pharmacy/inventory -> Add new item/medication to inventory
router.post(
  '/inventory',
  authorizeRoles('System administrator'),
  validate(createItemSchema),
  addInventoryItem
);

/**
 * PRESCRIPTION & DISPENSING ENDPOINTS
 */

// POST /api/v1/pharmacy/prescriptions -> Issue a new patient prescription
router.post(
  '/prescriptions',
  authorizeRoles('Veterinarian', 'System administrator'),
  validate(createPrescriptionSchema),
  createPrescription
);

// PATCH /api/v1/pharmacy/prescriptions/:id/dispense -> Dispense medication & automatically deduct inventory
router.patch(
  '/prescriptions/:id/dispense',
  authorizeRoles('Veterinarian', 'Receptionist', 'System administrator'),
  dispensePrescription
);

export default router;