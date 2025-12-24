"use strict";
/**
 * API Routes configuration
 * Multi-asset portfolio order splitting endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const config_controller_1 = require("../controllers/config.controller");
const market_controller_1 = require("../controllers/market.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const order_validator_1 = require("../validators/order.validator");
const router = (0, express_1.Router)();
// Initialize controllers
const orderController = new order_controller_1.OrderController();
const configController = new config_controller_1.ConfigController();
const marketController = new market_controller_1.MarketController();
// ============================================================================
// Order Routes
// ============================================================================
/**
 * POST /orders
 * Create a new multi-asset order
 * Supports: stocks, ETFs, crypto, commodities, bonds, mutual funds
 * Modes: allocation-based OR amount-based
 */
router.post('/orders', (0, validation_middleware_1.validateBody)(order_validator_1.createOrderSchema), (0, error_middleware_1.asyncHandler)(orderController.createOrder));
/**
 * GET /orders
 * Get all orders with optional filters
 * Query params: orderType, symbol, assetType, fromDate, toDate, limit, offset
 */
router.get('/orders', (0, validation_middleware_1.validateQuery)(order_validator_1.orderQuerySchema), (0, error_middleware_1.asyncHandler)(orderController.getOrders));
/**
 * GET /orders/stats
 * Get order statistics including asset type breakdown
 */
router.get('/orders/stats', (0, error_middleware_1.asyncHandler)(orderController.getStats));
/**
 * GET /orders/:orderId
 * Get a specific order by ID
 */
router.get('/orders/:orderId', (0, validation_middleware_1.validateParams)(order_validator_1.orderIdSchema), (0, error_middleware_1.asyncHandler)(orderController.getOrderById));
// ============================================================================
// Configuration Routes
// ============================================================================
/**
 * GET /config/precision
 * Get current decimal precision configuration
 */
router.get('/config/precision', (0, error_middleware_1.asyncHandler)(configController.getPrecision));
/**
 * PUT /config/precision
 * Update decimal precision configuration
 */
router.put('/config/precision', (0, validation_middleware_1.validateBody)(order_validator_1.decimalPrecisionSchema), (0, error_middleware_1.asyncHandler)(configController.updatePrecision));
// ============================================================================
// Market Routes
// ============================================================================
/**
 * GET /market/status
 * Get current market status (open/closed)
 */
router.get('/market/status', (0, error_middleware_1.asyncHandler)(marketController.getStatus));
// ============================================================================
// Health & Metrics
// ============================================================================
/**
 * GET /health
 * Health check endpoint with system metrics
 */
router.get('/health', (_req, res) => {
    const memUsage = process.memoryUsage();
    res.status(200).json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
                rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
            },
            nodeVersion: process.version,
            platform: process.platform,
        },
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map