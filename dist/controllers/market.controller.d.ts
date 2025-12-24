/**
 * Market controller
 * Handles market status endpoints
 */
import { Request, Response } from 'express';
export declare class MarketController {
    private marketService;
    constructor();
    /**
     * GET /api/v1/market/status
     * Gets current market status
     */
    getStatus: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=market.controller.d.ts.map