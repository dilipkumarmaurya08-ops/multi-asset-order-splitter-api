/**
 * Configuration repository for managing system settings
 * In-memory storage for decimal precision configuration
 */
import { DecimalPrecisionConfig } from '../models/order.model';
/**
 * Thread-safe configuration repository
 * Uses singleton pattern for consistent state
 */
export declare class ConfigRepository {
    private static instance;
    private decimalPrecision;
    private lastUpdated;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): ConfigRepository;
    /**
     * Get current decimal precision
     */
    getDecimalPrecision(): number;
    /**
     * Get decimal precision configuration with metadata
     */
    getDecimalPrecisionConfig(): DecimalPrecisionConfig;
    /**
     * Update decimal precision
     */
    setDecimalPrecision(precision: number): DecimalPrecisionConfig;
    /**
     * Reset to default configuration
     */
    reset(): void;
}
//# sourceMappingURL=config.repository.d.ts.map