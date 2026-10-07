import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from '../controllers/animalController.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/',    listAnimals);
router.get('/:id', getAnimal);

router.post('/',
  authorizeRoles('admin', 'receptionist', 'veterinarian'),
  createAnimal
);

router.put('/:id',
  authorizeRoles('admin', 'receptionist', 'veterinarian'),
  updateAnimal
);

router.delete('/:id',
  authorizeRoles('admin', 'veterinarian'),
  deleteAnimal
);

export default router;