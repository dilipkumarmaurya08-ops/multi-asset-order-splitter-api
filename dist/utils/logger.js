"use strict";
/**
 * Structured logging utility for production monitoring
 * Supports different log levels and performance tracking
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const constants_1 = require("../config/constants");
/**
 * Production-grade logger with structured output
 */
class Logger {
    isDevelopment;
    constructor() {
        this.isDevelopment = constants_1.APP_CONFIG.NODE_ENV === 'development';
    }
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const logData = {
            timestamp,
            level,
            message,
            ...(context && { context }),
            environment: constants_1.APP_CONFIG.NODE_ENV,
        };
        // In production, use JSON for log aggregation systems
        if (!this.isDevelopment) {
            return JSON.stringify(logData);
        }
        // In development, use human-readable format
        const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
    }
    error(message, error, context) {
        const errorContext = {
            ...context,
            ...(error instanceof Error && {
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
            }),
        };
        console.error(this.formatMessage(constants_1.LOG_LEVELS.ERROR, message, errorContext));
    }
    warn(message, context) {
        console.warn(this.formatMessage(constants_1.LOG_LEVELS.WARN, message, context));
    }
    info(message, context) {
        console.info(this.formatMessage(constants_1.LOG_LEVELS.INFO, message, context));
    }
    debug(message, context) {
        if (this.isDevelopment) {
            console.debug(this.formatMessage(constants_1.LOG_LEVELS.DEBUG, message, context));
        }
    }
    /**
     * Log performance metrics
     */
    performance(operation, durationMs, context) {
        this.info(`Performance: ${operation}`, {
            durationMs,
            ...context,
        });
    }
    /**
     * Log API request/response
     */
    http(method, path, statusCode, durationMs, context) {
        const level = statusCode >= 500 ? constants_1.LOG_LEVELS.ERROR : statusCode >= 400 ? constants_1.LOG_LEVELS.WARN : constants_1.LOG_LEVELS.INFO;
        const message = `${method} ${path} ${statusCode} - ${durationMs}ms`;
        if (level === constants_1.LOG_LEVELS.ERROR) {
            this.error(message, undefined, context);
        }
        else if (level === constants_1.LOG_LEVELS.WARN) {
            this.warn(message, context);
        }
        else {
            this.info(message, context);
        }
    }
}
// Export singleton instance
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map