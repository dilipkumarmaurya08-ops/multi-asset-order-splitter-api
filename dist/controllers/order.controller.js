"use strict";
/**
 * Order controller - HTTP request handlers
 * Handles all order-related endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const constants_1 = require("../config/constants");
class OrderController {
    orderService;
    constructor() {
        this.orderService = new order_service_1.OrderService();
    }
    /**
     * POST /api/v1/orders
     * Creates a new order
     */
    createOrder = async (req, res) => {
        const order = await this.orderService.createOrder(req.body, req.startTime);
        const response = {
            success: true,
            data: order,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTimeMs: Date.now() - req.startTime,
            },
        };
        res.status(constants_1.HTTP_STATUS.CREATED).json(response);
    };
    /**
     * GET /api/v1/orders/:orderId
     * Gets a specific order by ID
     */
    getOrderById = async (req, res) => {
        const { orderId } = req.params;
        const order = await this.orderService.getOrderById(orderId);
        const response = {
            success: true,
            data: order,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTimeMs: Date.now() - req.startTime,
            },
        };
        res.status(constants_1.HTTP_STATUS.OK).json(response);
    };
    /**
     * GET /api/v1/orders
     * Gets all orders with optional filtering and pagination
     */
    getOrders = async (req, res) => {
        const params = req.query;
        const result = await this.orderService.getOrders(params);
        const response = {
            success: true,
            data: result,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTimeMs: Date.now() - req.startTime,
            },
        };
        res.status(constants_1.HTTP_STATUS.OK).json(response);
    };
    /**
     * GET /api/v1/orders/stats
     * Gets order statistics
     */
    getStats = async (req, res) => {
        const stats = await this.orderService.getStats();
        const response = {
            success: true,
            data: stats,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTimeMs: Date.now() - req.startTime,
            },
        };
        res.status(constants_1.HTTP_STATUS.OK).json(response);
    };
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map