import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/users/user.controller.js';
import protect from '../../middleware/auth/protect.js';
import authorize from '../../middleware/auth/authorize.js';
import validate from '../../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../../validators/users/user.schema.js';

const router = Router();

// User management is admin only
router.use(protect, authorize('admin'));

router.route('/').get(getUsers).post(validate(createUserSchema), createUser);
router.route('/:id').get(getUser).put(validate(updateUserSchema), updateUser).delete(deleteUser);

export default router;
