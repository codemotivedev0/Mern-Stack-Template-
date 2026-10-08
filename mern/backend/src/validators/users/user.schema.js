import { z } from 'zod';
import { ROLES } from '../../models/user.model.js';
import { emailField, nameField, passwordField } from '../auth/auth.schema.js';

const roleField = z.enum(ROLES, { error: `Role must be one of: ${ROLES.join(', ')}` });

export const createUserSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  role: roleField.optional(),
});

// Every field optional, but at least one must be sent
export const updateUserSchema = z
  .object({
    name: nameField.optional(),
    email: emailField.optional(),
    role: roleField.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Send at least one of: name, email, role',
  });
