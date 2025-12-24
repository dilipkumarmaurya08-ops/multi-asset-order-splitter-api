/**
 * Configuration controller
 * Handles system configuration endpoints
 */

import { Request, Response } from 'express';
import { ConfigRepository } from '../repositories/config.repository';
import { ApiResponse, DecimalPrecisionConfig } from '../models/order.model';
import { HTTP_STATUS } from '../config/constants';

export class ConfigController {
  private configRepository: ConfigRepository;

  constructor() {
    this.configRepository = ConfigRepository.getInstance();
  }

  /**
   * GET /api/v1/config/precision
   * Gets current decimal precision configuration
   */
  getPrecision = async (req: Request, res: Response): Promise<void> => {
    const config = this.configRepository.getDecimalPrecisionConfig();

    const response: ApiResponse<DecimalPrecisionConfig> = {
      success: true,
      data: config,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - req.startTime!,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };

  /**
   * PUT /api/v1/config/precision
   * Updates decimal precision configuration
   */
  updatePrecision = async (req: Request, res: Response): Promise<void> => {
    const { decimalPlaces } = req.body;
    const config = this.configRepository.setDecimalPrecision(decimalPlaces);

    const response: ApiResponse<DecimalPrecisionConfig> = {
      success: true,
      data: config,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - req.startTime!,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  };
}
