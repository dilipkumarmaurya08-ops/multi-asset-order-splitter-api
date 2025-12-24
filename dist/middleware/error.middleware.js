"use strict";
/**
 * Global error handling middleware
 * Provides consistent error responses and logging
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const constants_1 = require("../config/constants");
const logger_1 = require("../utils/logger");
/**
 * Global error handler - must be last middleware
 */
const errorMiddleware = (err, req, res, _next) => {
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        handleZodError(err, req, res);
        return;
    }
    // Application errors
    if (err instanceof errors_1.AppError) {
        handleAppError(err, req, res);
        return;
    }
    // Unknown errors (programming errors)
    handleUnknownError(err, req, res);
};
exports.errorMiddleware = errorMiddleware;
/**
 * Handles Zod validation errors
 */
function handleZodError(err, req, res) {
    const errors = err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
    }));
    logger_1.logger.warn('Validation error', {
        method: req.method,
        path: req.path,
        errors,
    });
    const response = {
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
    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json(response);
}
/**
 * Handles application errors
 */
function handleAppError(err, req, res) {
    // Log based on severity
    if (err.isOperational) {
        logger_1.logger.warn('Operational error', {
            code: err.code,
            message: err.message,
            method: req.method,
            path: req.path,
            details: err.details,
        });
    }
    else {
        logger_1.logger.error('Non-operational error', err, {
            method: req.method,
            path: req.path,
            details: err.details,
        });
    }
    const response = {
        success: false,
        error: {
            code: err.code,
            message: err.message,
            details: constants_1.APP_CONFIG.NODE_ENV === 'development' ? err.details : undefined,
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
function handleUnknownError(err, req, res) {
    logger_1.logger.error('Unexpected error', err, {
        method: req.method,
        path: req.path,
        body: req.body,
    });
    const response = {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
            details: constants_1.APP_CONFIG.NODE_ENV === 'development' ? {
                message: err.message,
                stack: err.stack,
            } : undefined,
        },
        metadata: {
            timestamp: new Date().toISOString(),
            processingTimeMs: req.startTime ? Date.now() - req.startTime : undefined,
        },
    };
    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
}
/**
 * Catches async errors in route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.middleware.js.map