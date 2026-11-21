import { z } from 'zod';
import { TASK_PRIORITY, TASK_STATUS } from '../config/constants.js';
import { idSchema, isoDateTimeSchema } from './commonValidators.js';

const titleSchema = z.string().trim().min(1);
const descriptionSchema = z.string().nullable();
const prioritySchema = z.enum(Object.values(TASK_PRIORITY));
const statusSchema = z.enum(Object.values(TASK_STATUS));

export const taskCreateBodySchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema.optional(),
    priority: prioritySchema.optional(),
    dueDate: isoDateTimeSchema,
    assigneeId: idSchema.optional(),
  })
  .strict();

export const taskUpdateBodySchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    priority: prioritySchema.optional(),
    status: statusSchema.optional(),
    dueDate: isoDateTimeSchema.optional(),
    assigneeId: idSchema.optional(),
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field is required',
  });

const booleanQuerySchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

export const taskListQuerySchema = z
  .object({
    status: statusSchema.optional(),
    priority: prioritySchema.optional(),
    assigneeId: idSchema.optional(),
    isOverdue: booleanQuerySchema.optional(),
  })
  .strict();
