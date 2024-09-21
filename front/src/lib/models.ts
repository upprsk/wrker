import { z } from 'zod';

export const zModelBase = z.object({
  id: z.string(),
  created: z.string(),
  updated: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
});

export const zErrorDataItemSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const zErrorSchema = z.object({
  code: z.number().int(),
  message: z.string(),
});

export const zMakeErrorDataSchema = <T extends z.ZodTypeAny>(keys: T) =>
  zErrorSchema.extend({
    data: z.record(keys, zErrorDataItemSchema),
  });

export const zUserSchema = zModelBase.extend({
  username: z.string(),
  email: z.string().email().optional(),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
  fullName: z.string(),
  role: z.enum(['editor', 'viewer']),
});
