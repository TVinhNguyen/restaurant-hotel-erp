import {
  Global,
  Injectable,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Channel,
  ChannelModel,
  ConsumeMessage,
  Options,
  Replies,
  connect,
} from 'amqplib';

export type MessageHandler<T> = (
  payload: T,
  raw: ConsumeMessage,
) => Promise<void> | void;

export const MessagingQueues = {
  ReservationConfirmed: 'reservation.confirmed',
  ReservationCancelled: 'reservation.cancelled',
  ReservationCheckedIn: 'reservation.checked_in',
  ReservationCheckedOut: 'reservation.checked_out',
  PaymentProcessed: 'payment.processed',
  ReportJob: 'report.job',
} as const;

const MAX_RECONNECT_ATTEMPTS = 5;

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private connection?: ChannelModel;
  private channel?: Channel;
  private readonly logger = new Logger(MessagingService.name);
  private readonly rabbitUrl?: string;
  private readonly prefetch: number;
  private isConnected = false;
  private lastError?: string;
  private shuttingDown = false;

  constructor(private readonly configService: ConfigService) {
    this.rabbitUrl = this.configService.get<string>('RABBITMQ_URL');
    this.prefetch = this.configService.get<number>('RABBITMQ_PREFETCH') ?? 5;
  }

  async onModuleInit(): Promise<void> {
    if (!this.rabbitUrl) {
      this.logger.warn(
        'RABBITMQ_URL not provided. Messaging layer stays disabled.',
      );
      return;
    }

    await this.connectWithRetry();
  }

  async onModuleDestroy(): Promise<void> {
    this.shuttingDown = true;
    await this.channel
      ?.close()
      .catch((error: unknown) =>
        this.logger.error(
          'Failed to close RabbitMQ channel gracefully',
          error instanceof Error ? error.stack : undefined,
        ),
      );
    await this.connection
      ?.close()
      .catch((error: unknown) =>
        this.logger.error(
          'Failed to close RabbitMQ connection gracefully',
          error instanceof Error ? error.stack : undefined,
        ),
      );
  }

  /** Publish JSON payload to a durable queue. */
  async publish<T>(
    queue: string,
    payload: T,
    options: Options.Publish = {},
  ): Promise<boolean> {
    if (!this.channel) {
      this.logger.warn(`Skipping publish to ${queue}: channel not ready.`);
      return false;
    }

    await this.channel.assertQueue(queue, { durable: true });
    const buffer = Buffer.from(JSON.stringify(payload));
    return this.channel.sendToQueue(queue, buffer, {
      persistent: true,
      contentType: 'application/json',
      timestamp: Date.now(),
      ...options,
    });
  }

  /** Register a consumer with automatic ack/nack handling. */
  async consume<T>(
    queue: string,
    handler: MessageHandler<T>,
    options: Options.Consume = {},
  ): Promise<Replies.Consume | void> {
    if (!this.channel) {
      this.logger.warn(`Skipping consume for ${queue}: channel not ready.`);
      return;
    }

    await this.channel.assertQueue(queue, { durable: true });

    return this.channel.consume(
      queue,
      (message) => {
        void (async () => {
          if (!message) {
            return;
          }

          try {
            const parsed = JSON.parse(message.content.toString()) as T;
            await handler(parsed, message);
            this.channel?.ack(message);
          } catch (error) {
            const err =
              error instanceof Error
                ? error
                : new Error('Unknown error while processing message');
            this.logger.error(`Handler for ${queue} failed`, err.stack);
            // Dead-letter instead of requeue to avoid infinite loops for poison messages
            this.channel?.nack(message, false, false);
          }
        })();
      },
      {
        noAck: false,
        ...options,
      },
    );
  }

  /** Lightweight readiness indicator for health checks. */
  getHealth() {
    return {
      connected: this.isConnected,
      lastError: this.lastError,
    };
  }

  private async connectWithRetry(attempt = 1): Promise<void> {
    try {
      await this.establishConnection();
    } catch (error: unknown) {
      this.isConnected = false;
      this.lastError = error instanceof Error ? error.message : 'Unknown error';

      if (attempt > MAX_RECONNECT_ATTEMPTS) {
        this.logger.error(
          'RabbitMQ connection failed after maximum retries',
          error instanceof Error ? error.stack : undefined,
        );
        return;
      }

      const delay = Math.min(5000 * attempt, 30000);
      this.logger.warn(
        `RabbitMQ connection failed (attempt ${attempt}). Retrying in ${delay / 1000}s...`,
      );
      await this.sleep(delay);
      await this.connectWithRetry(attempt + 1);
    }
  }

  private async establishConnection(): Promise<void> {
    if (!this.rabbitUrl) {
      throw new Error('RABBITMQ_URL is not configured');
    }

    this.connection = await connect(this.rabbitUrl);
    this.connection.on(
      'close',
      () => void this.handleDisconnect('Connection closed by broker.'),
    );
    this.connection.on('error', (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      void this.handleDisconnect(`Connection error: ${message}`);
    });

    this.channel = await this.connection.createChannel();
    await this.channel.prefetch(this.prefetch);
    this.isConnected = true;
    this.lastError = undefined;
    this.logger.log('RabbitMQ channel established successfully');
  }

  private async handleDisconnect(reason: string): Promise<void> {
    if (this.shuttingDown) {
      return;
    }

    this.logger.warn(`RabbitMQ disconnected: ${reason}`);
    this.isConnected = false;
    this.lastError = reason;
    await this.connectWithRetry();
  }

  private sleep(duration: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
}

@Global()
@Module({
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
