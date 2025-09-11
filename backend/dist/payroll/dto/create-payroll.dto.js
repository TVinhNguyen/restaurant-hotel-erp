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
exports.BulkPayrollDto = exports.UpdatePayrollDto = exports.CreatePayrollDto = exports.PayrollStatus = void 0;
const class_validator_1 = require("class-validator");
var PayrollStatus;
(function (PayrollStatus) {
    PayrollStatus["PENDING"] = "pending";
    PayrollStatus["PROCESSED"] = "processed";
    PayrollStatus["PAID"] = "paid";
    PayrollStatus["CANCELLED"] = "cancelled";
})(PayrollStatus || (exports.PayrollStatus = PayrollStatus = {}));
class CreatePayrollDto {
    employeeId;
    period;
    basicSalary;
    netSalary;
    bonus;
    currency;
}
exports.CreatePayrollDto = CreatePayrollDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePayrollDto.prototype, "basicSalary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePayrollDto.prototype, "netSalary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePayrollDto.prototype, "bonus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "currency", void 0);
class UpdatePayrollDto {
    period;
    basicSalary;
    netSalary;
    bonus;
    currency;
}
exports.UpdatePayrollDto = UpdatePayrollDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePayrollDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePayrollDto.prototype, "basicSalary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePayrollDto.prototype, "netSalary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePayrollDto.prototype, "bonus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePayrollDto.prototype, "currency", void 0);
class BulkPayrollDto {
    period;
    payrolls;
}
exports.BulkPayrollDto = BulkPayrollDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkPayrollDto.prototype, "period", void 0);
//# sourceMappingURL=create-payroll.dto.js.map