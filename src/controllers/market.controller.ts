/**
 * Market controller
 * Handles market status endpoints
 */

import { Request, Response } from 'express';
import { MarketService } from '../services/market.service';
import { ApiResponse } from '../models/order.model';
import { HTTP_STATUS } from '../config/constants';

export class MarketController {
  private marketService: MarketService;

  constructor() {
    this.marketService = new MarketService();
  }

  /**
   * GET /api/v1/market/status
   * Gets current market status
   */
  getStatus = async (req: Request, res: Response): Promise<void> => {
    const status = this.marketService.getMarketStatus();

    const response: ApiResponse<typeof status> = {
      success: true,
      data: status,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - req.startTime!,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };
}