import * as z from 'zod';

export const ThreadValidation = z.object({
  thread: z.string().min(3, {
    message: 'Mininum of 3 characters',
  }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  comment: z.string(),
  //accountId: z.string(),
});
