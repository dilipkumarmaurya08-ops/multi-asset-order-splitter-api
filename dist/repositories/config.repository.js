"use strict";
/**
 * Configuration repository for managing system settings
 * In-memory storage for decimal precision configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigRepository = void 0;
const constants_1 = require("../config/constants");
const logger_1 = require("../utils/logger");
/**
 * Thread-safe configuration repository
 * Uses singleton pattern for consistent state
 */
class ConfigRepository {
    static instance;
    decimalPrecision;
    lastUpdated;
    constructor() {
        this.decimalPrecision = constants_1.ORDER_CONFIG.DEFAULT_DECIMAL_PRECISION;
        this.lastUpdated = new Date();
        logger_1.logger.info('ConfigRepository initialized', {
            defaultPrecision: this.decimalPrecision,
        });
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!ConfigRepository.instance) {
            ConfigRepository.instance = new ConfigRepository();
        }
        return ConfigRepository.instance;
    }
    /**
     * Get current decimal precision
     */
    getDecimalPrecision() {
        return this.decimalPrecision;
    }
    /**
     * Get decimal precision configuration with metadata
     */
    getDecimalPrecisionConfig() {
        return {
            decimalPlaces: this.decimalPrecision,
            updatedAt: this.lastUpdated.toISOString(),
        };
    }
    /**
     * Update decimal precision
     */
    setDecimalPrecision(precision) {
        const oldPrecision = this.decimalPrecision;
        this.decimalPrecision = precision;
        this.lastUpdated = new Date();
        logger_1.logger.info('Decimal precision updated', {
            oldPrecision,
            newPrecision: precision,
            updatedAt: this.lastUpdated.toISOString(),
        });
        return this.getDecimalPrecisionConfig();
    }
    /**
     * Reset to default configuration
     */
    reset() {
        this.decimalPrecision = constants_1.ORDER_CONFIG.DEFAULT_DECIMAL_PRECISION;
        this.lastUpdated = new Date();
        logger_1.logger.info('Configuration reset to defaults');
    }
}
exports.ConfigRepository = ConfigRepository;
//# sourceMappingURL=config.repository.js.map