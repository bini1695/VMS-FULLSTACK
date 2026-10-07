import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
  listMessages,
  createMessage,
  markRead,
  deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/',         listMessages);
router.post('/',        createMessage);
router.put('/:id/read', markRead);
router.delete('/:id',   deleteMessage);

export default router;