import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConstraints1701700001000 implements MigrationInterface {
  name = 'AddConstraints1701700001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Add missing FK constraint
    await queryRunner.query(`
      ALTER TABLE core.employee_roles
      ADD CONSTRAINT employee_roles_property_fk
      FOREIGN KEY (property_id) REFERENCES core.properties(id) ON DELETE CASCADE
    `);

    // 2) Add support for "guest or user" in table bookings
    await queryRunner.query(`
      ALTER TABLE restaurant.table_bookings
      ADD COLUMN IF NOT EXISTS booked_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
    `);

    // Add constraint to ensure at least one: guest or user
    await queryRunner.query(`
      ALTER TABLE restaurant.table_bookings
      ADD CONSTRAINT tbl_booking_guest_or_user_chk
      CHECK (guest_id IS NOT NULL OR booked_by_user_id IS NOT NULL)
    `);

    // 3) Add unique constraint on role name
    await queryRunner.query(`
      ALTER TABLE auth.roles
      ADD CONSTRAINT uq_roles_name UNIQUE (name)
    `);

    // 4) Add logic constraints
    await queryRunner.query(`
      ALTER TABLE reservation.reservations
      ADD CONSTRAINT chk_resv_dates CHECK (check_in < check_out)
    `);

    await queryRunner.query(`
      ALTER TABLE reservation.daily_rates
      ADD CONSTRAINT chk_daily_available_nonneg CHECK (available_rooms IS NULL OR available_rooms >= 0)
    `);

    // 5) Add unique constraints for payroll & photo
    await queryRunner.query(`
      ALTER TABLE hr.payrolls
      ADD CONSTRAINT uq_payroll_employee_period UNIQUE (employee_id, period)
    `);

    await queryRunner.query(`
      ALTER TABLE inventory.photos
      ADD CONSTRAINT uq_photo_roomtype_url UNIQUE (room_type_id, url)
    `);

    // 6) Add payment transaction index
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_payments_tx ON reservation.payments(transaction_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query('DROP INDEX IF EXISTS ix_payments_tx');

    // Drop constraints
    await queryRunner.query(`
      ALTER TABLE inventory.photos
      DROP CONSTRAINT IF EXISTS uq_photo_roomtype_url
    `);

    await queryRunner.query(`
      ALTER TABLE hr.payrolls
      DROP CONSTRAINT IF EXISTS uq_payroll_employee_period
    `);

    await queryRunner.query(`
      ALTER TABLE reservation.daily_rates
      DROP CONSTRAINT IF EXISTS chk_daily_available_nonneg
    `);

    await queryRunner.query(`
      ALTER TABLE reservation.reservations
      DROP CONSTRAINT IF EXISTS chk_resv_dates
    `);

    await queryRunner.query(`
      ALTER TABLE auth.roles
      DROP CONSTRAINT IF EXISTS uq_roles_name
    `);

    await queryRunner.query(`
      ALTER TABLE restaurant.table_bookings
      DROP CONSTRAINT IF EXISTS tbl_booking_guest_or_user_chk
    `);

    await queryRunner.query(`
      ALTER TABLE restaurant.table_bookings
      DROP COLUMN IF EXISTS booked_by_user_id
    `);

    await queryRunner.query(`
      ALTER TABLE core.employee_roles
      DROP CONSTRAINT IF EXISTS employee_roles_property_fk
    `);
  }
}
