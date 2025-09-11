"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const health_controller_1 = require("./health.controller");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const properties_module_1 = require("./properties/properties.module");
const guests_module_1 = require("./guests/guests.module");
const room_types_module_1 = require("./room-types/room-types.module");
const rooms_module_1 = require("./rooms/rooms.module");
const reservations_module_1 = require("./reservations/reservations.module");
const payments_module_1 = require("./payments/payments.module");
const employees_module_1 = require("./employees/employees.module");
const services_module_1 = require("./services/services.module");
const rate_plans_module_1 = require("./rate-plans/rate-plans.module");
const restaurants_module_1 = require("./restaurants/restaurants.module");
const reports_module_1 = require("./reports/reports.module");
const attendance_module_1 = require("./attendance/attendance.module");
const payroll_module_1 = require("./payroll/payroll.module");
const leave_module_1 = require("./leave/leave.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
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
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            properties_module_1.PropertiesModule,
            guests_module_1.GuestsModule,
            room_types_module_1.RoomTypesModule,
            rooms_module_1.RoomsModule,
            reservations_module_1.ReservationsModule,
            payments_module_1.PaymentsModule,
            employees_module_1.EmployeesModule,
            services_module_1.ServicesModule,
            rate_plans_module_1.RatePlansModule,
            restaurants_module_1.RestaurantsModule,
            reports_module_1.ReportsModule,
            attendance_module_1.AttendanceModule,
            payroll_module_1.PayrollModule,
            leave_module_1.LeaveModule,
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map