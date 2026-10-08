import User from '../../models/user.model.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// GET /api/dashboard (protected)
export const getDashboard = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const daysAsMember = Math.floor((Date.now() - req.user.createdAt) / DAY_MS);

  res.json({
    success: true,
    data: {
      user: req.user,
      stats: {
        totalUsers,
        daysAsMember,
        memberSince: req.user.createdAt,
      },
      session: { expiresAt: req.auth.expiresAt },
    },
  });
};
