import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

// All routes require a valid JWT
router.use(authenticateToken);

router.get('/',     listAppointments);
router.get('/:id',  getAppointment);

router.post('/',
  authorizeRoles('System administrator', 'Receptionist', 'Veterinarian'),
  createAppointment
);

router.put('/:id',
  authorizeRoles('System administrator', 'Receptionist', 'Veterinarian'),
  updateAppointment
);

router.delete('/:id',
  authorizeRoles('System administrator', 'Receptionist'),
  deleteAppointment
);

export default router;