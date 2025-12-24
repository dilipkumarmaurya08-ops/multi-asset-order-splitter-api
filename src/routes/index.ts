/**
 * API Routes configuration
 * Multi-asset portfolio order splitting endpoints
 */

import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { ConfigController } from '../controllers/config.controller';
import { MarketController } from '../controllers/market.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import {
  createOrderSchema,
  orderQuerySchema,
  orderIdSchema,
  decimalPrecisionSchema,
} from '../validators/order.validator';

const router = Router();

// Initialize controllers
const orderController = new OrderController();
const configController = new ConfigController();
const marketController = new MarketController();

// ============================================================================
// Order Routes
// ============================================================================

/**
 * POST /orders
 * Create a new multi-asset order
 * Supports: stocks, ETFs, crypto, commodities, bonds, mutual funds
 * Modes: allocation-based OR amount-based
 */
router.post(
  '/orders',
  validateBody(createOrderSchema),
  asyncHandler(orderController.createOrder)
);

/**
 * GET /orders
 * Get all orders with optional filters
 * Query params: orderType, symbol, assetType, fromDate, toDate, limit, offset
 */
router.get(
  '/orders',
  validateQuery(orderQuerySchema),
  asyncHandler(orderController.getOrders)
);

/**
 * GET /orders/stats
 * Get order statistics including asset type breakdown
 */
router.get(
  '/orders/stats',
  asyncHandler(orderController.getStats)
);

/**
 * GET /orders/:orderId
 * Get a specific order by ID
 */
router.get(
  '/orders/:orderId',
  validateParams(orderIdSchema),
  asyncHandler(orderController.getOrderById)
);

// ============================================================================
// Configuration Routes
// ============================================================================

/**
 * GET /config/precision
 * Get current decimal precision configuration
 */
router.get(
  '/config/precision',
  asyncHandler(configController.getPrecision)
);

/**
 * PUT /config/precision
 * Update decimal precision configuration
 */
router.put(
  '/config/precision',
  validateBody(decimalPrecisionSchema),
  asyncHandler(configController.updatePrecision)
);

// ============================================================================
// Market Routes
// ============================================================================

/**
 * GET /market/status
 * Get current market status (open/closed)
 */
router.get(
  '/market/status',
  asyncHandler(marketController.getStatus)
);

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

export default router;