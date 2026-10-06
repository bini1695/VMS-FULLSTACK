import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listPrescriptions, createPrescription, updatePrescription, getFormData,
} from '../controllers/prescriptionController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/form-data', getFormData);              // ← ADD THIS
router.get('/',    listPrescriptions);
router.post('/',   authorizeRoles('admin', 'veterinarian'), createPrescription);
router.put('/:id', authorizeRoles('admin', 'veterinarian', 'pharmacist'), updatePrescription);

export default router;