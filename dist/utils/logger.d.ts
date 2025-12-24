/**
 * Structured logging utility for production monitoring
 * Supports different log levels and performance tracking
 */
interface LogContext {
    [key: string]: unknown;
}
/**
 * Production-grade logger with structured output
 */
declare class Logger {
    private isDevelopment;
    constructor();
    private formatMessage;
    error(message: string, error?: Error | unknown, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
    /**
     * Log performance metrics
     */
    performance(operation: string, durationMs: number, context?: LogContext): void;
    /**
     * Log API request/response
     */
    http(method: string, path: string, statusCode: number, durationMs: number, context?: LogContext): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map