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
exports.Leave = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../core/employee.entity");
let Leave = class Leave {
    id;
    employeeId;
    leaveDate;
    numberOfDays;
    leaveType;
    status;
    reason;
    approvedBy;
    hrNote;
    createdAt;
    updatedAt;
    employee;
    approver;
};
exports.Leave = Leave;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Leave.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid' }),
    __metadata("design:type", String)
], Leave.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_date', type: 'date' }),
    __metadata("design:type", Date)
], Leave.prototype, "leaveDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_of_days', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Leave.prototype, "numberOfDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_type', length: 20 }),
    __metadata("design:type", String)
], Leave.prototype, "leaveType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'pending' }),
    __metadata("design:type", String)
], Leave.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Leave.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Leave.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hr_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Leave.prototype, "hrNote", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Leave.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Leave.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.leaves),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Leave.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", employee_entity_1.Employee)
], Leave.prototype, "approver", void 0);
exports.Leave = Leave = __decorate([
    (0, typeorm_1.Entity)({ schema: 'hr', name: 'leaves' })
], Leave);
//# sourceMappingURL=leave.entity.js.map