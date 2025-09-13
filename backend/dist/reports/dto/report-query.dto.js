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
exports.RestaurantReportDto = exports.RevenueReportDto = exports.OccupancyReportDto = exports.ReportQueryDto = exports.ReportPeriod = void 0;
const class_validator_1 = require("class-validator");
var ReportPeriod;
(function (ReportPeriod) {
    ReportPeriod["DAILY"] = "daily";
    ReportPeriod["WEEKLY"] = "weekly";
    ReportPeriod["MONTHLY"] = "monthly";
    ReportPeriod["YEARLY"] = "yearly";
    ReportPeriod["CUSTOM"] = "custom";
})(ReportPeriod || (exports.ReportPeriod = ReportPeriod = {}));
class ReportQueryDto {
    propertyId;
    startDate;
    endDate;
    period;
}
exports.ReportQueryDto = ReportQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ReportPeriod),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "period", void 0);
class OccupancyReportDto extends ReportQueryDto {
}
exports.OccupancyReportDto = OccupancyReportDto;
class RevenueReportDto extends ReportQueryDto {
    roomTypeId;
}
exports.RevenueReportDto = RevenueReportDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RevenueReportDto.prototype, "roomTypeId", void 0);
class RestaurantReportDto extends ReportQueryDto {
    restaurantId;
}
exports.RestaurantReportDto = RestaurantReportDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RestaurantReportDto.prototype, "restaurantId", void 0);
//# sourceMappingURL=report-query.dto.js.map