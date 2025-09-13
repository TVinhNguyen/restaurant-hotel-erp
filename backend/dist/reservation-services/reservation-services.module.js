"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationServicesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reservation_services_controller_1 = require("./reservation-services.controller");
const reservation_services_service_1 = require("./reservation-services.service");
const reservation_service_entity_1 = require("../entities/reservation/reservation-service.entity");
let ReservationServicesModule = class ReservationServicesModule {
};
exports.ReservationServicesModule = ReservationServicesModule;
exports.ReservationServicesModule = ReservationServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reservation_service_entity_1.ReservationService])],
        controllers: [reservation_services_controller_1.ReservationServicesController],
        providers: [reservation_services_service_1.ReservationServicesService],
        exports: [reservation_services_service_1.ReservationServicesService],
    })
], ReservationServicesModule);
//# sourceMappingURL=reservation-services.module.js.map