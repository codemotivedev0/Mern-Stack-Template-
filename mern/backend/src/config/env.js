import 'dotenv/config';

// Every env var the app reads lives here, so a missing value stops the
// server at startup instead of failing on the first request that needs it.
const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(
    `Missing required environment variable(s): ${missing.join(', ')}\n` +
      'Copy backend/.env.example to backend/.env and fill them in.'
  );
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.warn('Warning: JWT_SECRET is shorter than 32 characters. Use a long random string.');
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Comma separated list of origins allowed by CORS
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  // Number of proxy hops to trust (0 = none), see app.js
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
};

env.isDev = env.nodeEnv === 'development';
env.isTest = env.nodeEnv === 'test';
env.isProd = env.nodeEnv === 'production';

// Auth cookie: 'lax' works when client and API share a site (same domain or
// subdomains). Use 'none' only for different sites; it requires HTTPS.
env.cookieSameSite = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
env.cookieSecure = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === 'true'
  : env.isProd || env.cookieSameSite === 'none';

if (!['lax', 'strict', 'none'].includes(env.cookieSameSite)) {
  console.error('COOKIE_SAMESITE must be one of: lax, strict, none');
  process.exit(1);
}
if (env.cookieSameSite === 'none' && !env.cookieSecure) {
  console.error('COOKIE_SAMESITE=none requires COOKIE_SECURE=true (HTTPS)');
  process.exit(1);
}

export default env;
