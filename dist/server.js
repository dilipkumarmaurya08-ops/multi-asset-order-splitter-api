"use strict";
/**
 * Server entry point
 * Starts the Express server
 */
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const constants_1 = require("./config/constants");
const logger_1 = require("./utils/logger");
// Create Express app
const app = (0, app_1.createApp)();
// Start server
const server = app.listen(constants_1.APP_CONFIG.PORT, () => {
    logger_1.logger.info('🚀 Multi-Asset Order Splitter API Started', {
        environment: constants_1.APP_CONFIG.NODE_ENV,
        port: constants_1.APP_CONFIG.PORT,
        apiVersion: constants_1.APP_CONFIG.API_VERSION,
        processId: process.pid,
        nodeVersion: process.version,
    });
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 MULTI-ASSET ORDER SPLITTER API - RUNNING                ║
║                                                               ║
║   Environment:  ${constants_1.APP_CONFIG.NODE_ENV.padEnd(46)}║
║   Port:         ${String(constants_1.APP_CONFIG.PORT).padEnd(46)}║
║   API Version:  ${constants_1.APP_CONFIG.API_VERSION.padEnd(46)}║
║                                                               ║
║   📚 Features:                                                ║
║   • Multi-asset support (6 types)                            ║
║   • Dual input modes (allocation & amount)                   ║
║   • Optimized for 1M+ requests                               ║
║   • High-performance indexing                                ║
║                                                               ║
║   🌐 Endpoints:                                               ║
║   http://localhost:${constants_1.APP_CONFIG.PORT}${constants_1.APP_CONFIG.API_PREFIX.padEnd(34)}║
║                                                               ║
║   🏥 Health:                                                  ║
║   http://localhost:${constants_1.APP_CONFIG.PORT}${constants_1.APP_CONFIG.API_PREFIX}/health${' '.repeat(27)}║
║                                                               ║
║   📊 Market Status:                                           ║
║   http://localhost:${constants_1.APP_CONFIG.PORT}${constants_1.APP_CONFIG.API_PREFIX}/market/status${' '.repeat(20)}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger_1.logger.info('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger_1.logger.info('Server closed');
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map