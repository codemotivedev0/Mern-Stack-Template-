import { describe, expect, it } from 'vitest';
import { api, authHeader, createUser } from '../helpers.js';

describe('GET /api/dashboard', () => {
  it('requires a token', async () => {
    const res = await api().get('/api/dashboard');
    expect(res.status).toBe(401);
  });

  it('returns the user and stats', async () => {
    const { user, token } = await createUser();
    await createUser();

    const res = await api().get('/api/dashboard').set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.stats).toMatchObject({ totalUsers: 2, daysAsMember: 0 });
  });
});
