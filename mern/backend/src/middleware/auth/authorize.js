import ApiError from '../../utils/ApiError.js';

// Use after protect: router.use(protect, authorize('admin'))
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to do this');
    }
    next();
  };

export default authorize;
