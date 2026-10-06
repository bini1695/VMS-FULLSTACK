import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listConsultations, getConsultation, createConsultation, updateConsultation,
} from '../controllers/consultationController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/',    listConsultations);
router.get('/:id', getConsultation);
router.post('/',   authorizeRoles('admin', 'veterinarian'), createConsultation);
router.put('/:id', authorizeRoles('admin', 'veterinarian'), updateConsultation);

export default router;