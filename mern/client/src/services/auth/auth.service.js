import { request } from '../api.js';

// The server sets/clears the httpOnly auth cookie. Each call resolves to
// { data: user, session: { expiresAt } } except logout.
// A 401 from these is an expected answer, not an expired session.
export const signupRequest = (payload) =>
  request('/auth/signup', { method: 'POST', body: payload, notifyUnauthorized: false });

export const loginRequest = (payload) =>
  request('/auth/login', { method: 'POST', body: payload, notifyUnauthorized: false });

export const logoutRequest = () =>
  request('/auth/logout', { method: 'POST', notifyUnauthorized: false });

export const getMeRequest = () => request('/auth/me', { notifyUnauthorized: false });
