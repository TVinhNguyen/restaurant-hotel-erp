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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../entities/core/employee.entity");
let EmployeesService = class EmployeesService {
    employeeRepository;
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, department, status, search } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.employeeRepository.createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user')
            .leftJoinAndSelect('employee.employeeRoles', 'employeeRoles');
        if (department) {
            queryBuilder.andWhere('employee.department = :department', { department });
        }
        if (status) {
            queryBuilder.andWhere('employee.status = :status', { status });
        }
        if (search) {
            queryBuilder.andWhere('(employee.fullName ILIKE :search OR employee.employeeCode ILIKE :search)', { search: `%${search}%` });
        }
        const [data, total] = await queryBuilder
            .orderBy('employee.fullName', 'ASC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        };
    }
    async findOne(id) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: [
                'user',
                'employeeRoles',
                'workingShifts',
                'attendances',
                'leaves',
                'evaluations',
                'payrolls'
            ],
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async create(createEmployeeDto) {
        const employeeCode = createEmployeeDto.employeeCode ||
            await this.generateEmployeeCode();
        const employee = this.employeeRepository.create({
            ...createEmployeeDto,
            employeeCode,
            status: createEmployeeDto.status || 'active',
        });
        return await this.employeeRepository.save(employee);
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.findOne(id);
        Object.assign(employee, updateEmployeeDto);
        return await this.employeeRepository.save(employee);
    }
    async remove(id) {
        const employee = await this.findOne(id);
        await this.employeeRepository.remove(employee);
    }
    async generateEmployeeCode() {
        const count = await this.employeeRepository.count();
        const nextNumber = (count + 1).toString().padStart(4, '0');
        return `EMP${nextNumber}`;
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map