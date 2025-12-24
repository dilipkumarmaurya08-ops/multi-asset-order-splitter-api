/**
 * Express application configuration
 * Optimized for high-traffic scenarios (1M+ requests)
 * Sets up middleware, routes, and error handling
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { APP_CONFIG, RATE_LIMIT_CONFIG } from './config/constants';
import { performanceMiddleware } from './middleware/performance.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import routes from './routes';
import { logger } from './utils/logger';

/**
 * Creates and configures Express application
 * Optimized for extreme high traffic
 */
export function createApp(): Application {
  const app = express();

  // ============================================================================
  // Performance Optimizations
  // ============================================================================

  // Disable unnecessary features for performance
  app.disable('x-powered-by');
  app.disable('etag'); // Disable if not using caching

  // Set production mode
  app.set('env', APP_CONFIG.NODE_ENV);

  // Trust proxy for rate limiting behind load balancer
  app.set('trust proxy', 1);

  // ============================================================================
  // Security Middleware
  // ============================================================================

  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable if causing issues
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400, // 24 hours
    })
  );

  // Rate limiting (high-traffic ready: 10,000 req/min per IP)
  const limiter = rateLimit({
    windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
    max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
    message: RATE_LIMIT_CONFIG.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: RATE_LIMIT_CONFIG.SKIP_SUCCESSFUL_REQUESTS,
    // Skip rate limit in development
    skip: () => APP_CONFIG.NODE_ENV === 'development',
    // Use Redis in production for distributed rate limiting
    // store: new RedisStore({ client: redisClient })
  });
  app.use(limiter);

  // ============================================================================
  // Parsing Middleware
  // ============================================================================

  // Body parser with limits
  app.use(express.json({ 
    limit: '1mb', // Limit payload size
    strict: true,
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '1mb',
    parameterLimit: 1000,
  }));

  // Compression for response bodies
  app.use(compression({
    level: 6, // Balance between speed and compression
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  }));

  // ============================================================================
  // Logging Middleware
  // ============================================================================

  // HTTP request logger (Morgan) - optimized format
  if (APP_CONFIG.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    // Production: use JSON format for log aggregation
    app.use(morgan('combined', {
      skip: (_req, res) => res.statusCode < 400, // Only log errors in production
    }));
  }

  // Performance monitoring
  app.use(performanceMiddleware);

  // ============================================================================
  // API Routes
  // ============================================================================

  // Root endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        name: 'Multi-Asset Order Splitter API',
        version: '2.0.0',
        description: 'High-performance order splitting API for robo-advisor portfolio management',
        features: [
          'Multi-asset support (stocks, ETFs, crypto, commodities, bonds)',
          'Dual input modes (allocation & amount)',
          'Optimized for 1M+ requests',
          'Advanced indexing & caching',
        ],
        documentation: `${APP_CONFIG.API_PREFIX}/docs`,
        health: `${APP_CONFIG.API_PREFIX}/health`,
      },
    });
  });

  // API routes
  app.use(APP_CONFIG.API_PREFIX, routes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ============================================================================
  // Error Handling
  // ============================================================================

  // Global error handler (must be last)
  app.use(errorMiddleware);

  // ============================================================================
  // Graceful Shutdown Handlers
  // ============================================================================

  process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', error);
    // In production, exit gracefully and let process manager restart
    if (APP_CONFIG.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  // Memory monitoring for high-traffic scenarios
  if (APP_CONFIG.NODE_ENV === 'production') {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      
      if (heapUsedMB > 1024) { // Alert if > 1GB
        logger.warn('High memory usage detected', {
          heapUsedMB,
          heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
          rssMB: Math.round(memUsage.rss / 1024 / 1024),
        });
      }
    }, 60000); // Check every minute
  }

  return app;
}