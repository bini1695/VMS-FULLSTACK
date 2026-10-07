import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listRequisitions, getRequisition, createRequisition, updateRequisition,
  listFindings, createFinding,
} from '../controllers/labController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/requisitions',     listRequisitions);
router.get('/requisitions/:id', getRequisition);
router.post('/requisitions',    authorizeRoles('admin', 'veterinarian', 'lab'), createRequisition);
router.put('/requisitions/:id', authorizeRoles('admin', 'veterinarian', 'lab'), updateRequisition);

router.get('/findings',  listFindings);
router.post('/findings', authorizeRoles('admin', 'lab'), createFinding);

export default router;