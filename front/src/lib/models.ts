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

const toDateTime = (d: string) => {
  const s = d.split(' ');
  if (s.length === 1) return s[0]

  const j = s.join('T')
  return j.slice(0, j.length - 1)
}

export const zPollSchema = zModelBase.extend({
  name: z.string(),
  owner: z.string(),
  description: z.any(),
  open: z.boolean(),
  closingDate: z.string().transform(toDateTime),
  // closingDate: z.string().transform(d => {
  //   const [date, time] = d.split(' ')
  //   console.log({ d, date, time })
  //
  //   return date + 'T' + time
  // }),
  audience: z.string().array(),
  anonymous: z.boolean(),
});

export const zPollQuestionSchema = zModelBase.extend({
  question: z.string(),
  poll: z.string(),
});

export const zPollAnswerSchema = zModelBase.extend({
  question: z.string(),
  user: z.string(),
  metadata: z.any(),
  answer: z.union([z.number(), z.string()]),
});
