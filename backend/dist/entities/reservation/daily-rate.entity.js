"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyRate = void 0;
const typeorm_1 = require("typeorm");
const rate_plan_entity_1 = require("./rate-plan.entity");
let DailyRate = class DailyRate {
    id;
    ratePlanId;
    date;
    price;
    availableRooms;
    stopSell;
    ratePlan;
};
exports.DailyRate = DailyRate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyRate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_plan_id', type: 'uuid' }),
    __metadata("design:type", String)
], DailyRate.prototype, "ratePlanId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], DailyRate.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], DailyRate.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'available_rooms', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DailyRate.prototype, "availableRooms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stop_sell', default: false }),
    __metadata("design:type", Boolean)
], DailyRate.prototype, "stopSell", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rate_plan_entity_1.RatePlan, (ratePlan) => ratePlan.dailyRates),
    (0, typeorm_1.JoinColumn)({ name: 'rate_plan_id' }),
    __metadata("design:type", rate_plan_entity_1.RatePlan)
], DailyRate.prototype, "ratePlan", void 0);
exports.DailyRate = DailyRate = __decorate([
    (0, typeorm_1.Entity)({ schema: 'reservation', name: 'daily_rates' }),
    (0, typeorm_1.Index)(['ratePlanId', 'date'], { unique: true })
], DailyRate);
//# sourceMappingURL=daily-rate.entity.js.map