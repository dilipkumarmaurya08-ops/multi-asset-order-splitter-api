/**
 * Custom error classes for precise error handling
 * Follows error handling best practices for high-traffic applications
 */
/**
 * Base application error class
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    readonly details?: unknown;
    constructor(message: string, statusCode: number, code: string, isOperational?: boolean, details?: unknown);
}
/**
 * Validation error for invalid input data
 */
export declare class ValidationError extends AppError {
    constructor(message: string, details?: unknown);
}
/**
 * Business logic error for invalid portfolio configuration
 */
export declare class InvalidPortfolioError extends AppError {
    constructor(message: string, details?: unknown);
}
/**
 * Error when market is closed
 */
export declare class MarketClosedError extends AppError {
    constructor(message: string, nextAvailableTime?: string);
}
/**
 * Error when order is not found
 */
export declare class OrderNotFoundError extends AppError {
    constructor(orderId: string);
}
/**
 * Configuration error
 */
export declare class ConfigurationError extends AppError {
    constructor(message: string, details?: unknown);
}
/**
 * Internal server error (non-operational)
 */
export declare class InternalError extends AppError {
    constructor(message: string, details?: unknown);
}
//# sourceMappingURL=errors.d.ts.map