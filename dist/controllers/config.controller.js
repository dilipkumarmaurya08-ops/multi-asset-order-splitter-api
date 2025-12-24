"use strict";
/**
 * Configuration controller
 * Handles system configuration endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const config_repository_1 = require("../repositories/config.repository");
const constants_1 = require("../config/constants");
class ConfigController {
    configRepository;
    constructor() {
        this.configRepository = config_repository_1.ConfigRepository.getInstance();
    }
    /**
     * GET /api/v1/config/precision
     * Gets current decimal precision configuration
     */
    getPrecision = async (req, res) => {
        const config = this.configRepository.getDecimalPrecisionConfig();
        const response = {
            success: true,
            data: config,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTimeMs: Date.now() - req.startTime,
            },
        };
        res.status(constants_1.HTTP_STATUS.OK).json(response);
    };
    /**
     * PUT /api/v1/config/precision
     * Updates decimal precision configuration
     */
    updatePrecision = async (req, res) => {
        const { decimalPlaces } = req.body;
        const config = this.configRepository.setDecimalPrecision(decimalPlaces);
        const response = {
            success: true,
            data: config,
            metadata: {
                timestamp: new Date().toISOString(),
                processingTimeMs: Date.now() - req.startTime,
            },
        };
        res.status(constants_1.HTTP_STATUS.OK).json(response);
    };
}
exports.ConfigController = ConfigController;
//# sourceMappingURL=config.controller.js.map