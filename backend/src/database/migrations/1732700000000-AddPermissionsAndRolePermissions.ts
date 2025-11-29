import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermissionsAndRolePermissions1732700000000
  implements MigrationInterface
{
  name = 'AddPermissionsAndRolePermissions1732700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Create permissions table
    await queryRunner.query(`
      CREATE TABLE auth.permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        module VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2) Create role_permissions junction table
    await queryRunner.query(`
      CREATE TABLE auth.role_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role_id UUID NOT NULL,
        permission_id UUID NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_role_permissions_role 
          FOREIGN KEY (role_id) REFERENCES auth.roles(id) ON DELETE CASCADE,
        CONSTRAINT fk_role_permissions_permission 
          FOREIGN KEY (permission_id) REFERENCES auth.permissions(id) ON DELETE CASCADE,
        CONSTRAINT uq_role_permission UNIQUE (role_id, permission_id)
      )
    `);

    // 3) Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX idx_permissions_module ON auth.permissions(module)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_permissions_slug ON auth.permissions(slug)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_role_permissions_role ON auth.role_permissions(role_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_role_permissions_permission ON auth.role_permissions(permission_id)
    `);

    // 4) Insert default permissions
    await queryRunner.query(`
      INSERT INTO auth.permissions (slug, name, module, description) VALUES
      -- User Management
      ('user.view', 'View Users', 'System', 'Can view user list and details'),
      ('user.create', 'Create Users', 'System', 'Can create new users'),
      ('user.edit', 'Edit Users', 'System', 'Can edit user information'),
      ('user.delete', 'Delete Users', 'System', 'Can delete users'),
      
      -- Role & Permission Management
      ('role.view', 'View Roles', 'System', 'Can view roles and permissions'),
      ('role.manage', 'Manage Roles', 'System', 'Can create, edit, and delete roles'),
      ('permission.assign', 'Assign Permissions', 'System', 'Can assign permissions to roles'),
      
      -- Property Management
      ('property.view', 'View Properties', 'FrontDesk', 'Can view property information'),
      ('property.edit', 'Edit Properties', 'FrontDesk', 'Can edit property settings'),
      
      -- Room Management
      ('room.view', 'View Rooms', 'FrontDesk', 'Can view room inventory'),
      ('room.edit', 'Edit Rooms', 'FrontDesk', 'Can edit room details'),
      ('roomtype.manage', 'Manage Room Types', 'FrontDesk', 'Can manage room types'),
      
      -- Reservation Management
      ('reservation.view', 'View Reservations', 'FrontDesk', 'Can view all reservations'),
      ('reservation.create', 'Create Reservations', 'FrontDesk', 'Can create new reservations'),
      ('reservation.edit', 'Edit Reservations', 'FrontDesk', 'Can modify reservations'),
      ('reservation.cancel', 'Cancel Reservations', 'FrontDesk', 'Can cancel reservations'),
      ('reservation.checkin', 'Check-in Guests', 'FrontDesk', 'Can perform check-in'),
      ('reservation.checkout', 'Check-out Guests', 'FrontDesk', 'Can perform check-out'),
      
      -- Payment Management
      ('payment.view', 'View Payments', 'FrontDesk', 'Can view payment records'),
      ('payment.process', 'Process Payments', 'FrontDesk', 'Can process payments'),
      ('payment.refund', 'Refund Payments', 'FrontDesk', 'Can issue refunds'),
      
      -- Guest Management
      ('guest.view', 'View Guests', 'FrontDesk', 'Can view guest information'),
      ('guest.edit', 'Edit Guests', 'FrontDesk', 'Can edit guest details'),
      
      -- Housekeeping
      ('housekeeping.view', 'View Housekeeping', 'Housekeeping', 'Can view room status'),
      ('housekeeping.update', 'Update Room Status', 'Housekeeping', 'Can update cleaning status'),
      
      -- Restaurant Management
      ('restaurant.view', 'View Restaurants', 'F&B', 'Can view restaurant information'),
      ('restaurant.manage', 'Manage Restaurants', 'F&B', 'Can manage restaurants'),
      ('tablebooking.view', 'View Table Bookings', 'F&B', 'Can view table reservations'),
      ('tablebooking.create', 'Create Table Bookings', 'F&B', 'Can create table reservations'),
      ('tablebooking.edit', 'Edit Table Bookings', 'F&B', 'Can modify table reservations'),
      
      -- HR Management
      ('employee.view', 'View Employees', 'HR', 'Can view employee information'),
      ('employee.manage', 'Manage Employees', 'HR', 'Can create, edit employee records'),
      ('attendance.view', 'View Attendance', 'HR', 'Can view attendance records'),
      ('attendance.manage', 'Manage Attendance', 'HR', 'Can manage attendance'),
      ('leave.view', 'View Leave', 'HR', 'Can view leave requests'),
      ('leave.approve', 'Approve Leave', 'HR', 'Can approve/reject leave'),
      ('payroll.view', 'View Payroll', 'HR', 'Can view payroll information'),
      ('payroll.process', 'Process Payroll', 'HR', 'Can process payroll'),
      
      -- Reports
      ('report.occupancy', 'Occupancy Reports', 'Reports', 'Can view occupancy reports'),
      ('report.revenue', 'Revenue Reports', 'Reports', 'Can view revenue reports'),
      ('report.guest', 'Guest Reports', 'Reports', 'Can view guest analytics'),
      ('report.staff', 'Staff Reports', 'Reports', 'Can view staff performance reports')
    `);

    // 5) Assign permissions to existing roles
    // Get role IDs and assign appropriate permissions
    await queryRunner.query(`
      -- Assign all permissions to CHAIN_ADMIN (if exists)
      INSERT INTO auth.role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM auth.roles r
      CROSS JOIN auth.permissions p
      WHERE r.name = 'Chain Admin'
      ON CONFLICT (role_id, permission_id) DO NOTHING
    `);

    await queryRunner.query(`
      -- Assign property management permissions to PROPERTY_MANAGER (if exists)
      INSERT INTO auth.role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM auth.roles r
      CROSS JOIN auth.permissions p
      WHERE r.name = 'Property Manager'
      AND p.slug IN (
        'property.view', 'property.edit',
        'room.view', 'room.edit', 'roomtype.manage',
        'reservation.view', 'reservation.create', 'reservation.edit', 'reservation.cancel',
        'reservation.checkin', 'reservation.checkout',
        'payment.view', 'payment.process',
        'guest.view', 'guest.edit',
        'housekeeping.view', 'housekeeping.update',
        'restaurant.view', 'restaurant.manage',
        'tablebooking.view', 'tablebooking.create', 'tablebooking.edit',
        'employee.view',
        'report.occupancy', 'report.revenue', 'report.guest'
      )
      ON CONFLICT (role_id, permission_id) DO NOTHING
    `);

    await queryRunner.query(`
      -- Assign front desk permissions to RECEPTIONIST (if exists)
      INSERT INTO auth.role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM auth.roles r
      CROSS JOIN auth.permissions p
      WHERE r.name = 'Receptionist'
      AND p.slug IN (
        'room.view',
        'reservation.view', 'reservation.create', 'reservation.edit',
        'reservation.checkin', 'reservation.checkout',
        'payment.view', 'payment.process',
        'guest.view', 'guest.edit',
        'housekeeping.view',
        'tablebooking.view', 'tablebooking.create'
      )
      ON CONFLICT (role_id, permission_id) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS auth.role_permissions`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth.permissions`);
  }
}
