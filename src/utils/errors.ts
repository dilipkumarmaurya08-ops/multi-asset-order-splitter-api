/**
 * Custom error classes for precise error handling
 * Follows error handling best practices for high-traffic applications
 */

import { HTTP_STATUS } from '../config/constants';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error for invalid input data
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      'VALIDATION_ERROR',
      true,
      details
    );
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Business logic error for invalid portfolio configuration
 */
export class InvalidPortfolioError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'INVALID_PORTFOLIO',
      true,
      details
    );
    Object.setPrototypeOf(this, InvalidPortfolioError.prototype);
  }
}

/**
 * Error when market is closed
 */
export class MarketClosedError extends AppError {
  constructor(message: string, nextAvailableTime?: string) {
    super(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'MARKET_CLOSED',
      true,
      { nextAvailableTime }
    );
    Object.setPrototypeOf(this, MarketClosedError.prototype);
  }
}

/**
 * Error when order is not found
 */
export class OrderNotFoundError extends AppError {
  constructor(orderId: string) {
    super(
      `Order with ID ${orderId} not found`,
      HTTP_STATUS.NOT_FOUND,
      'ORDER_NOT_FOUND',
      true,
      { orderId }
    );
    Object.setPrototypeOf(this, OrderNotFoundError.prototype);
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'CONFIGURATION_ERROR',
      true,
      details
    );
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

/**
 * Internal server error (non-operational)
 */
export class InternalError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR',
      false, // Not operational - indicates programming error
      details
    );
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}