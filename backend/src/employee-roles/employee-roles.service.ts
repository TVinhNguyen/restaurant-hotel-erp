import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeRole } from '../entities/core/employee-role.entity';
import { Employee } from '../entities/core/employee.entity';
import { Property } from '../entities/core/property.entity';
import { Role } from '../entities/auth/role.entity';
import { CreateEmployeeRoleDto } from './dto/create-employee-role.dto';
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto';

@Injectable()
export class EmployeeRolesService {
  constructor(
    @InjectRepository(EmployeeRole)
    private employeeRoleRepository: Repository<EmployeeRole>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createEmployeeRoleDto: CreateEmployeeRoleDto): Promise<EmployeeRole> {
    // Validate employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: createEmployeeRoleDto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createEmployeeRoleDto.employeeId} not found`,
      );
    }

    // Validate property exists
    const property = await this.propertyRepository.findOne({
      where: { id: createEmployeeRoleDto.propertyId },
    });
    if (!property) {
      throw new NotFoundException(
        `Property with ID ${createEmployeeRoleDto.propertyId} not found`,
      );
    }

    // Validate role exists
    const role = await this.roleRepository.findOne({
      where: { id: createEmployeeRoleDto.roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${createEmployeeRoleDto.roleId} not found`,
      );
    }

    // Validate date range if both dates provided
    if (
      createEmployeeRoleDto.effectiveFrom &&
      createEmployeeRoleDto.effectiveTo
    ) {
      const from = new Date(createEmployeeRoleDto.effectiveFrom);
      const to = new Date(createEmployeeRoleDto.effectiveTo);
      if (from > to) {
        throw new BadRequestException(
          'effectiveFrom must be before effectiveTo',
        );
      }
    }

    const employeeRole = new EmployeeRole();
    employeeRole.employeeId = createEmployeeRoleDto.employeeId;
    employeeRole.propertyId = createEmployeeRoleDto.propertyId;
    employeeRole.roleId = createEmployeeRoleDto.roleId;
    employeeRole.effectiveFrom = createEmployeeRoleDto.effectiveFrom
      ? new Date(createEmployeeRoleDto.effectiveFrom)
      : null;
    employeeRole.effectiveTo = createEmployeeRoleDto.effectiveTo
      ? new Date(createEmployeeRoleDto.effectiveTo)
      : null;

    return this.employeeRoleRepository.save(employeeRole);
  }

  async findAll(): Promise<EmployeeRole[]> {
    return this.employeeRoleRepository.find({
      relations: ['employee', 'property', 'role'],
    });
  }

  async findByEmployee(employeeId: string): Promise<EmployeeRole[]> {
    return this.employeeRoleRepository.find({
      where: { employeeId },
      relations: ['employee', 'property', 'role'],
    });
  }

  async findByProperty(propertyId: string): Promise<EmployeeRole[]> {
    return this.employeeRoleRepository.find({
      where: { propertyId },
      relations: ['employee', 'property', 'role'],
    });
  }

  async findOne(id: string): Promise<EmployeeRole> {
    const employeeRole = await this.employeeRoleRepository.findOne({
      where: { id },
      relations: ['employee', 'property', 'role'],
    });

    if (!employeeRole) {
      throw new NotFoundException(`EmployeeRole with ID ${id} not found`);
    }

    return employeeRole;
  }

  async update(
    id: string,
    updateEmployeeRoleDto: UpdateEmployeeRoleDto,
  ): Promise<EmployeeRole> {
    const employeeRole = await this.findOne(id);

    // Validate employee if provided
    if (updateEmployeeRoleDto.employeeId) {
      const employee = await this.employeeRepository.findOne({
        where: { id: updateEmployeeRoleDto.employeeId },
      });
      if (!employee) {
        throw new NotFoundException(
          `Employee with ID ${updateEmployeeRoleDto.employeeId} not found`,
        );
      }
    }

    // Validate property if provided
    if (updateEmployeeRoleDto.propertyId) {
      const property = await this.propertyRepository.findOne({
        where: { id: updateEmployeeRoleDto.propertyId },
      });
      if (!property) {
        throw new NotFoundException(
          `Property with ID ${updateEmployeeRoleDto.propertyId} not found`,
        );
      }
    }

    // Validate role if provided
    if (updateEmployeeRoleDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: updateEmployeeRoleDto.roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateEmployeeRoleDto.roleId} not found`,
        );
      }
    }

    // Validate date range
    const from =
      updateEmployeeRoleDto.effectiveFrom !== undefined
        ? updateEmployeeRoleDto.effectiveFrom
          ? new Date(updateEmployeeRoleDto.effectiveFrom)
          : null
        : employeeRole.effectiveFrom;

    const to =
      updateEmployeeRoleDto.effectiveTo !== undefined
        ? updateEmployeeRoleDto.effectiveTo
          ? new Date(updateEmployeeRoleDto.effectiveTo)
          : null
        : employeeRole.effectiveTo;

    if (from && to && from > to) {
      throw new BadRequestException(
        'effectiveFrom must be before effectiveTo',
      );
    }

    Object.assign(employeeRole, {
      ...updateEmployeeRoleDto,
      effectiveFrom: from,
      effectiveTo: to,
    });

    return this.employeeRoleRepository.save(employeeRole);
  }

  async remove(id: string): Promise<void> {
    const employeeRole = await this.findOne(id);
    await this.employeeRoleRepository.remove(employeeRole);
  }
}
