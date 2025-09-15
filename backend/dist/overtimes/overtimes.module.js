"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvertimesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const overtimes_controller_1 = require("./overtimes.controller");
const overtimes_service_1 = require("./overtimes.service");
const overtime_entity_1 = require("../entities/hr/overtime.entity");
let OvertimesModule = class OvertimesModule {
};
exports.OvertimesModule = OvertimesModule;
exports.OvertimesModule = OvertimesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([overtime_entity_1.Overtime])],
        controllers: [overtimes_controller_1.OvertimesController],
        providers: [overtimes_service_1.OvertimesService],
        exports: [overtimes_service_1.OvertimesService]
    })
], OvertimesModule);
//# sourceMappingURL=overtimes.module.js.map