import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // =================================================================
  // CẤU HÌNH QUAN TRỌNG ĐỂ FIX LỖI SWAGGER
  // =================================================================

  // 1. Tạm thời COMMENT dòng này khi chạy IP trực tiếp (không qua Domain/SSL)
  // Nếu bạn chạy qua Nginx/Load Balancer có SSL thì hãy mở lại.
  // app.set('trust proxy', 1); 

  // 2. Cấu hình Helmet: TẮT chế độ ép buộc HTTPS (upgradeInsecureRequests)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:', 'http:'],
          // QUAN TRỌNG: Dòng này tắt việc trình duyệt tự đổi sang HTTPS
          upgradeInsecureRequests: null, 
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Enable CORS
  const corsOrigins = configService.get('CORS_ORIGINS');
  app.enableCors({
    origin: corsOrigins ? corsOrigins.split(',') : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // =================================================================
  // SWAGGER CONFIG
  // =================================================================
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Restaurant-Hotel ERP API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth')
    .addTag('Guests')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Đường dẫn là 'docs' (truy cập: http://IP:4000/docs)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Restaurant-Hotel ERP API Docs',
  });

  // Global filters & pipes
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: 422,
    }),
  );

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);

  const appUrl = await app.getUrl();
  logger.log(`🚀 Application is running on: ${appUrl}/api`);
  logger.log(`📚 Swagger Documentation: http://localhost:${port}/docs`);
}

void bootstrap();