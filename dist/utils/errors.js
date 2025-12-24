"use strict";
/**
 * Custom error classes for precise error handling
 * Follows error handling best practices for high-traffic applications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.ConfigurationError = exports.OrderNotFoundError = exports.MarketClosedError = exports.InvalidPortfolioError = exports.ValidationError = exports.AppError = void 0;
const constants_1 = require("../config/constants");
/**
 * Base application error class
 */
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    details;
    constructor(message, statusCode, code, isOperational = true, details) {
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
exports.AppError = AppError;
/**
 * Validation error for invalid input data
 */
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, constants_1.HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', true, details);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
/**
 * Business logic error for invalid portfolio configuration
 */
class InvalidPortfolioError extends AppError {
    constructor(message, details) {
        super(message, constants_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, 'INVALID_PORTFOLIO', true, details);
        Object.setPrototypeOf(this, InvalidPortfolioError.prototype);
    }
}
exports.InvalidPortfolioError = InvalidPortfolioError;
/**
 * Error when market is closed
 */
class MarketClosedError extends AppError {
    constructor(message, nextAvailableTime) {
        super(message, constants_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, 'MARKET_CLOSED', true, { nextAvailableTime });
        Object.setPrototypeOf(this, MarketClosedError.prototype);
    }
}
exports.MarketClosedError = MarketClosedError;
/**
 * Error when order is not found
 */
class OrderNotFoundError extends AppError {
    constructor(orderId) {
        super(`Order with ID ${orderId} not found`, constants_1.HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND', true, { orderId });
        Object.setPrototypeOf(this, OrderNotFoundError.prototype);
    }
}
exports.OrderNotFoundError = OrderNotFoundError;
/**
 * Configuration error
 */
class ConfigurationError extends AppError {
    constructor(message, details) {
        super(message, constants_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, 'CONFIGURATION_ERROR', true, details);
        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }
}
exports.ConfigurationError = ConfigurationError;
/**
 * Internal server error (non-operational)
 */
class InternalError extends AppError {
    constructor(message, details) {
        super(message, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR', false, // Not operational - indicates programming error
        details);
        Object.setPrototypeOf(this, InternalError.prototype);
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=errors.js.map