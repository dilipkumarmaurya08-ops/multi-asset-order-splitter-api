/**
 * Validation middleware using Zod schemas
 * Provides type-safe request validation
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { parseNumber } from '../utils/helpers';

/**
 * Validates request body against a Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validates request query parameters against a Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Convert query string values to appropriate types
      const parsedQuery = parseQueryParams(req.query);
      req.query = schema.parse(parsedQuery) as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validates request params against a Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Parses query parameters to correct types
 */
function parseQueryParams(query: any): any {
  const parsed: any = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Try to parse as number
    const numValue = parseNumber(value);
    if (numValue !== null) {
      parsed[key] = numValue;
      continue;
    }

    // Keep as string
    parsed[key] = value;
  }

  return parsed;
}
