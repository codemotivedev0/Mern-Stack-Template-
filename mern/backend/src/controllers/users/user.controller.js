import User from '../../models/user.model.js';
import ApiError from '../../utils/ApiError.js';

// All routes here are admin only (see routes/users/user.routes.js)

// GET /api/users
export const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
};

// GET /api/users/:id
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
};

// POST /api/users
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ success: true, data: user });
};

// PUT /api/users/:id
// Passwords are not changed here: findByIdAndUpdate skips the hashing hook
export const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { returnDocument: 'after', runValidators: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, 'You cannot delete your own account here');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, message: 'User deleted' });
};
