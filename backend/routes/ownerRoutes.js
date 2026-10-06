import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner,
} from '../controllers/ownerController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/',    listOwners);
router.get('/:id', getOwner);

router.post('/',
  authorizeRoles('admin', 'receptionist', 'veterinarian'),
  createOwner
);

router.put('/:id',
  authorizeRoles('admin', 'receptionist', 'veterinarian'),
  updateOwner
);

router.delete('/:id',
  authorizeRoles('admin'),
  deleteOwner
);

export default router;