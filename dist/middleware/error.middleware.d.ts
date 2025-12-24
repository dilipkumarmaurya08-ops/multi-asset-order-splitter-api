/**
 * Global error handling middleware
 * Provides consistent error responses and logging
 */
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
/**
 * Global error handler - must be last middleware
 */
export declare const errorMiddleware: (err: Error | AppError | ZodError, req: Request, res: Response, _next: NextFunction) => void;
/**
 * Catches async errors in route handlers
 */
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map