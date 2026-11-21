import { z } from 'zod';

export const idSchema = z.coerce.number().int().positive();

export const idParamsSchema = z.object({ id: idSchema }).strict();

/** Accepts any ISO 8601 date-time with an offset and normalises it to UTC. */
export const isoDateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .transform((value) => new Date(value).toISOString());
