import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeStructure1701700003000
  implements MigrationInterface
{
  name = 'UpdateEmployeeStructure1701700003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Add position column if not exists
    await queryRunner.query(`
      ALTER TABLE core.employees
      ADD COLUMN IF NOT EXISTS position VARCHAR(100)
    `);

    // 2) Drop old CHECK constraint on department
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const oldConstraints = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.constraint_column_usage
      WHERE table_schema = 'core'
        AND table_name = 'employees'
        AND column_name = 'department'
    `);

    for (const constraint of oldConstraints) {
      if (
        (constraint as { constraint_name: string }).constraint_name !==
        'uq_roles_name'
      ) {
        await queryRunner.query(
          `ALTER TABLE core.employees DROP CONSTRAINT IF EXISTS "${(constraint as { constraint_name: string }).constraint_name}"`,
        );
      }
    }

    // 3) Update department values - map old values to new ones
    await queryRunner.query(`
      UPDATE core.employees SET department = 'Human Resources' WHERE department IN ('HR')
    `);
    await queryRunner.query(`
      UPDATE core.employees SET department = 'Sales' WHERE department IN ('Front Desk')
    `);
    await queryRunner.query(`
      UPDATE core.employees SET department = NULL WHERE department IN ('Housekeeping', 'F&B')
    `);

    // 4) Add new CHECK constraint for department
    await queryRunner.query(`
      ALTER TABLE core.employees
      ADD CONSTRAINT employees_department_check
      CHECK (
        department IS NULL
        OR department IN ('IT Department','Human Resources','Marketing','Finances','Sales')
      )
    `);

    // 5) Ensure status constraint is correct
    // First drop old status constraint if exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const statusConstraints = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.constraint_column_usage
      WHERE table_schema = 'core'
        AND table_name = 'employees'
        AND column_name = 'status'
    `);

    for (const constraint of statusConstraints) {
      await queryRunner.query(
        `ALTER TABLE core.employees DROP CONSTRAINT IF EXISTS "${(constraint as { constraint_name: string }).constraint_name}"`,
      );
    }

    // Add correct status constraint
    await queryRunner.query(`
      ALTER TABLE core.employees
      ADD CONSTRAINT employees_status_check
      CHECK (status IN ('active','on_leave','terminated'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1) Drop new constraints
    await queryRunner.query(`
      ALTER TABLE core.employees
      DROP CONSTRAINT IF EXISTS employees_status_check
    `);

    await queryRunner.query(`
      ALTER TABLE core.employees
      DROP CONSTRAINT IF EXISTS employees_department_check
    `);

    // 2) Drop position column
    await queryRunner.query(`
      ALTER TABLE core.employees
      DROP COLUMN IF EXISTS position
    `);

    // 3) Restore old department constraint
    await queryRunner.query(`
      ALTER TABLE core.employees
      ADD CONSTRAINT employees_department_check
      CHECK (department IN ('Front Desk','Housekeeping','HR','F&B'))
    `);

    // 4) Restore old status constraint
    await queryRunner.query(`
      ALTER TABLE core.employees
      ADD CONSTRAINT employees_status_check
      CHECK (status IN ('active','on_leave','terminated'))
    `);

    // 5) Revert department values back
    await queryRunner.query(`
      UPDATE core.employees SET department = 'HR' WHERE department = 'Human Resources'
    `);
    await queryRunner.query(`
      UPDATE core.employees SET department = 'Front Desk' WHERE department = 'Sales'
    `);
    await queryRunner.query(`
      UPDATE core.employees SET department = 'Housekeeping' WHERE department IS NULL
    `);
  }
}
