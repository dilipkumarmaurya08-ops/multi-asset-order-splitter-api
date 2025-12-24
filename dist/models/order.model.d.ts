/**
 * Domain models and types for the multi-asset order splitting system
 * Supports stocks, ETFs, crypto, commodities, bonds, and mutual funds
 */
import { ORDER_TYPES, ASSET_TYPES } from '../config/constants';
export type OrderType = typeof ORDER_TYPES[keyof typeof ORDER_TYPES];
export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];
/**
 * Represents an asset in a portfolio
 * Supports multiple asset classes: stocks, ETFs, crypto, commodities, bonds
 */
export interface PortfolioAsset {
    symbol: string;
    type?: AssetType;
    allocation?: number;
    amount?: number;
    price?: number;
}
/**
 * Model portfolio containing asset allocations
 */
export interface ModelPortfolio {
    assets: PortfolioAsset[];
}
/**
 * Individual asset order details
 */
export interface AssetOrder {
    symbol: string;
    type?: AssetType;
    allocation: number;
    price: number;
    amount: number;
    shares: number;
    totalCost: number;
}
/**
 * Complete order with execution details
 */
export interface Order {
    orderId: string;
    orderType: OrderType;
    totalAmount: number;
    portfolio: ModelPortfolio;
    assetOrders: AssetOrder[];
    executionTime: string;
    canExecuteNow: boolean;
    nextAvailableTime?: string;
    createdAt: string;
    decimalPrecision: number;
    metadata: {
        processingTimeMs: number;
        requestTimestamp: string;
        marketStatus: 'open' | 'closed';
        mode: 'allocation' | 'amount';
        assetBreakdown?: Record<AssetType, number>;
    };
}
/**
 * Request payload for creating an order
 * Supports two input modes:
 * 1. Allocation-based: Specify total amount + allocation percentages
 * 2. Amount-based: Specify amounts per asset (total calculated automatically)
 */
export interface CreateOrderRequest {
    orderType: OrderType;
    amount?: number;
    portfolio: ModelPortfolio;
}
/**
 * Response wrapper for API responses
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    metadata?: {
        timestamp: string;
        processingTimeMs?: number;
        requestId?: string;
    };
}
/**
 * Query parameters for fetching orders
 */
export interface OrderQueryParams {
    orderType?: OrderType;
    symbol?: string;
    assetType?: AssetType;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
}
/**
 * Paginated response for orders
 */
export interface PaginatedOrders {
    orders: Order[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}
/**
 * Configuration for decimal precision
 */
export interface DecimalPrecisionConfig {
    decimalPlaces: number;
    updatedAt: string;
}
/**
 * Statistics response
 */
export interface OrderStatistics {
    totalOrders: number;
    ordersByType: Record<string, number>;
    ordersByAssetType: Record<string, number>;
    uniqueSymbols: number;
    totalVolume: number;
    averageOrderSize: number;
}
//# sourceMappingURL=order.model.d.ts.map