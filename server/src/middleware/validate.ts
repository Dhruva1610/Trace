import type { Request, Response, NextFunction } from 'express'
import type { AnyZodObject } from 'zod'

interface ValidationSchemas {
  body?: AnyZodObject
  query?: AnyZodObject
  params?: AnyZodObject
}

export function validate(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body)
      }
      if (schemas.query) {
        const parsedQuery = await schemas.query.parseAsync(req.query)
        try {
          // Attempt direct assignment, fallback to Object.assign for getter-only environments (e.g. Express 5)
          req.query = parsedQuery as Record<string, string>
        } catch {
          Object.assign(req.query, parsedQuery)
        }
      }
      if (schemas.params) {
        const parsedParams = await schemas.params.parseAsync(req.params)
        try {
          req.params = parsedParams as Record<string, string>
        } catch {
          Object.assign(req.params, parsedParams)
        }
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
