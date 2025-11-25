import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { GuestsModule } from './guests/guests.module';
import { RoomTypesModule } from './room-types/room-types.module';
import { RoomsModule } from './rooms/rooms.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { PhotosModule } from './photos/photos.module';
// import { RoomStatusHistoryModule } from './room-status-history/room-status-history.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { EmployeesModule } from './employees/employees.module';
import { ServicesModule } from './services/services.module';
import { RatePlansModule } from './rate-plans/rate-plans.module';
import { DailyRatesModule } from './daily-rates/daily-rates.module';
import { PromotionsModule } from './promotions/promotions.module';
import { TaxRulesModule } from './tax-rules/tax-rules.module';
import { ReservationServicesModule } from './reservation-services/reservation-services.module';
import { PropertyServicesModule } from './property-services/property-services.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
// import { ReportsModule } from './reports/reports.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayrollModule } from './payroll/payroll.module';
import { LeaveModule } from './leave/leave.module';
import { WorkingShiftsModule } from './working-shifts/working-shifts.module';
import { DeductionsModule } from './deductions/deductions.module';
import { OvertimesModule } from './overtimes/overtimes.module';
import { EmployeeEvaluationsModule } from './employee-evaluations/employee-evaluations.module';
import { PaymentModule } from './payment-pos/payment.module';
import { MessagingModule } from './infra.messaging';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Database Configuration (Required)
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        // JWT Configuration (Required)
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRATION: Joi.string().default('1d'),

        // Redis Configuration (Optional - for future use)
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),

        // RabbitMQ Configuration (Optional - for future use)
        RABBITMQ_URL: Joi.string().default('amqp://localhost:5672'),
        RABBITMQ_PREFETCH: Joi.number().min(1).max(50).default(5),

        // CORS Configuration (Optional)
        CORS_ORIGIN_FRONTEND: Joi.string().default('http://localhost:3000'),
        CORS_ORIGIN_ADMIN: Joi.string().default('http://localhost:3001')
      })
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute time window
        limit: 100 // 100 requests per minute (global default)
      }
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
          ttl: 300 // 5 minutes default TTL
        });
        return { store };
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'hotel_user_v2',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'hotel_pms_v2',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false
    }),
    MessagingModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    GuestsModule,
    // ROOMS & INVENTORY modules (working ones)
    RoomTypesModule,
    RoomsModule,
    AmenitiesModule,
    PhotosModule,
    // RoomStatusHistoryModule, // Disabled due to compilation errors
    // Other modules
    ReservationsModule,
    PaymentsModule,
    EmployeesModule,
    ServicesModule,
    RatePlansModule,
    DailyRatesModule,
    PromotionsModule,
    TaxRulesModule,
    ReservationServicesModule,
    PropertyServicesModule,
    RestaurantsModule, // ✅ ENABLED - Restaurant management module
    // ReportsModule, // Disabled due to compilation errors
    AttendanceModule,
    PayrollModule,
    LeaveModule,
    WorkingShiftsModule,
    DeductionsModule,
    OvertimesModule,
    EmployeeEvaluationsModule,
    PaymentModule
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard // Apply rate limiting globally
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*'); // Apply to all routes
  }
}
