import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSalaryToEmployee1732266000000 implements MigrationInterface {
  name = 'AddSalaryToEmployee1732266000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add salary column to employees table
    await queryRunner.query(`
      ALTER TABLE core.employees 
      ADD COLUMN IF NOT EXISTS salary DECIMAL(12,2)
    `);

    // Set default salary to 0 for existing employees
    await queryRunner.query(`
      UPDATE core.employees 
      SET salary = 0 
      WHERE salary IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop salary column
    await queryRunner.query(`
      ALTER TABLE core.employees 
      DROP COLUMN IF EXISTS salary
    `);
  }
}
