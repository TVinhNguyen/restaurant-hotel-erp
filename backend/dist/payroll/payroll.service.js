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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payroll_entity_1 = require("../entities/hr/payroll.entity");
const employee_entity_1 = require("../entities/core/employee.entity");
const overtime_entity_1 = require("../entities/hr/overtime.entity");
const deduction_entity_1 = require("../entities/hr/deduction.entity");
let PayrollService = class PayrollService {
    payrollRepository;
    employeeRepository;
    overtimeRepository;
    deductionRepository;
    constructor(payrollRepository, employeeRepository, overtimeRepository, deductionRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.overtimeRepository = overtimeRepository;
        this.deductionRepository = deductionRepository;
    }
    async createPayroll(createPayrollDto) {
        const employee = await this.employeeRepository.findOne({
            where: { id: createPayrollDto.employeeId },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${createPayrollDto.employeeId} not found`);
        }
        const existingPayroll = await this.payrollRepository.findOne({
            where: {
                employeeId: createPayrollDto.employeeId,
                period: createPayrollDto.period,
            },
        });
        if (existingPayroll) {
            throw new common_1.BadRequestException('Payroll already exists for this employee and period');
        }
        const payroll = this.payrollRepository.create(createPayrollDto);
        return await this.payrollRepository.save(payroll);
    }
    async findAllPayrolls(page = 1, limit = 10, employeeId, period) {
        const queryBuilder = this.payrollRepository
            .createQueryBuilder('payroll')
            .leftJoinAndSelect('payroll.employee', 'employee');
        if (employeeId) {
            queryBuilder.andWhere('payroll.employeeId = :employeeId', { employeeId });
        }
        if (period) {
            queryBuilder.andWhere('payroll.period = :period', { period });
        }
        const [payrolls, total] = await queryBuilder
            .orderBy('payroll.period', 'DESC')
            .addOrderBy('employee.fullName', 'ASC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data: payrolls,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findPayrollById(id) {
        const payroll = await this.payrollRepository.findOne({
            where: { id },
            relations: ['employee'],
        });
        if (!payroll) {
            throw new common_1.NotFoundException(`Payroll with ID ${id} not found`);
        }
        return payroll;
    }
    async updatePayroll(id, updatePayrollDto) {
        await this.findPayrollById(id);
        await this.payrollRepository.update(id, updatePayrollDto);
        return this.findPayrollById(id);
    }
    async deletePayroll(id) {
        const payroll = await this.findPayrollById(id);
        await this.payrollRepository.remove(payroll);
    }
    async bulkCreatePayroll(bulkPayrollDto) {
        const { period, payrolls } = bulkPayrollDto;
        const existingPayrolls = await this.payrollRepository.find({
            where: { period },
        });
        const existingEmployeeIds = existingPayrolls.map(p => p.employeeId);
        const newPayrolls = payrolls.filter(p => !existingEmployeeIds.includes(p.employeeId));
        if (newPayrolls.length === 0) {
            throw new common_1.BadRequestException('All employees already have payroll records for this period');
        }
        const payrollEntities = newPayrolls.map(p => this.payrollRepository.create({
            employeeId: p.employeeId,
            period,
            basicSalary: p.basicSalary,
            netSalary: p.netSalary,
            bonus: p.bonus || 0,
            currency: p.currency,
        }));
        return await this.payrollRepository.save(payrollEntities);
    }
    async generatePayrollWithCalculations(period, employeeId) {
        const employeeQuery = this.employeeRepository.createQueryBuilder('employee')
            .where('employee.status = :status', { status: 'active' });
        if (employeeId) {
            employeeQuery.andWhere('employee.id = :employeeId', { employeeId });
        }
        const employees = await employeeQuery.getMany();
        const payrollResults = [];
        for (const employee of employees) {
            const existingPayroll = await this.payrollRepository.findOne({
                where: { employeeId: employee.id, period },
            });
            if (existingPayroll)
                continue;
            const [year, month] = period.split('-');
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            const overtimes = await this.overtimeRepository.find({
                where: {
                    employeeId: employee.id,
                    createdAt: (0, typeorm_2.Between)(startDate, endDate),
                },
            });
            const deductions = await this.deductionRepository.find({
                where: {
                    employeeId: employee.id,
                    date: (0, typeorm_2.Between)(startDate, endDate),
                },
            });
            const totalOvertimeAmount = overtimes.reduce((sum, ot) => sum + Number(ot.amount), 0);
            const totalDeductions = deductions.reduce((sum, ded) => sum + Number(ded.amount), 0);
            const basicSalary = 5000000;
            const grossSalary = basicSalary + totalOvertimeAmount;
            const netSalary = grossSalary - totalDeductions;
            const payroll = this.payrollRepository.create({
                employeeId: employee.id,
                period,
                basicSalary,
                netSalary,
                bonus: 0,
                currency: 'VND',
            });
            const savedPayroll = await this.payrollRepository.save(payroll);
            payrollResults.push({
                ...savedPayroll,
                calculations: {
                    overtimeAmount: totalOvertimeAmount,
                    deductionAmount: totalDeductions,
                    grossSalary,
                }
            });
        }
        return payrollResults;
    }
    async getPayrollSummary(period, employeeId) {
        const queryBuilder = this.payrollRepository
            .createQueryBuilder('payroll')
            .leftJoin('payroll.employee', 'employee')
            .where('payroll.period = :period', { period });
        if (employeeId) {
            queryBuilder.andWhere('payroll.employeeId = :employeeId', { employeeId });
        }
        const payrolls = await queryBuilder.getMany();
        const currencyBreakdown = payrolls.reduce((acc, p) => {
            acc[p.currency] = (acc[p.currency] || 0) + Number(p.netSalary);
            return acc;
        }, {});
        return {
            period,
            totalEmployees: payrolls.length,
            totalBasicSalary: payrolls.reduce((sum, p) => sum + Number(p.basicSalary), 0),
            totalNetSalary: payrolls.reduce((sum, p) => sum + Number(p.netSalary), 0),
            totalBonuses: payrolls.reduce((sum, p) => sum + Number(p.bonus || 0), 0),
            currencyBreakdown,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payroll_entity_1.Payroll)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(2, (0, typeorm_1.InjectRepository)(overtime_entity_1.Overtime)),
    __param(3, (0, typeorm_1.InjectRepository)(deduction_entity_1.Deduction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map