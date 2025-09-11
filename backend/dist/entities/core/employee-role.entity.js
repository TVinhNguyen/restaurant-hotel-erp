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
exports.EmployeeRole = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const property_entity_1 = require("./property.entity");
const role_entity_1 = require("../auth/role.entity");
let EmployeeRole = class EmployeeRole {
    id;
    employeeId;
    propertyId;
    roleId;
    effectiveFrom;
    effectiveTo;
    employee;
    property;
    role;
};
exports.EmployeeRole = EmployeeRole;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmployeeRole.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid' }),
    __metadata("design:type", String)
], EmployeeRole.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id', type: 'uuid' }),
    __metadata("design:type", String)
], EmployeeRole.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', type: 'uuid' }),
    __metadata("design:type", String)
], EmployeeRole.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_from', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], EmployeeRole.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_to', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], EmployeeRole.prototype, "effectiveTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.employeeRoles),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeRole.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], EmployeeRole.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_entity_1.Role)
], EmployeeRole.prototype, "role", void 0);
exports.EmployeeRole = EmployeeRole = __decorate([
    (0, typeorm_1.Entity)({ schema: 'core', name: 'employee_roles' })
], EmployeeRole);
//# sourceMappingURL=employee-role.entity.js.map