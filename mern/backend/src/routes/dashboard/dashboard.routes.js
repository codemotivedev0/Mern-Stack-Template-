import { Router } from 'express';
import { getDashboard } from '../../controllers/dashboard/dashboard.controller.js';
import protect from '../../middleware/auth/protect.js';

const router = Router();

// Every dashboard route requires a logged-in user
router.use(protect);

router.get('/', getDashboard);

export default router;
