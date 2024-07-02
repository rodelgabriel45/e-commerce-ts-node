import { z } from 'zod';

export const addressSchema = z.object({
  lineOne: z
    .string({ required_error: 'Main Address is required' })
    .min(10)
    .max(255),
  lineTwo: z.string().min(7).max(255).optional(),
  city: z.string({ required_error: 'City is required' }).min(2).max(50),
  country: z.string({ required_error: 'Country is required' }).min(2).max(255),
  postalCode: z
    .string({ required_error: 'Postal Code is required' })
    .min(4)
    .max(20),
});
