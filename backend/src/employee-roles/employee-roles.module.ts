import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRolesService } from './employee-roles.service';
import { EmployeeRolesController } from './employee-roles.controller';
import { EmployeeRole } from '../entities/core/employee-role.entity';
import { Employee } from '../entities/core/employee.entity';
import { Property } from '../entities/core/property.entity';
import { Role } from '../entities/auth/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRole, Employee, Property, Role])],
  controllers: [EmployeeRolesController],
  providers: [EmployeeRolesService],
  exports: [EmployeeRolesService],
})
export class EmployeeRolesModule {}
