import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(3, 'Name is required').max(255),
  email: z.string().email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(255)
    .optional(),
  email: z.string().email().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255)
    .optional(),
});
