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
exports.Deduction = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../core/employee.entity");
const leave_entity_1 = require("./leave.entity");
let Deduction = class Deduction {
    id;
    employeeId;
    leaveId;
    type;
    amount;
    date;
    reasonDetails;
    createdAt;
    updatedAt;
    employee;
    leave;
};
exports.Deduction = Deduction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Deduction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid' }),
    __metadata("design:type", String)
], Deduction.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Deduction.prototype, "leaveId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Deduction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Deduction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Deduction.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason_details', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Deduction.prototype, "reasonDetails", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Deduction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Deduction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.deductions),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Deduction.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_entity_1.Leave, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'leave_id' }),
    __metadata("design:type", leave_entity_1.Leave)
], Deduction.prototype, "leave", void 0);
exports.Deduction = Deduction = __decorate([
    (0, typeorm_1.Entity)({ schema: 'hr', name: 'deductions' })
], Deduction);
//# sourceMappingURL=deduction.entity.js.map