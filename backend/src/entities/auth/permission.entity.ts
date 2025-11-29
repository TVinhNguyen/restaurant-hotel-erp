import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity({ schema: 'auth', name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  slug: string; // e.g., 'reservation.view', 'room.edit', 'user.delete'

  @Column({ length: 255 })
  name: string; // Mô tả ngắn gọn

  @Column({ length: 50, nullable: true })
  module: string; // e.g., 'FrontDesk', 'Housekeeping', 'System'

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[];
}
