/**
 * Order service - Core business logic for multi-asset order splitting
 * Supports stocks, ETFs, crypto, commodities, bonds, and mutual funds
 * Optimized for high-performance scenarios (1M+ requests)
 */
import { Order, CreateOrderRequest, OrderQueryParams, PaginatedOrders } from '../models/order.model';
import { OrderRepository } from '../repositories/order.repository';
export declare class OrderService {
    private orderRepository;
    private configRepository;
    private marketService;
    constructor();
    /**
     * Creates a new order with intelligent multi-asset splitting
     * Supports two modes:
     * 1. Allocation-based: User provides percentages, we split the total amount
     * 2. Amount-based: User provides dollar amounts, we calculate allocations
     */
    createOrder(request: CreateOrderRequest, startTime: number): Promise<Order>;
    /**
     * Prepares order data by detecting mode and normalizing inputs
     * Mode 1 (Allocation): amount provided, assets have allocation %
     * Mode 2 (Amount): no amount, assets have dollar amounts
     */
    private prepareOrderData;
    /**
     * Validates portfolio allocations
     */
    private validatePortfolio;
    /**
     * Calculates individual asset orders from portfolio allocation
     * Uses high-precision arithmetic to minimize rounding errors
     * Optimized for multi-asset portfolios
     */
    private calculateAssetOrders;
    /**
     * Get asset type counts for metadata
     */
    private getAssetTypeCounts;
    /**
     * Retrieves an order by ID
     */
    getOrderById(orderId: string): Promise<Order>;
    /**
     * Retrieves orders with filtering and pagination
     */
    getOrders(params: OrderQueryParams): Promise<PaginatedOrders>;
    /**
     * Gets repository statistics
     */
    getStats(): Promise<ReturnType<OrderRepository['getStats']>>;
}
//# sourceMappingURL=order.service.d.ts.map