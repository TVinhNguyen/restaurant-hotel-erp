import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnhancePayrollEntity1732233600000 implements MigrationInterface {
  name = 'EnhancePayrollEntity1732233600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to payrolls table
    await queryRunner.query(`
      ALTER TABLE hr.payrolls 
      ADD COLUMN IF NOT EXISTS gross_pay DECIMAL(12,2),
      ADD COLUMN IF NOT EXISTS overtime_pay DECIMAL(12,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS allowances DECIMAL(12,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_deductions DECIMAL(12,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tax DECIMAL(12,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS social_insurance DECIMAL(12,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS health_insurance DECIMAL(12,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS working_days INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_working_days INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS overtime_hours DECIMAL(5,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
      ADD COLUMN IF NOT EXISTS paid_date DATE,
      ADD COLUMN IF NOT EXISTS notes TEXT
    `);

    // Add check constraint for status
    await queryRunner.query(`
      ALTER TABLE hr.payrolls 
      DROP CONSTRAINT IF EXISTS chk_payroll_status
    `);

    await queryRunner.query(`
      ALTER TABLE hr.payrolls 
      ADD CONSTRAINT chk_payroll_status 
      CHECK (status IN ('draft', 'processed', 'paid'))
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payrolls_status 
      ON hr.payrolls(status)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payrolls_employee_period 
      ON hr.payrolls(employee_id, period)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payrolls_paid_date 
      ON hr.payrolls(paid_date)
    `);

    // Update existing records to have default values
    await queryRunner.query(`
      UPDATE hr.payrolls 
      SET 
        gross_pay = basic_salary + COALESCE(bonus, 0),
        status = 'draft',
        working_days = 0,
        total_working_days = 22
      WHERE gross_pay IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_payrolls_paid_date`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS hr.idx_payrolls_employee_period`
    );
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_payrolls_status`);

    // Drop constraint
    await queryRunner.query(
      `ALTER TABLE hr.payrolls DROP CONSTRAINT IF EXISTS chk_payroll_status`
    );

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE hr.payrolls 
      DROP COLUMN IF EXISTS notes,
      DROP COLUMN IF EXISTS paid_date,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS overtime_hours,
      DROP COLUMN IF EXISTS total_working_days,
      DROP COLUMN IF EXISTS working_days,
      DROP COLUMN IF EXISTS health_insurance,
      DROP COLUMN IF EXISTS social_insurance,
      DROP COLUMN IF EXISTS tax,
      DROP COLUMN IF EXISTS total_deductions,
      DROP COLUMN IF EXISTS allowances,
      DROP COLUMN IF EXISTS overtime_pay,
      DROP COLUMN IF EXISTS gross_pay
    `);
  }
}
