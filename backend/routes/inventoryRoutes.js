import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { listInventory } from '../controllers/inventoryController.js';

const router = express.Router();
router.use(authenticateToken);
router.get('/', listInventory);

export default router;