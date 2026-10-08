import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./tests/globalSetup.js'],
    setupFiles: ['./tests/setup.js'],
    // These win over backend/.env, so tests never touch the real database.
    // The real connection string is replaced by an in-memory MongoDB in setup.js.
    env: {
      NODE_ENV: 'test',
      MONGO_URI: 'mongodb://in-memory-test-db',
      JWT_SECRET: 'test-secret-that-is-at-least-32-characters-long',
      JWT_EXPIRES_IN: '1h',
    },
    // The first run downloads a MongoDB binary
    hookTimeout: 120_000,
  },
});
