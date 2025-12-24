/**
 * Server entry point
 * Starts the Express server
 */

import { createApp } from './app';
import { APP_CONFIG } from './config/constants';
import { logger } from './utils/logger';

// Create Express app
const app = createApp();

// Start server
const server = app.listen(APP_CONFIG.PORT, () => {
  logger.info('🚀 Multi-Asset Order Splitter API Started', {
    environment: APP_CONFIG.NODE_ENV,
    port: APP_CONFIG.PORT,
    apiVersion: APP_CONFIG.API_VERSION,
    processId: process.pid,
    nodeVersion: process.version,
  });

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 MULTI-ASSET ORDER SPLITTER API - RUNNING                ║
║                                                               ║
║   Environment:  ${APP_CONFIG.NODE_ENV.padEnd(46)}║
║   Port:         ${String(APP_CONFIG.PORT).padEnd(46)}║
║   API Version:  ${APP_CONFIG.API_VERSION.padEnd(46)}║
║                                                               ║
║   📚 Features:                                                ║
║   • Multi-asset support (6 types)                            ║
║   • Dual input modes (allocation & amount)                   ║
║   • Optimized for 1M+ requests                               ║
║   • High-performance indexing                                ║
║                                                               ║
║   🌐 Endpoints:                                               ║
║   http://localhost:${APP_CONFIG.PORT}${APP_CONFIG.API_PREFIX.padEnd(34)}║
║                                                               ║
║   🏥 Health:                                                  ║
║   http://localhost:${APP_CONFIG.PORT}${APP_CONFIG.API_PREFIX}/health${' '.repeat(27)}║
║                                                               ║
║   📊 Market Status:                                           ║
║   http://localhost:${APP_CONFIG.PORT}${APP_CONFIG.API_PREFIX}/market/status${' '.repeat(20)}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;