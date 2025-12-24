"use strict";
/**
 * Express application configuration
 * Optimized for high-traffic scenarios (1M+ requests)
 * Sets up middleware, routes, and error handling
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const constants_1 = require("./config/constants");
const performance_middleware_1 = require("./middleware/performance.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
/**
 * Creates and configures Express application
 * Optimized for extreme high traffic
 */
function createApp() {
    const app = (0, express_1.default)();
    // ============================================================================
    // Performance Optimizations
    // ============================================================================
    // Disable unnecessary features for performance
    app.disable('x-powered-by');
    app.disable('etag'); // Disable if not using caching
    // Set production mode
    app.set('env', constants_1.APP_CONFIG.NODE_ENV);
    // Trust proxy for rate limiting behind load balancer
    app.set('trust proxy', 1);
    // ============================================================================
    // Security Middleware
    // ============================================================================
    // Helmet for security headers
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false, // Disable if causing issues
        crossOriginEmbedderPolicy: false,
    }));
    // CORS configuration
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400, // 24 hours
    }));
    // Rate limiting (high-traffic ready: 10,000 req/min per IP)
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: constants_1.RATE_LIMIT_CONFIG.WINDOW_MS,
        max: constants_1.RATE_LIMIT_CONFIG.MAX_REQUESTS,
        message: constants_1.RATE_LIMIT_CONFIG.MESSAGE,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: constants_1.RATE_LIMIT_CONFIG.SKIP_SUCCESSFUL_REQUESTS,
        // Skip rate limit in development
        skip: () => constants_1.APP_CONFIG.NODE_ENV === 'development',
        // Use Redis in production for distributed rate limiting
        // store: new RedisStore({ client: redisClient })
    });
    app.use(limiter);
    // ============================================================================
    // Parsing Middleware
    // ============================================================================
    // Body parser with limits
    app.use(express_1.default.json({
        limit: '1mb', // Limit payload size
        strict: true,
    }));
    app.use(express_1.default.urlencoded({
        extended: true,
        limit: '1mb',
        parameterLimit: 1000,
    }));
    // Compression for response bodies
    app.use((0, compression_1.default)({
        level: 6, // Balance between speed and compression
        threshold: 1024, // Only compress responses > 1KB
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression_1.default.filter(req, res);
        },
    }));
    // ============================================================================
    // Logging Middleware
    // ============================================================================
    // HTTP request logger (Morgan) - optimized format
    if (constants_1.APP_CONFIG.NODE_ENV === 'development') {
        app.use((0, morgan_1.default)('dev'));
    }
    else {
        // Production: use JSON format for log aggregation
        app.use((0, morgan_1.default)('combined', {
            skip: (_req, res) => res.statusCode < 400, // Only log errors in production
        }));
    }
    // Performance monitoring
    app.use(performance_middleware_1.performanceMiddleware);
    // ============================================================================
    // API Routes
    // ============================================================================
    // Root endpoint
    app.get('/', (_req, res) => {
        res.json({
            success: true,
            data: {
                name: 'Multi-Asset Order Splitter API',
                version: '2.0.0',
                description: 'High-performance order splitting API for robo-advisor portfolio management',
                features: [
                    'Multi-asset support (stocks, ETFs, crypto, commodities, bonds)',
                    'Dual input modes (allocation & amount)',
                    'Optimized for 1M+ requests',
                    'Advanced indexing & caching',
                ],
                documentation: `${constants_1.APP_CONFIG.API_PREFIX}/docs`,
                health: `${constants_1.APP_CONFIG.API_PREFIX}/health`,
            },
        });
    });
    // API routes
    app.use(constants_1.APP_CONFIG.API_PREFIX, routes_1.default);
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: `Route ${req.method} ${req.path} not found`,
            },
            metadata: {
                timestamp: new Date().toISOString(),
            },
        });
    });
    // ============================================================================
    // Error Handling
    // ============================================================================
    // Global error handler (must be last)
    app.use(error_middleware_1.errorMiddleware);
    // ============================================================================
    // Graceful Shutdown Handlers
    // ============================================================================
    process.on('unhandledRejection', (reason) => {
        logger_1.logger.error('Unhandled Promise Rejection', reason);
    });
    process.on('uncaughtException', (error) => {
        logger_1.logger.error('Uncaught Exception', error);
        // In production, exit gracefully and let process manager restart
        if (constants_1.APP_CONFIG.NODE_ENV === 'production') {
            process.exit(1);
        }
    });
    // Memory monitoring for high-traffic scenarios
    if (constants_1.APP_CONFIG.NODE_ENV === 'production') {
        setInterval(() => {
            const memUsage = process.memoryUsage();
            const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
            if (heapUsedMB > 1024) { // Alert if > 1GB
                logger_1.logger.warn('High memory usage detected', {
                    heapUsedMB,
                    heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
                    rssMB: Math.round(memUsage.rss / 1024 / 1024),
                });
            }
        }, 60000); // Check every minute
    }
    return app;
}
//# sourceMappingURL=app.js.map