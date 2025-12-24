/**
 * Order controller - HTTP request handlers
 * Handles all order-related endpoints
 */
import { Request, Response } from 'express';
export declare class OrderController {
    private orderService;
    constructor();
    /**
     * POST /api/v1/orders
     * Creates a new order
     */
    createOrder: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/v1/orders/:orderId
     * Gets a specific order by ID
     */
    getOrderById: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/v1/orders
     * Gets all orders with optional filtering and pagination
     */
    getOrders: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/v1/orders/stats
     * Gets order statistics
     */
    getStats: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=order.controller.d.ts.map