/**
 * Validation middleware using Zod schemas
 * Provides type-safe request validation
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Validates request body against a Zod schema
 */
export declare const validateBody: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Validates request query parameters against a Zod schema
 */
export declare const validateQuery: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Validates request params against a Zod schema
 */
export declare const validateParams: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.middleware.d.ts.map