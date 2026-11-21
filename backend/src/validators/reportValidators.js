import { z } from 'zod';
import { idSchema } from './commonValidators.js';

export const taskSummaryQuerySchema = z
  .object({
    assigneeId: idSchema.optional(),
  })
  .strict();
