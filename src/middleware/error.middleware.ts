/**
 * Global error handling middleware
 * Provides consistent error responses and logging
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { HTTP_STATUS, APP_CONFIG } from '../config/constants';
import { ApiResponse } from '../models/order.model';
import { logger } from '../utils/logger';

/**
 * Global error handler - must be last middleware
 */
export const errorMiddleware = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Zod validation errors
  if (err instanceof ZodError) {
    handleZodError(err, req, res);
    return;
  }

  // Application errors
  if (err instanceof AppError) {
    handleAppError(err, req, res);
    return;
  }

  // Unknown errors (programming errors)
  handleUnknownError(err, req, res);
};

/**
 * Handles Zod validation errors
 */
function handleZodError(err: ZodError, req: Request, res: Response): void {
  const errors = err.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message,
  }));

  logger.warn('Validation error', {
    method: req.method,
    path: req.path,
    errors,
  });

  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: errors,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      processingTimeMs: req.startTime ? Date.now() - req.startTime : undefined,
    },
  };

  res.status(HTTP_STATUS.BAD_REQUEST).json(response);
}

/**
 * Handles application errors
 */
function handleAppError(err: AppError, req: Request, res: Response): void {
  // Log based on severity
  if (err.isOperational) {
    logger.warn('Operational error', {
      code: err.code,
      message: err.message,
      method: req.method,
      path: req.path,
      details: err.details,
    });
  } else {
    logger.error('Non-operational error', err, {
      method: req.method,
      path: req.path,
      details: err.details,
    });
  }

  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: err.code,
      message: err.message,
      details: APP_CONFIG.NODE_ENV === 'development' ? err.details : undefined,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      processingTimeMs: req.startTime ? Date.now() - req.startTime : undefined,
    },
  };

  res.status(err.statusCode).json(response);
}

/**
 * Handles unknown/unexpected errors
 */
function handleUnknownError(err: Error, req: Request, res: Response): void {
  logger.error('Unexpected error', err, {
    method: req.method,
    path: req.path,
    body: req.body,
  });

  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: APP_CONFIG.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack,
      } : undefined,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      processingTimeMs: req.startTime ? Date.now() - req.startTime : undefined,
    },
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
}

/**
 * Catches async errors in route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};