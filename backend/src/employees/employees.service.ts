import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/core/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    department?: string;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, department, status, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.employeeRoles', 'employeeRoles');

    if (department) {
      queryBuilder.andWhere('employee.department = :department', {
        department,
      });
    }

    if (status) {
      queryBuilder.andWhere('employee.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(employee.fullName ILIKE :search OR employee.employeeCode ILIKE :search)',
        { search: `%${search}%` },
      );
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

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: [
        'user',
        'employeeRoles',
        'workingShifts',
        'attendances',
        'leaves',
        'evaluations',
        'payrolls',
      ],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  /**
   * Find employee by associated user id
   * @param userId UUID of the user
   */
  async getByUserId(userId: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'user',
        'employeeRoles',
        'workingShifts',
        'attendances',
        'leaves',
        'evaluations',
        'payrolls'
      ]
    });

    if (!employee) {
      throw new NotFoundException(`Employee with user ID ${userId} not found`);
    }

    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Generate employee code if not provided
    const employeeCode =
      createEmployeeDto.employeeCode || (await this.generateEmployeeCode());

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      employeeCode,
      status: createEmployeeDto.status || 'active',
    });

    return await this.employeeRepository.save(employee);
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    Object.assign(employee, updateEmployeeDto);

    return await this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }

  private async generateEmployeeCode(): Promise<string> {
    const count = await this.employeeRepository.count();
    const nextNumber = (count + 1).toString().padStart(4, '0');
    return `EMP${nextNumber}`;
  }
}
