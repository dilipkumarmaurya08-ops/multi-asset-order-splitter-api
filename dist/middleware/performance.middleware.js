"use strict";
/**
 * Performance monitoring middleware
 * Tracks and logs response times for all requests
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceMiddleware = void 0;
const logger_1 = require("../utils/logger");
/**
 * Middleware to track request processing time
 * Logs performance metrics to console for visibility
 */
const performanceMiddleware = (req, res, next) => {
    // Capture start time
    req.startTime = Date.now();
    // Intercept response to calculate duration
    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);
    // Override res.send
    res.send = function (body) {
        logPerformance(req, res);
        return originalSend(body);
    };
    // Override res.json
    res.json = function (body) {
        logPerformance(req, res);
        return originalJson(body);
    };
    next();
};
exports.performanceMiddleware = performanceMiddleware;
/**
 * Logs performance metrics
 */
function logPerformance(req, res) {
    if (!req.startTime)
        return;
    const duration = Date.now() - req.startTime;
    const method = req.method;
    const path = req.originalUrl || req.url;
    const statusCode = res.statusCode;
    // Log to console with color coding based on duration
    const durationColor = duration < 100 ? '\x1b[32m' : // Green for fast (<100ms)
        duration < 500 ? '\x1b[33m' : // Yellow for medium (100-500ms)
            '\x1b[31m'; // Red for slow (>500ms)
    console.log(`${durationColor}⚡ ${method} ${path} - ${statusCode} - ${duration}ms\x1b[0m`);
    // Log via structured logger for production
    logger_1.logger.http(method, path, statusCode, duration, {
        userAgent: req.get('user-agent'),
        ip: req.ip,
    });
    // Warn on slow requests
    if (duration > 1000) {
        logger_1.logger.warn('Slow request detected', {
            method,
            path,
            duration,
            statusCode,
        });
    }
}
//# sourceMappingURL=performance.middleware.js.map