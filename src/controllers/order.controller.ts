/**
 * Order controller - HTTP request handlers
 * Handles all order-related endpoints
 */

import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { ApiResponse, Order, PaginatedOrders, OrderQueryParams } from '../models/order.model';
import { HTTP_STATUS } from '../config/constants';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  /**
   * POST /api/v1/orders
   * Creates a new order
   */
  createOrder = async (req: Request, res: Response): Promise<void> => {
    const order = await this.orderService.createOrder(req.body, req.startTime!);

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - req.startTime!,
      },
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  };

  /**
   * GET /api/v1/orders/:orderId
   * Gets a specific order by ID
   */
  getOrderById = async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const order = await this.orderService.getOrderById(orderId);

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - req.startTime!,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };

  /**
   * GET /api/v1/orders
   * Gets all orders with optional filtering and pagination
   */
  getOrders = async (req: Request, res: Response): Promise<void> => {
    const params = req.query as unknown as OrderQueryParams;
    const result = await this.orderService.getOrders(params);

    const response: ApiResponse<PaginatedOrders> = {
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - req.startTime!,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };

  /**
   * GET /api/v1/orders/stats
   * Gets order statistics
   */
  getStats = async (req: Request, res: Response): Promise<void> => {
    const stats = await this.orderService.getStats();

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - req.startTime!,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };
}
