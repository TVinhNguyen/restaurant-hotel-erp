import { INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { HealthController } from '../src/health.controller';
import { MessagingService } from '../src/infra.messaging';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let messagingService: jest.Mocked<Pick<MessagingService, 'getHealth'>>;
  const dataSourceMock = {
    query: jest.fn().mockResolvedValue([1]),
  } as unknown as DataSource;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        {
          provide: MessagingService,
          useValue: {
            getHealth: jest.fn().mockReturnValue({ connected: true }),
          },
        },
      ],
    }).compile();

    messagingService = moduleRef.get(MessagingService);

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns healthy status when dependencies are up', async () => {
    messagingService.getHealth.mockReturnValue({ connected: true });

    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.checks.database.status).toBe('connected');
    expect(response.body.checks.rabbitmq.connected).toBe(true);
  });

  it('marks service as degraded when messaging is offline', async () => {
    messagingService.getHealth.mockReturnValue({
      connected: false,
      lastError: 'connection lost',
    });

    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body.status).toBe('degraded');
    expect(response.body.checks.rabbitmq.connected).toBe(false);
    expect(response.body.checks.rabbitmq.lastError).toBe('connection lost');
  });

  it('responds to ping endpoint without hitting database', async () => {
    const initialCallCount = dataSourceMock.query.mock.calls.length;

    await request(app.getHttpServer())
      .get('/api/v1/health/ping')
      .expect(200)
      .expect(({ body }) => {
        expect(body.ok).toBe(true);
        expect(body).toHaveProperty('timestamp');
      });

    expect(dataSourceMock.query).toHaveBeenCalledTimes(initialCallCount);
  });
});
