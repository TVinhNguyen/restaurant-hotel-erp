import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeDepartment1732800000000
  implements MigrationInterface
{
  name = 'UpdateEmployeeDepartment1732800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Drop old department constraint
    await queryRunner.query(`
      ALTER TABLE core.employees 
      DROP CONSTRAINT IF EXISTS employees_department_check
    `);

    // 2) Update existing data to match new department values
    await queryRunner.query(`
      UPDATE core.employees 
      SET department = 'Front Desk' 
      WHERE department IN ('Sales')
    `);

    await queryRunner.query(`
      UPDATE core.employees 
      SET department = 'HR' 
      WHERE department IN ('Human Resources')
    `);

    await queryRunner.query(`
      UPDATE core.employees 
      SET department = NULL 
      WHERE department IN ('IT Department', 'Marketing', 'Finances')
    `);

    // 3) Add new department constraint with hotel/restaurant values
    await queryRunner.query(`
      ALTER TABLE core.employees
      ADD CONSTRAINT employees_department_check
      CHECK (
        department IS NULL
        OR department IN ('Front Desk', 'Housekeeping', 'HR', 'F&B')
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to old constraint
    await queryRunner.query(`
      ALTER TABLE core.employees 
      DROP CONSTRAINT IF EXISTS employees_department_check
    `);

    await queryRunner.query(`
      UPDATE core.employees 
      SET department = 'Sales' 
      WHERE department = 'Front Desk'
    `);

    await queryRunner.query(`
      UPDATE core.employees 
      SET department = 'Human Resources' 
      WHERE department = 'HR'
    `);

    await queryRunner.query(`
      ALTER TABLE core.employees
      ADD CONSTRAINT employees_department_check
      CHECK (
        department IS NULL
        OR department IN ('IT Department','Human Resources','Marketing','Finances','Sales')
      )
    `);
  }
}
