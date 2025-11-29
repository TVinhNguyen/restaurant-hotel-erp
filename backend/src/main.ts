import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Enable security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow embedding in admin/frontend
    }),
  );

  // Enable CORS - Allow all origins for public API access
  const corsOrigins = configService.get('CORS_ORIGINS');
  app.enableCors({
    origin: corsOrigins ? corsOrigins.split(',') : true, // true = allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 3600, // Cache preflight requests for 1 hour
  });

  // Global prefix for API
  app.setGlobalPrefix('api');

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Setup Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Restaurant-Hotel ERP API')
    .setDescription(
      'Comprehensive API documentation for Property Management System, Restaurant Management, and HR system',
    )
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
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addTag('Properties', 'Property management endpoints')
    .addTag('Guests', 'Guest management endpoints')
    .addTag('Reservations', 'Reservation booking and management')
    .addTag('Rooms', 'Room inventory management')
    .addTag('Room Types', 'Room type configuration')
    .addTag('Payments', 'Payment processing endpoints')
    .addTag('Employees', 'Employee management')
    .addTag('Restaurants', 'Restaurant management')
    .addTag('Services', 'Property services management')
    .addTag('HR', 'Human resources management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Restaurant-Hotel ERP API',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  logger.log(
    `📚 API Documentation available at: http://localhost:${configService.get('PORT') || 4000}/api/docs`,
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable validation with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
    }),
  );

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

void bootstrap();
