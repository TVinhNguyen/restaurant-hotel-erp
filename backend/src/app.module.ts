import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { GuestsModule } from './guests/guests.module';
import { RoomTypesModule } from './room-types/room-types.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { EmployeesModule } from './employees/employees.module';
import { ServicesModule } from './services/services.module';
import { RatePlansModule } from './rate-plans/rate-plans.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ReportsModule } from './reports/reports.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayrollModule } from './payroll/payroll.module';
import { LeaveModule } from './leave/leave.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'hotel_user_v2',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'hotel_pms_v2',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    GuestsModule,
    RoomTypesModule,
    RoomsModule,
    ReservationsModule,
    PaymentsModule,
    EmployeesModule,
    ServicesModule,
    RatePlansModule,
    RestaurantsModule,
    ReportsModule,
    AttendanceModule,
    PayrollModule,
    LeaveModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
