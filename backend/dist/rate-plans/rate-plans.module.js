"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatePlansModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rate_plans_controller_1 = require("./rate-plans.controller");
const rate_plans_service_1 = require("./rate-plans.service");
const rate_plan_entity_1 = require("../entities/reservation/rate-plan.entity");
const daily_rate_entity_1 = require("../entities/reservation/daily-rate.entity");
let RatePlansModule = class RatePlansModule {
};
exports.RatePlansModule = RatePlansModule;
exports.RatePlansModule = RatePlansModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([rate_plan_entity_1.RatePlan, daily_rate_entity_1.DailyRate])],
        controllers: [rate_plans_controller_1.RatePlansController],
        providers: [rate_plans_service_1.RatePlansService],
        exports: [rate_plans_service_1.RatePlansService],
    })
], RatePlansModule);
//# sourceMappingURL=rate-plans.module.js.map