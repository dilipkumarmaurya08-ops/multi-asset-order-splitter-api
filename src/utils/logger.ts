/**
 * Structured logging utility for production monitoring
 * Supports different log levels and performance tracking
 */

import { LOG_LEVELS, APP_CONFIG } from '../config/constants';

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

interface LogContext {
  [key: string]: unknown;
}

/**
 * Production-grade logger with structured output
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = APP_CONFIG.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...(context && { context }),
      environment: APP_CONFIG.NODE_ENV,
    };

    // In production, use JSON for log aggregation systems
    if (!this.isDevelopment) {
      return JSON.stringify(logData);
    }

    // In development, use human-readable format
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };
    console.error(this.formatMessage(LOG_LEVELS.ERROR, message, errorContext));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LOG_LEVELS.WARN, message, context));
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage(LOG_LEVELS.INFO, message, context));
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LOG_LEVELS.DEBUG, message, context));
    }
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, durationMs: number, context?: LogContext): void {
    this.info(`Performance: ${operation}`, {
      durationMs,
      ...context,
    });
  }

  /**
   * Log API request/response
   */
  http(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    context?: LogContext
  ): void {
    const level =
      statusCode >= 500 ? LOG_LEVELS.ERROR : statusCode >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;

    const message = `${method} ${path} ${statusCode} - ${durationMs}ms`;

    if (level === LOG_LEVELS.ERROR) {
      this.error(message, undefined, context);
    } else if (level === LOG_LEVELS.WARN) {
      this.warn(message, context);
    } else {
      this.info(message, context);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
