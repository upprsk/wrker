import { z } from 'zod';

export const zLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginSchema = typeof zLoginSchema;
