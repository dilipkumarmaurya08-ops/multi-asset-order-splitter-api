/**
 * Order repository for managing order persistence
 * High-performance in-memory storage optimized for 1M+ requests
 * Uses advanced indexing strategies for O(1) lookups
 */
import { Order, OrderQueryParams, PaginatedOrders } from '../models/order.model';
/**
 * Efficient in-memory order storage with multi-level indexing
 * Optimized for extreme high-traffic scenarios
 */
export declare class OrderRepository {
    private static instance;
    private orders;
    private ordersByType;
    private ordersBySymbol;
    private ordersByAssetType;
    private ordersByDate;
    private statsCache;
    private constructor();
    /**
     * Get singleton instance (thread-safe)
     */
    static getInstance(): OrderRepository;
    /**
     * Save a new order with optimized indexing
     * Time Complexity: O(n) where n = number of assets in order
     */
    save(order: Order): Order;
    /**
     * Find order by ID - O(1) lookup
     */
    findById(orderId: string): Order | null;
    /**
     * Find order by ID or throw error
     */
    findByIdOrThrow(orderId: string): Order;
    /**
     * Find orders with filters and pagination
     * Optimized with index-based filtering
     */
    findAll(params: OrderQueryParams): PaginatedOrders;
    /**
     * Get total order count - O(1)
     */
    count(): number;
    /**
     * Get statistics with caching for performance
     */
    getStats(): {
        totalOrders: number;
        ordersByType: Record<string, number>;
        ordersByAssetType: Record<string, number>;
        uniqueSymbols: number;
        totalVolume: number;
        averageOrderSize: number;
    };
    /**
     * Clear all orders (for testing or reset)
     */
    clear(): void;
    /**
     * Intersect multiple sets efficiently
     */
    private intersectSets;
    /**
     * Filter orders by date range
     */
    private filterByDateRange;
    /**
     * Sort order IDs by date
     */
    private sortByDate;
    /**
     * Batch get orders by IDs
     */
    private batchGetOrders;
    /**
     * Return empty result with proper structure
     */
    private emptyResult;
}
//# sourceMappingURL=order.repository.d.ts.map