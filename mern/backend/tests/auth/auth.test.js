import { describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import User from '../../src/models/user.model.js';
import { api, authHeader, createUser, getTokenFromResponse } from '../helpers.js';

describe('POST /api/auth/signup', () => {
  it('creates a user, hashes the password and starts a cookie session', async () => {
    const res = await api()
      .post('/api/auth/signup')
      .send({ name: ' Jane Doe ', email: ' Jane@Example.com ', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(getTokenFromResponse(res)).toBeTypeOf('string');
    expect(res.body.token).toBeUndefined();
    expect(res.body.session.expiresAt).toBeTypeOf('string');
    expect(res.body.data).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'user',
    });
    expect(res.body.data.password).toBeUndefined();

    const stored = await User.findOne({ email: 'jane@example.com' }).select('+password');
    expect(stored.password).toMatch(/^\$2[aby]\$10\$/);
    expect(stored.password).not.toBe('secret123');
  });

  it('ignores a role sent by the client', async () => {
    const res = await api()
      .post('/api/auth/signup')
      .send({ name: 'Eve', email: 'eve@example.com', password: 'secret123', role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('user');
  });

  it('rejects a duplicate email', async () => {
    await createUser({ email: 'taken@example.com' });
    const res = await api()
      .post('/api/auth/signup')
      .send({ name: 'X', email: 'TAKEN@example.com', password: 'secret123' });

    expect(res.status).toBe(409);
  });

  it.each([
    [{}, 'Name is required'],
    [{ name: 'X', email: 'not-an-email', password: 'secret123' }, 'valid email'],
    [{ name: 'X', email: 'x@example.com', password: '123' }, 'at least 6 characters'],
  ])('rejects invalid input %#', async (body, message) => {
    const res = await api().post('/api/auth/signup').send(body);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain(message);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with the right password', async () => {
    const { user } = await createUser({ email: 'login@example.com' });
    const res = await api()
      .post('/api/auth/login')
      .send({ email: 'LOGIN@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(user._id);
    expect(jwt.decode(getTokenFromResponse(res)).id).toBe(user._id);
  });

  it('gives the same error for a wrong password and an unknown email', async () => {
    await createUser({ email: 'login@example.com' });

    const wrongPassword = await api()
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'wrong-password' });
    const unknownEmail = await api()
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong-password' });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
  });

  it('rejects NoSQL injection payloads', async () => {
    await createUser();
    const res = await api()
      .post('/api/auth/login')
      .send({ email: { $gt: '' }, password: { $gt: '' } });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user for a valid token', async () => {
    const { user, token } = await createUser();
    const res = await api().get('/api/auth/me').set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(user.email);
  });

  it('rejects a missing, invalid or expired token', async () => {
    const { user } = await createUser();
    const expired = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: -10 });

    const missing = await api().get('/api/auth/me');
    const invalid = await api().get('/api/auth/me').set(authHeader('not-a-jwt'));
    const old = await api().get('/api/auth/me').set(authHeader(expired));

    expect(missing.status).toBe(401);
    expect(invalid.status).toBe(401);
    expect(old.status).toBe(401);
    expect(old.body.message).toMatch(/expired/i);
  });

  it('rejects a token for a deleted user', async () => {
    const { user, token } = await createUser();
    await User.findByIdAndDelete(user._id);

    const res = await api().get('/api/auth/me').set(authHeader(token));
    expect(res.status).toBe(401);
  });
});
