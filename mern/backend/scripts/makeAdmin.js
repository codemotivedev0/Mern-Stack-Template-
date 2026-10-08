// Promotes an existing user to admin. Signup always creates regular users,
// so this is how the first admin gets made.
//   npm run make-admin -- you@example.com
import mongoose from 'mongoose';
import env from '../src/config/env.js';
import User from '../src/models/user.model.js';

const email = process.argv[2]?.toLowerCase().trim();

if (!email) {
  console.error('Usage: npm run make-admin -- <email>');
  process.exit(1);
}

await mongoose.connect(env.mongoUri);

const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { returnDocument: 'after' });

if (user) {
  console.log(`${user.email} is now an admin`);
} else {
  console.error(`No user found with email ${email}`);
  process.exitCode = 1;
}

await mongoose.disconnect();
