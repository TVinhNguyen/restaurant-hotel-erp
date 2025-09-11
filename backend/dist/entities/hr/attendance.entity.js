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
exports.Attendance = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../core/employee.entity");
const working_shift_entity_1 = require("./working-shift.entity");
let Attendance = class Attendance {
    id;
    employeeId;
    workingShiftId;
    checkInTime;
    checkOutTime;
    notes;
    employee;
    workingShift;
};
exports.Attendance = Attendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid' }),
    __metadata("design:type", String)
], Attendance.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'working_shift_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "workingShiftId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkInTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Attendance.prototype, "checkOutTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.attendances),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Attendance.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => working_shift_entity_1.WorkingShift, (workingShift) => workingShift.attendances, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'working_shift_id' }),
    __metadata("design:type", working_shift_entity_1.WorkingShift)
], Attendance.prototype, "workingShift", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)({ schema: 'hr', name: 'attendance' })
], Attendance);
//# sourceMappingURL=attendance.entity.js.map