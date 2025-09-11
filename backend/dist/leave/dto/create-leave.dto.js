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
exports.ApproveRejectLeaveDto = exports.UpdateLeaveDto = exports.CreateLeaveDto = exports.LeaveStatus = exports.LeaveType = void 0;
const class_validator_1 = require("class-validator");
var LeaveType;
(function (LeaveType) {
    LeaveType["ANNUAL"] = "annual";
    LeaveType["SICK"] = "sick";
    LeaveType["UNPAID"] = "unpaid";
    LeaveType["OTHER"] = "other";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "pending";
    LeaveStatus["APPROVED"] = "approved";
    LeaveStatus["REJECTED"] = "rejected";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
class CreateLeaveDto {
    employeeId;
    leaveDate;
    numberOfDays;
    leaveType;
    status;
    reason;
    approvedBy;
    hrNote;
}
exports.CreateLeaveDto = CreateLeaveDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "leaveDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveDto.prototype, "numberOfDays", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LeaveType),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "leaveType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LeaveStatus),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "approvedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "hrNote", void 0);
class UpdateLeaveDto {
    leaveDate;
    numberOfDays;
    leaveType;
    status;
    reason;
    approvedBy;
    hrNote;
}
exports.UpdateLeaveDto = UpdateLeaveDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateLeaveDto.prototype, "leaveDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLeaveDto.prototype, "numberOfDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LeaveType),
    __metadata("design:type", String)
], UpdateLeaveDto.prototype, "leaveType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LeaveStatus),
    __metadata("design:type", String)
], UpdateLeaveDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLeaveDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateLeaveDto.prototype, "approvedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLeaveDto.prototype, "hrNote", void 0);
class ApproveRejectLeaveDto {
    status;
    hrNote;
}
exports.ApproveRejectLeaveDto = ApproveRejectLeaveDto;
__decorate([
    (0, class_validator_1.IsEnum)(LeaveStatus),
    __metadata("design:type", String)
], ApproveRejectLeaveDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveRejectLeaveDto.prototype, "hrNote", void 0);
//# sourceMappingURL=create-leave.dto.js.map