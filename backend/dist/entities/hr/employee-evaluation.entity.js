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
exports.EmployeeEvaluation = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../core/employee.entity");
let EmployeeEvaluation = class EmployeeEvaluation {
    id;
    employeeId;
    evaluatedBy;
    rate;
    period;
    goals;
    strength;
    improvement;
    comments;
    createdAt;
    updatedAt;
    employee;
    evaluator;
};
exports.EmployeeEvaluation = EmployeeEvaluation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'evaluated_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "evaluatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], EmployeeEvaluation.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "goals", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "strength", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "improvement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmployeeEvaluation.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], EmployeeEvaluation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], EmployeeEvaluation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, employee => employee.evaluations),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeEvaluation.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'evaluated_by' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeEvaluation.prototype, "evaluator", void 0);
exports.EmployeeEvaluation = EmployeeEvaluation = __decorate([
    (0, typeorm_1.Entity)({ schema: 'hr', name: 'employee_evaluations' })
], EmployeeEvaluation);
//# sourceMappingURL=employee-evaluation.entity.js.map