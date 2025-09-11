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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/user.entity");
const employee_role_entity_1 = require("./employee-role.entity");
const working_shift_entity_1 = require("../hr/working-shift.entity");
const attendance_entity_1 = require("../hr/attendance.entity");
const leave_entity_1 = require("../hr/leave.entity");
const employee_evaluation_entity_1 = require("../hr/employee-evaluation.entity");
const payroll_entity_1 = require("../hr/payroll.entity");
const overtime_entity_1 = require("../hr/overtime.entity");
const deduction_entity_1 = require("../hr/deduction.entity");
let Employee = class Employee {
    id;
    userId;
    employeeCode;
    fullName;
    department;
    status;
    hireDate;
    terminationDate;
    user;
    employeeRoles;
    workingShifts;
    attendances;
    leaves;
    evaluations;
    payrolls;
    overtimes;
    deductions;
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 150 }),
    __metadata("design:type", String)
], Employee.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'active' }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hire_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "hireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'termination_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "terminationDate", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Employee.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_role_entity_1.EmployeeRole, (employeeRole) => employeeRole.employee),
    __metadata("design:type", Array)
], Employee.prototype, "employeeRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => working_shift_entity_1.WorkingShift, (workingShift) => workingShift.employee),
    __metadata("design:type", Array)
], Employee.prototype, "workingShifts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendance_entity_1.Attendance, (attendance) => attendance.employee),
    __metadata("design:type", Array)
], Employee.prototype, "attendances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => leave_entity_1.Leave, (leave) => leave.employee),
    __metadata("design:type", Array)
], Employee.prototype, "leaves", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_evaluation_entity_1.EmployeeEvaluation, (evaluation) => evaluation.employee),
    __metadata("design:type", Array)
], Employee.prototype, "evaluations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payroll_entity_1.Payroll, (payroll) => payroll.employee),
    __metadata("design:type", Array)
], Employee.prototype, "payrolls", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => overtime_entity_1.Overtime, (overtime) => overtime.employee),
    __metadata("design:type", Array)
], Employee.prototype, "overtimes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => deduction_entity_1.Deduction, (deduction) => deduction.employee),
    __metadata("design:type", Array)
], Employee.prototype, "deductions", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)({ schema: 'core', name: 'employees' })
], Employee);
//# sourceMappingURL=employee.entity.js.map