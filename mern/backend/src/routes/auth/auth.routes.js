import { Router } from 'express';
import { signup, login, logout, getMe } from '../../controllers/auth/auth.controller.js';
import protect from '../../middleware/auth/protect.js';
import { authLimiter } from '../../middleware/auth/rateLimit.js';
import validate from '../../middleware/validate.js';
import { loginSchema, signupSchema } from '../../validators/auth/auth.schema.js';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
