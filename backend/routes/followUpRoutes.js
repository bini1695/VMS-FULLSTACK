import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listFollowUps, getFollowUp, createFollowUp, updateFollowUp, deleteFollowUp,
} from '../controllers/followUpController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/',    listFollowUps);
router.get('/:id', getFollowUp);
router.post('/',   authorizeRoles('admin', 'veterinarian', 'receptionist'), createFollowUp);
router.put('/:id', authorizeRoles('admin', 'veterinarian', 'receptionist'), updateFollowUp);
router.delete('/:id', authorizeRoles('admin'), deleteFollowUp);

export default router;