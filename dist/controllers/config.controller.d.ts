/**
 * Configuration controller
 * Handles system configuration endpoints
 */
import { Request, Response } from 'express';
export declare class ConfigController {
    private configRepository;
    constructor();
    /**
     * GET /api/v1/config/precision
     * Gets current decimal precision configuration
     */
    getPrecision: (req: Request, res: Response) => Promise<void>;
    /**
     * PUT /api/v1/config/precision
     * Updates decimal precision configuration
     */
    updatePrecision: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=config.controller.d.ts.map