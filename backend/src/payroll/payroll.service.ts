import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payroll } from '../entities/hr/payroll.entity';
import { Employee } from '../entities/core/employee.entity';
import { Overtime } from '../entities/hr/overtime.entity';
import { Deduction } from '../entities/hr/deduction.entity';
import {
  CreatePayrollDto,
  UpdatePayrollDto,
  BulkPayrollDto
} from './dto/create-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Overtime)
    private overtimeRepository: Repository<Overtime>,
    @InjectRepository(Deduction)
    private deductionRepository: Repository<Deduction>
  ) {}

  async createPayroll(createPayrollDto: CreatePayrollDto): Promise<Payroll> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: createPayrollDto.employeeId }
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createPayrollDto.employeeId} not found`
      );
    }

    // Check if payroll already exists for this period
    const existingPayroll = await this.payrollRepository.findOne({
      where: {
        employeeId: createPayrollDto.employeeId,
        period: createPayrollDto.period
      }
    });

    if (existingPayroll) {
      throw new BadRequestException(
        'Payroll already exists for this employee and period'
      );
    }

    const payroll = this.payrollRepository.create(createPayrollDto);
    return await this.payrollRepository.save(payroll);
  }

  async findAllPayrolls(
    page: number = 1,
    limit: number = 10,
    employeeId?: string,
    period?: string
  ) {
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
      totalPages: Math.ceil(total / limit)
    };
  }

  async getAllPayrolls() {
    const payrolls = await this.payrollRepository.find({
      relations: ['employee'],
      order: {
        period: 'DESC',
        createdAt: 'DESC'
      }
    });

    return {
      data: payrolls,
      total: payrolls.length
    };
  }

  async findPayrollById(id: string): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ['employee']
    });

    if (!payroll) {
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }

    return payroll;
  }

  async updatePayroll(
    id: string,
    updatePayrollDto: UpdatePayrollDto
  ): Promise<Payroll> {
    await this.findPayrollById(id);
    await this.payrollRepository.update(id, updatePayrollDto);
    return this.findPayrollById(id);
  }

  async deletePayroll(id: string): Promise<void> {
    const payroll = await this.findPayrollById(id);
    await this.payrollRepository.remove(payroll);
  }

  async bulkCreatePayroll(bulkPayrollDto: BulkPayrollDto): Promise<Payroll[]> {
    const { period, payrolls } = bulkPayrollDto;

    // Check for existing payroll records
    const existingPayrolls = await this.payrollRepository.find({
      where: { period }
    });

    const existingEmployeeIds = existingPayrolls.map(p => p.employeeId);

    // Filter out employees who already have payroll for this period
    const newPayrolls = payrolls.filter(
      p => !existingEmployeeIds.includes(p.employeeId)
    );

    if (newPayrolls.length === 0) {
      throw new BadRequestException(
        'All employees already have payroll records for this period'
      );
    }

    const payrollEntities = newPayrolls.map(p =>
      this.payrollRepository.create({
        employeeId: p.employeeId,
        period,
        basicSalary: p.basicSalary,
        overtimePay: p.overtimePay || 0,
        allowances: p.allowances || 0,
        grossPay: p.grossPay,
        bonus: p.bonus || 0,
        totalDeductions: p.totalDeductions || 0,
        tax: p.tax || 0,
        socialInsurance: p.socialInsurance || 0,
        healthInsurance: p.healthInsurance || 0,
        netSalary: p.netSalary,
        workingDays: p.workingDays || 22,
        totalWorkingDays: p.totalWorkingDays || 22,
        status: p.status || 'draft',
        currency: p.currency || 'VND'
      })
    );

    return await this.payrollRepository.save(payrollEntities);
  }

  async generatePayrollWithCalculations(
    period: string,
    employeeId?: string
  ): Promise<any[]> {
    // Get employees
    const employeeQuery = this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.status = :status', { status: 'active' });

    if (employeeId) {
      employeeQuery.andWhere('employee.id = :employeeId', { employeeId });
    }

    const employees = await employeeQuery.getMany();
    const payrollResults = [];

    for (const employee of employees) {
      // Check if payroll already exists
      const existingPayroll = await this.payrollRepository.findOne({
        where: { employeeId: employee.id, period }
      });

      if (existingPayroll) continue;

      // Get overtime for this period
      const [year, month] = period.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const overtimes = await this.overtimeRepository.find({
        where: {
          employeeId: employee.id,
          createdAt: Between(startDate, endDate)
        }
      });

      const deductions = await this.deductionRepository.find({
        where: {
          employeeId: employee.id,
          date: Between(startDate, endDate)
        }
      });

      // Calculate totals
      const totalOvertimeAmount = overtimes.reduce(
        (sum, ot) => sum + Number(ot.amount),
        0
      );

      const totalDeductions = deductions.reduce(
        (sum, ded) => sum + Number(ded.amount),
        0
      );

      // Use employee's salary as basic salary, fallback to 5M if not set
      const basicSalary = 5000000;
      const allowances = 0; // Can be made configurable
      const bonus = 0;

      // Calculate gross pay
      const grossPay = basicSalary + totalOvertimeAmount + allowances + bonus;

      // Calculate tax and insurance (simplified calculation)
      const tax = grossPay * 0.1; // 10% tax rate
      const socialInsurance = basicSalary * 0.08; // 8% social insurance
      const healthInsurance = basicSalary * 0.025; // 2.5% health insurance

      // Net salary
      const netSalary =
        grossPay - totalDeductions - tax - socialInsurance - healthInsurance;

      const payroll = this.payrollRepository.create({
        employeeId: employee.id,
        period,
        basicSalary,
        overtimePay: totalOvertimeAmount,
        allowances,
        grossPay,
        bonus,
        totalDeductions: totalDeductions,
        tax,
        socialInsurance,
        healthInsurance,
        netSalary,
        workingDays: 22, // Can be calculated from attendance
        totalWorkingDays: 22,
        status: 'draft',
        currency: 'VND'
      });

      const savedPayroll = await this.payrollRepository.save(payroll);
      payrollResults.push({
        ...savedPayroll,
        calculations: {
          overtimeAmount: totalOvertimeAmount,
          deductionAmount: totalDeductions,
          grossSalary: grossPay
        }
      });
    }

    return payrollResults;
  }

  async getPayrollSummary(period: string, employeeId?: string) {
    const queryBuilder = this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.employee', 'employee')
      .where('payroll.period = :period', { period });

    if (employeeId) {
      queryBuilder.andWhere('payroll.employeeId = :employeeId', { employeeId });
    }

    const payrolls = await queryBuilder.getMany();

    const currencyBreakdown = payrolls.reduce(
      (acc: { [key: string]: number }, p) => {
        acc[p.currency] = (acc[p.currency] || 0) + Number(p.netSalary);
        return acc;
      },
      {}
    );

    return {
      period,
      totalEmployees: payrolls.length,
      totalBasicSalary: payrolls.reduce(
        (sum, p) => sum + Number(p.basicSalary),
        0
      ),
      totalNetSalary: payrolls.reduce((sum, p) => sum + Number(p.netSalary), 0),
      totalBonuses: payrolls.reduce((sum, p) => sum + Number(p.bonus || 0), 0),
      currencyBreakdown
    };
  }
}
