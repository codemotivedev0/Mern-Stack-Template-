import { Router } from 'express';
import userRoutes from './users/user.routes.js';
import authRoutes from './auth/auth.routes.js';
import dashboardRoutes from './dashboard/dashboard.routes.js';

const router = Router();

// Register each resource here
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
