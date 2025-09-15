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
exports.CreateEmployeeEvaluationDto = exports.EvaluationPeriod = void 0;
const class_validator_1 = require("class-validator");
var EvaluationPeriod;
(function (EvaluationPeriod) {
    EvaluationPeriod["QUARTERLY"] = "quarterly";
    EvaluationPeriod["ANNUAL"] = "annual";
})(EvaluationPeriod || (exports.EvaluationPeriod = EvaluationPeriod = {}));
class CreateEmployeeEvaluationDto {
    employeeId;
    evaluatedBy;
    rate;
    period;
    goals;
    strength;
    improvement;
    comments;
}
exports.CreateEmployeeEvaluationDto = CreateEmployeeEvaluationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeEvaluationDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeEvaluationDto.prototype, "evaluatedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateEmployeeEvaluationDto.prototype, "rate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(EvaluationPeriod),
    __metadata("design:type", String)
], CreateEmployeeEvaluationDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeEvaluationDto.prototype, "goals", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeEvaluationDto.prototype, "strength", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeEvaluationDto.prototype, "improvement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeEvaluationDto.prototype, "comments", void 0);
//# sourceMappingURL=create-employee-evaluation.dto.js.map