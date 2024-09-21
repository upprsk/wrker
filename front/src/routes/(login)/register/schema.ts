import { z } from 'zod';

export const zRegisterSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  password: z.string().min(1),
  passwordConfirm: z.string().min(1),
});

export type RegisterSchema = typeof zRegisterSchema;
