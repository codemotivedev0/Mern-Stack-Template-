import { describe, expect, it } from 'vitest';
import { api, authHeader, createUser } from '../helpers.js';

describe('/api/users (admin only)', () => {
  it('requires a token', async () => {
    const res = await api().get('/api/users');
    expect(res.status).toBe(401);
  });

  it('forbids regular users', async () => {
    const { token } = await createUser();
    const res = await api().get('/api/users').set(authHeader(token));
    expect(res.status).toBe(403);
  });

  it('lets an admin list users without exposing passwords', async () => {
    const { token } = await createUser({ role: 'admin' });
    await createUser();

    const res = await api().get('/api/users').set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    res.body.data.forEach((user) => expect(user.password).toBeUndefined());
  });

  it('lets an admin create, update and delete a user', async () => {
    const { token } = await createUser({ role: 'admin' });

    const created = await api()
      .post('/api/users')
      .set(authHeader(token))
      .send({ name: 'New', email: 'new@example.com', password: 'secret123' });
    expect(created.status).toBe(201);

    const id = created.body.data._id;
    const updated = await api()
      .put(`/api/users/${id}`)
      .set(authHeader(token))
      .send({ role: 'admin' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.role).toBe('admin');

    const deleted = await api().delete(`/api/users/${id}`).set(authHeader(token));
    expect(deleted.status).toBe(200);
  });

  it('validates updates', async () => {
    const { token } = await createUser({ role: 'admin' });
    const { user } = await createUser();

    const badRole = await api()
      .put(`/api/users/${user._id}`)
      .set(authHeader(token))
      .send({ role: 'superuser' });
    const empty = await api().put(`/api/users/${user._id}`).set(authHeader(token)).send({});

    expect(badRole.status).toBe(400);
    expect(empty.status).toBe(400);
  });

  it('stops an admin deleting their own account', async () => {
    const { user, token } = await createUser({ role: 'admin' });
    const res = await api().delete(`/api/users/${user._id}`).set(authHeader(token));
    expect(res.status).toBe(400);
  });

  it('returns 404 for an unknown id and 400 for a malformed one', async () => {
    const { token } = await createUser({ role: 'admin' });

    const unknown = await api().get('/api/users/000000000000000000000000').set(authHeader(token));
    const malformed = await api().get('/api/users/123').set(authHeader(token));

    expect(unknown.status).toBe(404);
    expect(malformed.status).toBe(400);
  });
});
