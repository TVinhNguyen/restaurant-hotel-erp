import { Logger } from '@nestjs/common';

/**
 * Base Service Class
 *
 * Provides common functionality for all services including:
 * - Structured error handling
 * - Consistent logging
 * - Error tracking with context
 *
 * Usage:
 * export class YourService extends BaseService {
 *   protected logger = new Logger(YourService.name);
 *
 *   async someMethod() {
 *     return this.executeWithErrorHandling('Operation name', async () => {
 *       // Your logic here
 *     });
 *   }
 * }
 */
export abstract class BaseService {
  protected abstract logger: Logger;

  /**
   * Execute operation with consistent error handling and logging
   *
   * @param operation - Human-readable operation name for logging
   * @param fn - Async function to execute
   * @param context - Optional additional context for error logging
   * @returns Result of the function execution
   * @throws Re-throws the original error after logging
   */
  protected async executeWithErrorHandling<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, any>,
  ): Promise<T> {
    try {
      this.logger.log(`Starting: ${operation}`, context);
      const result = await fn();
      this.logger.log(`Completed: ${operation}`);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed: ${operation} - ${errorMessage}`,
        errorStack,
        context,
      );

      // Re-throw to let NestJS exception filters handle it
      throw error;
    }
  }

  /**
   * Log a warning with consistent formatting
   */
  protected logWarning(message: string, context?: Record<string, any>): void {
    this.logger.warn(message, context);
  }

  /**
   * Log debug information in development
   */
  protected logDebug(message: string, context?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(message, context);
    }
  }
}
