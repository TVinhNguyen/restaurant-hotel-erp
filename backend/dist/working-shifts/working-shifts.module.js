"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingShiftsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const working_shifts_controller_1 = require("./working-shifts.controller");
const working_shifts_service_1 = require("./working-shifts.service");
const working_shift_entity_1 = require("../entities/hr/working-shift.entity");
let WorkingShiftsModule = class WorkingShiftsModule {
};
exports.WorkingShiftsModule = WorkingShiftsModule;
exports.WorkingShiftsModule = WorkingShiftsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([working_shift_entity_1.WorkingShift])],
        controllers: [working_shifts_controller_1.WorkingShiftsController],
        providers: [working_shifts_service_1.WorkingShiftsService],
        exports: [working_shifts_service_1.WorkingShiftsService]
    })
], WorkingShiftsModule);
//# sourceMappingURL=working-shifts.module.js.map