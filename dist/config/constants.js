"use strict";
/**
 * Application-wide constants
 * Centralized configuration for all constant values
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_CONFIG = exports.LOG_LEVELS = exports.ERROR_CODES = exports.ASSET_TYPES = exports.ORDER_TYPES = exports.HTTP_STATUS = exports.RATE_LIMIT_CONFIG = exports.MARKET_CONFIG = exports.ORDER_CONFIG = exports.APP_CONFIG = void 0;
exports.APP_CONFIG = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_VERSION: 'v1',
    API_PREFIX: '/api/v1',
};
exports.ORDER_CONFIG = {
    DEFAULT_ASSET_PRICE: 100, // Fixed price in USD
    DEFAULT_DECIMAL_PRECISION: 3, // Default shares decimal places
    MIN_DECIMAL_PRECISION: 0,
    MAX_DECIMAL_PRECISION: 10,
    MIN_ORDER_AMOUNT: 0.01, // Minimum order amount in USD
    MAX_ORDER_AMOUNT: 100_000_000, // Maximum order amount in USD (100M for institutional)
    MAX_ASSETS_PER_PORTFOLIO: 200, // Increased for diversified portfolios
};
exports.MARKET_CONFIG = {
    TIMEZONE: 'America/New_York', // US Eastern Time
    MARKET_OPEN_HOUR: 9,
    MARKET_OPEN_MINUTE: 30,
    MARKET_CLOSE_HOUR: 16,
    MARKET_CLOSE_MINUTE: 0,
    TRADING_DAYS: [1, 2, 3, 4, 5], // Monday to Friday (1-5)
};
exports.RATE_LIMIT_CONFIG = {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 10000, // 10,000 requests per minute (high-traffic ready)
    MESSAGE: 'Too many requests from this IP, please try again later.',
    SKIP_SUCCESSFUL_REQUESTS: false, // Count all requests
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
exports.ORDER_TYPES = {
    BUY: 'BUY',
    SELL: 'SELL',
};
/**
 * Supported asset types for multi-asset portfolios
 */
exports.ASSET_TYPES = {
    STOCK: 'stock',
    ETF: 'etf',
    CRYPTO: 'crypto',
    COMMODITY: 'commodity',
    BOND: 'bond',
    MUTUAL_FUND: 'mutual_fund',
};
exports.ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_PORTFOLIO: 'INVALID_PORTFOLIO',
    INVALID_ORDER_TYPE: 'INVALID_ORDER_TYPE',
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_PRICE: 'INVALID_PRICE',
    INVALID_ALLOCATION: 'INVALID_ALLOCATION',
    INVALID_ASSET_TYPE: 'INVALID_ASSET_TYPE',
    MARKET_CLOSED: 'MARKET_CLOSED',
    ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
};
exports.LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
};
/**
 * Cache configuration for high-performance scenarios
 */
exports.CACHE_CONFIG = {
    MARKET_STATUS_TTL: 60, // Cache market status for 60 seconds
    CONFIG_TTL: 300, // Cache config for 5 minutes
    ENABLE_CACHING: true,
};
//# sourceMappingURL=constants.js.map