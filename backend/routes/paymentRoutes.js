import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listPayments,
  createPayment,
  deletePayment,
} from '../controllers/paymentController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', listPayments);

router.post('/',
  authorizeRoles('admin', 'receptionist', 'pharmacist'),
  createPayment
);

router.delete('/:id',
  authorizeRoles('admin', 'receptionist'),
  deletePayment
);

export default router;