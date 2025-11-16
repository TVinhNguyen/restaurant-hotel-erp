import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Request Logger Middleware
 *
 * Adds structured logging for all HTTP requests with:
 * - Unique request ID for tracing
 * - Request method, URL, and timestamp
 * - Response status code and duration
 * - Error tracking
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    // Generate unique request ID for tracing
    const requestId = uuidv4();
    (req as Request & { requestId: string }).requestId = requestId;

    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || 'unknown';
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(
      `→ [${requestId}] ${method} ${originalUrl} | IP: ${ip} | UA: ${userAgent}`,
    );

    // Capture response finish event
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const contentLength = res.get('content-length') || 0;

      // Determine log level based on status code
      const logLevel =
        statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';
      const statusEmoji =
        statusCode >= 500 ? '❌' : statusCode >= 400 ? '⚠️' : '✓';

      this.logger[logLevel](
        `${statusEmoji} [${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms | ${contentLength} bytes`,
      );
    });

    // Capture response error event
    res.on('error', (error: Error) => {
      this.logger.error(
        `💥 [${requestId}] ${method} ${originalUrl} - Error: ${error.message}`,
        error.stack,
      );
    });

    next();
  }
}
