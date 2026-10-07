import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import {
  listInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice,
} from '../controllers/invoiceController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/',    listInvoices);
router.get('/:id', getInvoice);

router.post('/',
  authorizeRoles('admin', 'receptionist', 'veterinarian'),
  createInvoice
);

router.put('/:id',
  authorizeRoles('admin', 'receptionist'),
  updateInvoice
);

router.delete('/:id',
  authorizeRoles('admin'),
  deleteInvoice
);

export default router;