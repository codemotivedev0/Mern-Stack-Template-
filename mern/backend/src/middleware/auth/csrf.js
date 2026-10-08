import ApiError from '../../utils/ApiError.js';
import { AUTH_COOKIE } from '../../utils/auth/authCookie.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
export const CSRF_HEADER = 'X-Requested-With';

// Cookies are sent automatically, so a malicious site could try to submit
// requests on a logged-in user's behalf (CSRF). Requiring a custom header on
// state-changing requests stops that: other sites can't set custom headers
// without passing CORS, which only allows CLIENT_URL.
// Requests authenticated with a Bearer header aren't affected.
const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method) || !req.cookies?.[AUTH_COOKIE]) return next();

  if (!req.get(CSRF_HEADER)) {
    throw new ApiError(403, `Missing ${CSRF_HEADER} header`);
  }
  next();
};

export default csrfProtection;
