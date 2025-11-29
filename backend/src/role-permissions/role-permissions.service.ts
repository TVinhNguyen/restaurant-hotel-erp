import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RolePermission } from '../entities/auth/role-permission.entity';
import { Role } from '../entities/auth/role.entity';
import { Permission } from '../entities/auth/permission.entity';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { BulkAssignPermissionsDto } from './dto/bulk-assign-permissions.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async assignPermission(
    roleId: string,
    assignPermissionDto: AssignPermissionDto,
  ): Promise<RolePermission> {
    // Verify role exists
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    // Verify permission exists
    const permission = await this.permissionRepository.findOne({
      where: { id: assignPermissionDto.permissionId },
    });
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID "${assignPermissionDto.permissionId}" not found`,
      );
    }

    // Check if already assigned
    const existing = await this.rolePermissionRepository.findOne({
      where: {
        roleId,
        permissionId: assignPermissionDto.permissionId,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Permission "${permission.name}" is already assigned to role "${role.name}"`,
      );
    }

    const rolePermission = this.rolePermissionRepository.create({
      roleId,
      permissionId: assignPermissionDto.permissionId,
    });

    return this.rolePermissionRepository.save(rolePermission);
  }

  async bulkAssignPermissions(
    roleId: string,
    bulkAssignDto: BulkAssignPermissionsDto,
  ): Promise<RolePermission[]> {
    // Verify role exists
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    // Verify all permissions exist
    const permissions = await this.permissionRepository.find({
      where: { id: In(bulkAssignDto.permissionIds) },
    });

    if (permissions.length !== bulkAssignDto.permissionIds.length) {
      throw new BadRequestException('One or more permission IDs are invalid');
    }

    // Get existing assignments
    const existing = await this.rolePermissionRepository.find({
      where: {
        roleId,
        permissionId: In(bulkAssignDto.permissionIds),
      },
    });

    const existingPermissionIds = new Set(existing.map((rp) => rp.permissionId));
    const newPermissionIds = bulkAssignDto.permissionIds.filter(
      (id) => !existingPermissionIds.has(id),
    );

    if (newPermissionIds.length === 0) {
      throw new ConflictException('All permissions are already assigned');
    }

    const rolePermissions = newPermissionIds.map((permissionId) =>
      this.rolePermissionRepository.create({ roleId, permissionId }),
    );

    return this.rolePermissionRepository.save(rolePermissions);
  }

  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    // Verify role exists
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    return this.rolePermissionRepository.find({
      where: { roleId },
      relations: ['permission'],
      order: { permission: { module: 'ASC', slug: 'ASC' } },
    });
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { roleId, permissionId },
    });

    if (!rolePermission) {
      throw new NotFoundException(
        `Permission assignment not found for role "${roleId}" and permission "${permissionId}"`,
      );
    }

    await this.rolePermissionRepository.remove(rolePermission);
  }

  async removeAllPermissions(roleId: string): Promise<void> {
    // Verify role exists
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    await this.rolePermissionRepository.delete({ roleId });
  }
}
