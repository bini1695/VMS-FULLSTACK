import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);

router.get('/me', authenticateToken, getProfile);

router.get('/vet-only', authenticateToken, authorizeRoles('Veterinarian'), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the Veterinarian workspace portal' });
});

export default router;
