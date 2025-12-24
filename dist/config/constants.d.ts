/**
 * Application-wide constants
 * Centralized configuration for all constant values
 */
export declare const APP_CONFIG: {
    readonly PORT: string | 3000;
    readonly NODE_ENV: string;
    readonly API_VERSION: "v1";
    readonly API_PREFIX: "/api/v1";
};
export declare const ORDER_CONFIG: {
    readonly DEFAULT_ASSET_PRICE: 100;
    readonly DEFAULT_DECIMAL_PRECISION: 3;
    readonly MIN_DECIMAL_PRECISION: 0;
    readonly MAX_DECIMAL_PRECISION: 10;
    readonly MIN_ORDER_AMOUNT: 0.01;
    readonly MAX_ORDER_AMOUNT: 100000000;
    readonly MAX_ASSETS_PER_PORTFOLIO: 200;
};
export declare const MARKET_CONFIG: {
    readonly TIMEZONE: "America/New_York";
    readonly MARKET_OPEN_HOUR: 9;
    readonly MARKET_OPEN_MINUTE: 30;
    readonly MARKET_CLOSE_HOUR: 16;
    readonly MARKET_CLOSE_MINUTE: 0;
    readonly TRADING_DAYS: readonly [1, 2, 3, 4, 5];
};
export declare const RATE_LIMIT_CONFIG: {
    readonly WINDOW_MS: number;
    readonly MAX_REQUESTS: 10000;
    readonly MESSAGE: "Too many requests from this IP, please try again later.";
    readonly SKIP_SUCCESSFUL_REQUESTS: false;
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const ORDER_TYPES: {
    readonly BUY: "BUY";
    readonly SELL: "SELL";
};
/**
 * Supported asset types for multi-asset portfolios
 */
export declare const ASSET_TYPES: {
    readonly STOCK: "stock";
    readonly ETF: "etf";
    readonly CRYPTO: "crypto";
    readonly COMMODITY: "commodity";
    readonly BOND: "bond";
    readonly MUTUAL_FUND: "mutual_fund";
};
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INVALID_PORTFOLIO: "INVALID_PORTFOLIO";
    readonly INVALID_ORDER_TYPE: "INVALID_ORDER_TYPE";
    readonly INVALID_AMOUNT: "INVALID_AMOUNT";
    readonly INVALID_PRICE: "INVALID_PRICE";
    readonly INVALID_ALLOCATION: "INVALID_ALLOCATION";
    readonly INVALID_ASSET_TYPE: "INVALID_ASSET_TYPE";
    readonly MARKET_CLOSED: "MARKET_CLOSED";
    readonly ORDER_NOT_FOUND: "ORDER_NOT_FOUND";
    readonly CONFIGURATION_ERROR: "CONFIGURATION_ERROR";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
};
export declare const LOG_LEVELS: {
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly DEBUG: "debug";
};
/**
 * Cache configuration for high-performance scenarios
 */
export declare const CACHE_CONFIG: {
    readonly MARKET_STATUS_TTL: 60;
    readonly CONFIG_TTL: 300;
    readonly ENABLE_CACHING: true;
};
//# sourceMappingURL=constants.d.ts.map