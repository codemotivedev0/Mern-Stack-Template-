import { z } from 'zod';

// Shared field rules, reused by the users validators
export const nameField = z
  .string({ error: 'Name is required' })
  .trim()
  .min(1, 'Name is required')
  .max(50, 'Name must be at most 50 characters');

export const emailField = z
  .string({ error: 'Email is required' })
  .trim()
  .toLowerCase()
  .pipe(z.email('Please provide a valid email'));

export const passwordField = z
  .string({ error: 'Password is required' })
  .min(6, 'Password must be at least 6 characters')
  .max(72, 'Password must be at most 72 characters'); // bcrypt only uses the first 72 bytes

export const signupSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
});
