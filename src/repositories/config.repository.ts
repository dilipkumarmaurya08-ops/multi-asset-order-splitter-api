/**
 * Configuration repository for managing system settings
 * In-memory storage for decimal precision configuration
 */

import { ORDER_CONFIG } from '../config/constants';
import { DecimalPrecisionConfig } from '../models/order.model';
import { logger } from '../utils/logger';

/**
 * Thread-safe configuration repository
 * Uses singleton pattern for consistent state
 */
export class ConfigRepository {
  private static instance: ConfigRepository;
  private decimalPrecision: number;
  private lastUpdated: Date;

  private constructor() {
    this.decimalPrecision = ORDER_CONFIG.DEFAULT_DECIMAL_PRECISION;
    this.lastUpdated = new Date();
    logger.info('ConfigRepository initialized', {
      defaultPrecision: this.decimalPrecision,
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ConfigRepository {
    if (!ConfigRepository.instance) {
      ConfigRepository.instance = new ConfigRepository();
    }
    return ConfigRepository.instance;
  }

  /**
   * Get current decimal precision
   */
  getDecimalPrecision(): number {
    return this.decimalPrecision;
  }

  /**
   * Get decimal precision configuration with metadata
   */
  getDecimalPrecisionConfig(): DecimalPrecisionConfig {
    return {
      decimalPlaces: this.decimalPrecision,
      updatedAt: this.lastUpdated.toISOString(),
    };
  }

  /**
   * Update decimal precision
   */
  setDecimalPrecision(precision: number): DecimalPrecisionConfig {
    const oldPrecision = this.decimalPrecision;
    this.decimalPrecision = precision;
    this.lastUpdated = new Date();

    logger.info('Decimal precision updated', {
      oldPrecision,
      newPrecision: precision,
      updatedAt: this.lastUpdated.toISOString(),
    });

    return this.getDecimalPrecisionConfig();
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.decimalPrecision = ORDER_CONFIG.DEFAULT_DECIMAL_PRECISION;
    this.lastUpdated = new Date();
    logger.info('Configuration reset to defaults');
  }
}