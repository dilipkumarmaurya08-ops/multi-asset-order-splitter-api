"use strict";
/**
 * Order service - Core business logic for multi-asset order splitting
 * Supports stocks, ETFs, crypto, commodities, bonds, and mutual funds
 * Optimized for high-performance scenarios (1M+ requests)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const uuid_1 = require("uuid");
const order_repository_1 = require("../repositories/order.repository");
const config_repository_1 = require("../repositories/config.repository");
const market_service_1 = require("./market.service");
const constants_1 = require("../config/constants");
const helpers_1 = require("../utils/helpers");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
class OrderService {
    orderRepository;
    configRepository;
    marketService;
    constructor() {
        this.orderRepository = order_repository_1.OrderRepository.getInstance();
        this.configRepository = config_repository_1.ConfigRepository.getInstance();
        this.marketService = new market_service_1.MarketService();
    }
    /**
     * Creates a new order with intelligent multi-asset splitting
     * Supports two modes:
     * 1. Allocation-based: User provides percentages, we split the total amount
     * 2. Amount-based: User provides dollar amounts, we calculate allocations
     */
    async createOrder(request, startTime) {
        const decimalPrecision = this.configRepository.getDecimalPrecision();
        // Determine mode and prepare data
        const { mode, totalAmount, normalizedAssets } = this.prepareOrderData(request);
        logger_1.logger.info('Creating multi-asset order', {
            orderType: request.orderType,
            mode,
            amount: totalAmount,
            assetCount: normalizedAssets.length,
            assetTypes: this.getAssetTypeCounts(normalizedAssets),
            decimalPrecision,
        });
        // Validate portfolio
        this.validatePortfolio(normalizedAssets);
        // Calculate asset orders
        const assetOrders = this.calculateAssetOrders(normalizedAssets, totalAmount, decimalPrecision);
        // Check market status
        const marketTime = this.marketService.getCurrentMarketTime();
        const canExecuteNow = this.marketService.isMarketOpen(marketTime);
        const executionTime = canExecuteNow
            ? marketTime.toISO()
            : this.marketService.getNextTradingTime(marketTime).toISO();
        const nextAvailableTime = canExecuteNow
            ? undefined
            : this.marketService.getNextTradingTime(marketTime).toISO();
        // Create order object
        const order = {
            orderId: (0, uuid_1.v4)(),
            orderType: request.orderType,
            totalAmount,
            portfolio: { assets: normalizedAssets },
            assetOrders,
            executionTime: executionTime || new Date().toISOString(),
            canExecuteNow,
            nextAvailableTime: nextAvailableTime || undefined,
            createdAt: new Date().toISOString(),
            decimalPrecision,
            metadata: {
                processingTimeMs: Date.now() - startTime,
                requestTimestamp: new Date(startTime).toISOString(),
                marketStatus: canExecuteNow ? 'open' : 'closed',
                mode,
                assetBreakdown: this.getAssetTypeCounts(normalizedAssets),
            },
        };
        // Save order
        const savedOrder = this.orderRepository.save(order);
        logger_1.logger.info('Multi-asset order created successfully', {
            orderId: savedOrder.orderId,
            mode,
            canExecuteNow,
            processingTimeMs: order.metadata.processingTimeMs,
        });
        return savedOrder;
    }
    /**
     * Prepares order data by detecting mode and normalizing inputs
     * Mode 1 (Allocation): amount provided, assets have allocation %
     * Mode 2 (Amount): no amount, assets have dollar amounts
     */
    prepareOrderData(request) {
        const firstAsset = request.portfolio.assets[0];
        // Mode 1: Allocation-based (user provides percentages)
        if (firstAsset.allocation !== undefined && request.amount !== undefined) {
            return {
                mode: 'allocation',
                totalAmount: request.amount,
                normalizedAssets: request.portfolio.assets,
            };
        }
        // Mode 2: Amount-based (user provides dollar amounts per asset)
        if (firstAsset.amount !== undefined) {
            // Calculate total amount
            const totalAmount = request.portfolio.assets.reduce((sum, asset) => sum + (asset.amount || 0), 0);
            // Calculate allocations from amounts
            const normalizedAssets = request.portfolio.assets.map(asset => {
                const allocation = ((asset.amount || 0) / totalAmount) * 100;
                return {
                    symbol: asset.symbol,
                    type: asset.type,
                    allocation: (0, helpers_1.roundToDecimal)(allocation, 2),
                    price: asset.price,
                };
            });
            return {
                mode: 'amount',
                totalAmount,
                normalizedAssets,
            };
        }
        // Should never reach here due to Zod validation
        throw new errors_1.InvalidPortfolioError('Invalid portfolio configuration');
    }
    /**
     * Validates portfolio allocations
     */
    validatePortfolio(assets) {
        // Check for zero allocations
        const zeroAllocations = assets.filter(a => a.allocation === 0);
        if (zeroAllocations.length > 0) {
            throw new errors_1.InvalidPortfolioError('Portfolio contains assets with zero allocation', { symbols: zeroAllocations.map(a => a.symbol) });
        }
        // Verify sum to 100% (allocations should already be normalized, but double-check)
        const totalAllocation = assets.reduce((sum, asset) => sum + (asset.allocation || 0), 0);
        const tolerance = 0.01;
        if (Math.abs(totalAllocation - 100) > tolerance) {
            throw new errors_1.InvalidPortfolioError(`Portfolio allocations must sum to 100%. Current sum: ${totalAllocation.toFixed(2)}%`, { totalAllocation });
        }
    }
    /**
     * Calculates individual asset orders from portfolio allocation
     * Uses high-precision arithmetic to minimize rounding errors
     * Optimized for multi-asset portfolios
     */
    calculateAssetOrders(assets, totalAmount, decimalPrecision) {
        const orders = [];
        let allocatedAmount = 0;
        // Calculate each asset order
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            const isLast = i === assets.length - 1;
            // Use custom price or default
            const price = asset.price || constants_1.ORDER_CONFIG.DEFAULT_ASSET_PRICE;
            // Get allocation (should always be present after normalization)
            const allocation = asset.allocation || 0;
            // Calculate allocated amount for this asset
            let amount;
            if (isLast) {
                // Last asset gets remaining amount to handle rounding
                amount = totalAmount - allocatedAmount;
            }
            else {
                amount = (allocation / 100) * totalAmount;
                amount = (0, helpers_1.roundToDecimal)(amount, 2); // Round to cents
            }
            // Calculate number of shares/units
            const rawShares = amount / price;
            const shares = (0, helpers_1.roundToDecimal)(rawShares, decimalPrecision);
            // Calculate actual cost (shares * price)
            const totalCost = (0, helpers_1.roundToDecimal)(shares * price, 2);
            orders.push({
                symbol: asset.symbol,
                type: asset.type,
                allocation,
                price,
                amount,
                shares,
                totalCost,
            });
            allocatedAmount += amount;
        }
        // Verify no significant loss due to rounding
        const totalCost = orders.reduce((sum, order) => sum + order.totalCost, 0);
        const difference = Math.abs(totalAmount - totalCost);
        if (difference > 0.01) {
            logger_1.logger.warn('Rounding resulted in allocation difference', {
                requested: totalAmount,
                allocated: totalCost,
                difference,
                assetCount: orders.length,
            });
        }
        return orders;
    }
    /**
     * Get asset type counts for metadata
     */
    getAssetTypeCounts(assets) {
        const counts = {};
        assets.forEach(asset => {
            if (asset.type) {
                counts[asset.type] = (counts[asset.type] || 0) + 1;
            }
        });
        return counts;
    }
    /**
     * Retrieves an order by ID
     */
    async getOrderById(orderId) {
        const order = this.orderRepository.findByIdOrThrow(orderId);
        logger_1.logger.debug('Order retrieved', { orderId });
        return order;
    }
    /**
     * Retrieves orders with filtering and pagination
     */
    async getOrders(params) {
        logger_1.logger.debug('Fetching orders', { params });
        const result = this.orderRepository.findAll(params);
        logger_1.logger.info('Orders retrieved', {
            total: result.pagination.total,
            returned: result.orders.length,
            filters: params,
        });
        return result;
    }
    /**
     * Gets repository statistics
     */
    async getStats() {
        return this.orderRepository.getStats();
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map