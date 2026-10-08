import { MongoMemoryServer } from 'mongodb-memory-server';

// One in-memory MongoDB for the whole run. Starting one per test file makes
// the parallel workers race for the same downloaded binary.
export default async function setup({ provide }) {
  const mongo = await MongoMemoryServer.create();
  provide('mongoUri', mongo.getUri());

  return async () => {
    await mongo.stop();
  };
}
