import { AppError } from '../utils/AppError.js';

const SOURCES = ['body', 'query', 'params'];

const toFieldErrors = (issues) =>
  issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));

/**
 * Validates body, query and params against zod schemas.
 * Parsed (coerced and normalised) values are exposed as req.validated.
 */
export function validateRequest(schemas) {
  return (req, _res, next) => {
    const validated = {};
    for (const source of SOURCES) {
      const schema = schemas[source];
      if (schema === undefined) {
        continue;
      }
      const result = schema.safeParse(req[source] ?? {});
      if (!result.success) {
        return next(AppError.badRequest(undefined, toFieldErrors(result.error.issues)));
      }
      validated[source] = result.data;
    }
    req.validated = validated;
    next();
  };
}
