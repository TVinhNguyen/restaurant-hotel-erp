import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/auth/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // Check if permission with same slug already exists
    const existing = await this.permissionRepository.findOne({
      where: { slug: createPermissionDto.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Permission with slug "${createPermissionDto.slug}" already exists`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(module?: string): Promise<Permission[]> {
    const query = this.permissionRepository.createQueryBuilder('permission');

    if (module) {
      query.where('permission.module = :module', { module });
    }

    return query.orderBy('permission.module', 'ASC')
      .addOrderBy('permission.slug', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    // Check slug uniqueness if slug is being updated
    if (updatePermissionDto.slug && updatePermissionDto.slug !== permission.slug) {
      const existing = await this.permissionRepository.findOne({
        where: { slug: updatePermissionDto.slug },
      });

      if (existing) {
        throw new ConflictException(
          `Permission with slug "${updatePermissionDto.slug}" already exists`,
        );
      }
    }

    Object.assign(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }
}
