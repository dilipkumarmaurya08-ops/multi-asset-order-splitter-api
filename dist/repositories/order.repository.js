"use strict";
/**
 * Order repository for managing order persistence
 * High-performance in-memory storage optimized for 1M+ requests
 * Uses advanced indexing strategies for O(1) lookups
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
/**
 * Efficient in-memory order storage with multi-level indexing
 * Optimized for extreme high-traffic scenarios
 */
class OrderRepository {
    static instance;
    // Primary storage - O(1) lookup
    orders;
    // Secondary indexes for fast filtering - O(1) lookup
    ordersByType;
    ordersBySymbol;
    ordersByAssetType;
    // Ordered index for pagination - maintains insertion order
    ordersByDate;
    // Statistics cache for performance
    statsCache = null;
    constructor() {
        this.orders = new Map();
        this.ordersByType = new Map();
        this.ordersBySymbol = new Map();
        this.ordersByAssetType = new Map();
        this.ordersByDate = [];
        logger_1.logger.info('OrderRepository initialized with high-performance indexing', {
            features: ['multi-index', 'O(1)-lookups', 'stats-caching'],
        });
    }
    /**
     * Get singleton instance (thread-safe)
     */
    static getInstance() {
        if (!OrderRepository.instance) {
            OrderRepository.instance = new OrderRepository();
        }
        return OrderRepository.instance;
    }
    /**
     * Save a new order with optimized indexing
     * Time Complexity: O(n) where n = number of assets in order
     */
    save(order) {
        const startTime = Date.now();
        // Store in primary map
        this.orders.set(order.orderId, order);
        // Update type index
        if (!this.ordersByType.has(order.orderType)) {
            this.ordersByType.set(order.orderType, new Set());
        }
        this.ordersByType.get(order.orderType).add(order.orderId);
        // Update symbol indexes (for all assets in order)
        order.assetOrders.forEach(asset => {
            if (!this.ordersBySymbol.has(asset.symbol)) {
                this.ordersBySymbol.set(asset.symbol, new Set());
            }
            this.ordersBySymbol.get(asset.symbol).add(order.orderId);
            // Update asset type index
            if (asset.type) {
                if (!this.ordersByAssetType.has(asset.type)) {
                    this.ordersByAssetType.set(asset.type, new Set());
                }
                this.ordersByAssetType.get(asset.type).add(order.orderId);
            }
        });
        // Update date index (maintain sorted order)
        this.ordersByDate.push(order.orderId);
        // Invalidate stats cache
        this.statsCache = null;
        const duration = Date.now() - startTime;
        if (duration > 10) {
            logger_1.logger.warn('Slow order save operation', {
                orderId: order.orderId,
                durationMs: duration,
                assetCount: order.assetOrders.length,
            });
        }
        return order;
    }
    /**
     * Find order by ID - O(1) lookup
     */
    findById(orderId) {
        return this.orders.get(orderId) || null;
    }
    /**
     * Find order by ID or throw error
     */
    findByIdOrThrow(orderId) {
        const order = this.findById(orderId);
        if (!order) {
            throw new errors_1.OrderNotFoundError(orderId);
        }
        return order;
    }
    /**
     * Find orders with filters and pagination
     * Optimized with index-based filtering
     */
    findAll(params) {
        const startTime = Date.now();
        let orderIds = [];
        // Use indexes for efficient filtering - O(1) lookups
        const filters = [];
        // Apply type filter
        if (params.orderType) {
            const typeIds = this.ordersByType.get(params.orderType);
            if (typeIds)
                filters.push(typeIds);
            else
                return this.emptyResult(params);
        }
        // Apply symbol filter
        if (params.symbol) {
            const symbolIds = this.ordersBySymbol.get(params.symbol);
            if (symbolIds)
                filters.push(symbolIds);
            else
                return this.emptyResult(params);
        }
        // Apply asset type filter
        if (params.assetType) {
            const assetTypeIds = this.ordersByAssetType.get(params.assetType);
            if (assetTypeIds)
                filters.push(assetTypeIds);
            else
                return this.emptyResult(params);
        }
        // Compute intersection of all filters
        if (filters.length > 0) {
            orderIds = this.intersectSets(filters);
        }
        else {
            // No filters, use all orders
            orderIds = [...this.ordersByDate];
        }
        // Apply date filters if provided
        if (params.fromDate || params.toDate) {
            orderIds = this.filterByDateRange(orderIds, params.fromDate, params.toDate);
        }
        // Sort by creation date (newest first)
        orderIds = this.sortByDate(orderIds, 'desc');
        // Apply pagination
        const limit = params.limit || 50;
        const offset = params.offset || 0;
        const total = orderIds.length;
        const paginatedIds = orderIds.slice(offset, offset + limit);
        // Retrieve full order objects - batch operation
        const orders = this.batchGetOrders(paginatedIds);
        const duration = Date.now() - startTime;
        if (duration > 100) {
            logger_1.logger.warn('Slow query operation', {
                durationMs: duration,
                filters: params,
                resultCount: orders.length,
            });
        }
        return {
            orders,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        };
    }
    /**
     * Get total order count - O(1)
     */
    count() {
        return this.orders.size;
    }
    /**
     * Get statistics with caching for performance
     */
    getStats() {
        // Check cache
        const now = Date.now();
        if (this.statsCache && (now - this.statsCache.timestamp) < this.statsCache.ttl) {
            return this.statsCache.data;
        }
        // Compute stats
        const ordersByType = {};
        this.ordersByType.forEach((orderIds, type) => {
            ordersByType[type] = orderIds.size;
        });
        const ordersByAssetType = {};
        this.ordersByAssetType.forEach((orderIds, type) => {
            ordersByAssetType[type] = orderIds.size;
        });
        let totalVolume = 0;
        this.orders.forEach(order => {
            totalVolume += order.totalAmount;
        });
        const stats = {
            totalOrders: this.orders.size,
            ordersByType,
            ordersByAssetType,
            uniqueSymbols: this.ordersBySymbol.size,
            totalVolume,
            averageOrderSize: this.orders.size > 0 ? totalVolume / this.orders.size : 0,
        };
        // Cache result for 60 seconds
        this.statsCache = {
            data: stats,
            timestamp: now,
            ttl: 60000,
        };
        return stats;
    }
    /**
     * Clear all orders (for testing or reset)
     */
    clear() {
        this.orders.clear();
        this.ordersByType.clear();
        this.ordersBySymbol.clear();
        this.ordersByAssetType.clear();
        this.ordersByDate = [];
        this.statsCache = null;
        logger_1.logger.info('All orders cleared from repository');
    }
    // ============================================================================
    // Private Helper Methods
    // ============================================================================
    /**
     * Intersect multiple sets efficiently
     */
    intersectSets(sets) {
        if (sets.length === 0)
            return [];
        if (sets.length === 1)
            return Array.from(sets[0]);
        // Start with smallest set for optimization
        const sorted = sets.sort((a, b) => a.size - b.size);
        let result = new Set(sorted[0]);
        for (let i = 1; i < sorted.length; i++) {
            result = new Set([...result].filter(id => sorted[i].has(id)));
        }
        return Array.from(result);
    }
    /**
     * Filter orders by date range
     */
    filterByDateRange(orderIds, fromDate, toDate) {
        if (!fromDate && !toDate)
            return orderIds;
        return orderIds.filter(id => {
            const order = this.orders.get(id);
            if (!order)
                return false;
            const orderDate = new Date(order.createdAt);
            if (fromDate && orderDate < new Date(fromDate)) {
                return false;
            }
            if (toDate && orderDate > new Date(toDate)) {
                return false;
            }
            return true;
        });
    }
    /**
     * Sort order IDs by date
     */
    sortByDate(orderIds, direction) {
        return orderIds.sort((a, b) => {
            const orderA = this.orders.get(a);
            const orderB = this.orders.get(b);
            if (!orderA || !orderB)
                return 0;
            const timeA = new Date(orderA.createdAt).getTime();
            const timeB = new Date(orderB.createdAt).getTime();
            return direction === 'desc' ? timeB - timeA : timeA - timeB;
        });
    }
    /**
     * Batch get orders by IDs
     */
    batchGetOrders(orderIds) {
        const orders = [];
        for (const id of orderIds) {
            const order = this.orders.get(id);
            if (order) {
                orders.push(order);
            }
        }
        return orders;
    }
    /**
     * Return empty result with proper structure
     */
    emptyResult(params) {
        return {
            orders: [],
            pagination: {
                total: 0,
                limit: params.limit || 50,
                offset: params.offset || 0,
                hasMore: false,
            },
        };
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map