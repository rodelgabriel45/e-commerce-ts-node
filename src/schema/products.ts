import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Name is required').max(255),
  description: z
    .string({ required_error: 'Description is required' })
    .min(7, 'Description must be at least 7 characters'),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  tags: z.string().array().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3, 'Name is required').max(255).optional(),
  description: z
    .string({ required_error: 'Description is required' })
    .min(7, 'Description must be at least 7 characters')
    .optional(),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .optional(),
  tags: z.string().array().optional(),
});
