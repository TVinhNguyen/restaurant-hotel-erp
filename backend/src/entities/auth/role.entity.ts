import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmployeeRole } from '../core/employee-role.entity';
import { RolePermission } from './role-permission.entity';

@Entity({ schema: 'auth', name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20 })
  scope: 'global' | 'per_property';

  // Relations
  @OneToMany(() => EmployeeRole, (employeeRole) => employeeRole.role)
  employeeRoles: EmployeeRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
