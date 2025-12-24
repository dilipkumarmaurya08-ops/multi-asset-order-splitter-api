/**
 * Performance monitoring middleware
 * Tracks and logs response times for all requests
 */
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            startTime?: number;
        }
    }
}
/**
 * Middleware to track request processing time
 * Logs performance metrics to console for visibility
 */
export declare const performanceMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=performance.middleware.d.ts.map