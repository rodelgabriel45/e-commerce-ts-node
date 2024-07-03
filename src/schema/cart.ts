import { z } from 'zod';

export const cartSchema = z.object({
  productId: z.number({
    invalid_type_error: 'Product ID must be a valid product id number',
    required_error: 'Product ID is required',
  }),
  quantity: z.number({
    invalid_type_error: 'Quantity must be a number',
    required_error: 'Quantity is required',
  }),
});

export const changeQuantitySchema = z.object({
  quantity: z.number({
    invalid_type_error: 'Quantity must be a number',
    required_error: 'Quantity is required',
  }),
});
