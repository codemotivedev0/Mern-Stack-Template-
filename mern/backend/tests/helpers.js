import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/user.model.js';
import { AUTH_COOKIE } from '../src/utils/auth/authCookie.js';

export const api = () => request(app);

// Raw "access_token=..." Set-Cookie header from a response, or undefined
export const getAuthCookie = (res) =>
  (res.headers['set-cookie'] || []).find((cookie) => cookie.startsWith(`${AUTH_COOKIE}=`));

// The JWT inside the auth cookie
export const getTokenFromResponse = (res) =>
  getAuthCookie(res)
    ?.split(';')[0]
    .slice(AUTH_COOKIE.length + 1);

let counter = 0;

// Signs up a fresh user through the API and returns { user, token }.
// Pass role: 'admin' to promote them straight away.
export const createUser = async ({ role, ...overrides } = {}) => {
  counter += 1;
  const res = await api()
    .post('/api/auth/signup')
    .send({
      name: `Test User ${counter}`,
      email: `user${counter}@example.com`,
      password: 'secret123',
      ...overrides,
    });

  let user = res.body.data;
  if (role) {
    user = (await User.findByIdAndUpdate(user._id, { role }, { returnDocument: 'after' })).toJSON();
  }
  return { user, token: getTokenFromResponse(res) };
};

// Most tests authenticate with the Bearer header for brevity; cookie
// behaviour has its own tests in tests/auth/session.test.js
export const authHeader = (token) => ({ Authorization: `Bearer ${token}` });
