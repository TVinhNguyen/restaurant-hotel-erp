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
exports.Overtime = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../core/employee.entity");
const working_shift_entity_1 = require("./working-shift.entity");
let Overtime = class Overtime {
    id;
    employeeId;
    workingShiftId;
    numberOfHours;
    rate;
    amount;
    approvedBy;
    createdAt;
    updatedAt;
    employee;
    workingShift;
    approver;
};
exports.Overtime = Overtime;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Overtime.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid' }),
    __metadata("design:type", String)
], Overtime.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'working_shift_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Overtime.prototype, "workingShiftId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_of_hours', type: 'decimal', precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], Overtime.prototype, "numberOfHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2 }),
    __metadata("design:type", Number)
], Overtime.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Overtime.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Overtime.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Overtime.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Overtime.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.overtimes),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Overtime.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => working_shift_entity_1.WorkingShift, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'working_shift_id' }),
    __metadata("design:type", working_shift_entity_1.WorkingShift)
], Overtime.prototype, "workingShift", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", employee_entity_1.Employee)
], Overtime.prototype, "approver", void 0);
exports.Overtime = Overtime = __decorate([
    (0, typeorm_1.Entity)({ schema: 'hr', name: 'overtimes' })
], Overtime);
//# sourceMappingURL=overtime.entity.js.map