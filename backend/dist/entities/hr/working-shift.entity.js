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
exports.WorkingShift = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../core/property.entity");
const employee_entity_1 = require("../core/employee.entity");
const attendance_entity_1 = require("./attendance.entity");
const overtime_entity_1 = require("./overtime.entity");
let WorkingShift = class WorkingShift {
    id;
    propertyId;
    employeeId;
    workingDate;
    startTime;
    endTime;
    shiftType;
    notes;
    isReassigned;
    createdAt;
    updatedAt;
    property;
    employee;
    attendances;
    overtimes;
};
exports.WorkingShift = WorkingShift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkingShift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], WorkingShift.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], WorkingShift.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'working_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], WorkingShift.prototype, "workingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], WorkingShift.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], WorkingShift.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shift_type', length: 20, nullable: true }),
    __metadata("design:type", String)
], WorkingShift.prototype, "shiftType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkingShift.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_reassigned', default: false, nullable: true }),
    __metadata("design:type", Boolean)
], WorkingShift.prototype, "isReassigned", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WorkingShift.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WorkingShift.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, property => property.workingShifts),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], WorkingShift.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, employee => employee.workingShifts),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], WorkingShift.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendance_entity_1.Attendance, attendance => attendance.workingShift),
    __metadata("design:type", Array)
], WorkingShift.prototype, "attendances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => overtime_entity_1.Overtime, overtime => overtime.workingShift),
    __metadata("design:type", Array)
], WorkingShift.prototype, "overtimes", void 0);
exports.WorkingShift = WorkingShift = __decorate([
    (0, typeorm_1.Entity)({ schema: 'hr', name: 'working_shifts' })
], WorkingShift);
//# sourceMappingURL=working-shift.entity.js.map