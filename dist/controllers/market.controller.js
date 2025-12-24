"use strict";
/**
 * Market controller
 * Handles market status endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketController = void 0;
const market_service_1 = require("../services/market.service");
const constants_1 = require("../config/constants");
class MarketController {
    marketService;
    constructor() {
        this.marketService = new market_service_1.MarketService();
    }
    /**
     * GET /api/v1/market/status
     * Gets current market status
     */
    getStatus = async (req, res) => {
        const status = this.marketService.getMarketStatus();
        const response = {
            success: true,
            data: status,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTimeMs: Date.now() - req.startTime,
            },
        };
        res.status(constants_1.HTTP_STATUS.OK).json(response);
    };
}
exports.MarketController = MarketController;
//# sourceMappingURL=market.controller.js.map