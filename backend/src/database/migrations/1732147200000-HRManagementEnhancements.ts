import { MigrationInterface, QueryRunner } from 'typeorm';

export class HRManagementEnhancements1732147200000
  implements MigrationInterface
{
  name = 'HRManagementEnhancements1732147200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =====================================================
    // 1) EMPLOYEE EVALUATIONS TABLE
    // =====================================================

    // Drop and recreate employee_evaluations table
    await queryRunner.query(`DROP TABLE IF EXISTS hr.employee_evaluations`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS hr.employee_evaluations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
        employee_name VARCHAR(150),
        evaluator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        evaluator_name VARCHAR(150),
        evaluation_period VARCHAR(50),
        evaluation_date DATE,
        status VARCHAR(20) CHECK (status IN ('draft','completed','reviewed','approved')) DEFAULT 'draft',

        -- Performance Categories (7 categories)
        work_quality_score DECIMAL(2,1) CHECK (work_quality_score BETWEEN 1 AND 5),
        work_quality_comments TEXT,
        productivity_score DECIMAL(2,1) CHECK (productivity_score BETWEEN 1 AND 5),
        productivity_comments TEXT,
        communication_score DECIMAL(2,1) CHECK (communication_score BETWEEN 1 AND 5),
        communication_comments TEXT,
        teamwork_score DECIMAL(2,1) CHECK (teamwork_score BETWEEN 1 AND 5),
        teamwork_comments TEXT,
        problem_solving_score DECIMAL(2,1) CHECK (problem_solving_score BETWEEN 1 AND 5),
        problem_solving_comments TEXT,
        punctuality_score DECIMAL(2,1) CHECK (punctuality_score BETWEEN 1 AND 5),
        punctuality_comments TEXT,
        initiative_score DECIMAL(2,1) CHECK (initiative_score BETWEEN 1 AND 5),
        initiative_comments TEXT,

        -- Overall Assessment
        overall_score DECIMAL(3,2),
        overall_comments TEXT,
        strengths TEXT[],
        areas_for_improvement TEXT[],
        goals TEXT[],

        -- Manager's Decision
        evaluated_by UUID REFERENCES core.employees(id) ON DELETE SET NULL,
        recommended_action VARCHAR(30) CHECK (recommended_action IN ('promotion','salary_increase','training','maintain','improvement_plan','warning')),
        salary_recommendation DECIMAL(12,2),
        training_recommendations TEXT[],

        -- Employee Acknowledgment
        employee_acknowledged BOOLEAN DEFAULT FALSE,
        employee_comments TEXT,
        employee_acknowledged_date DATE,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_evaluations_employee_id ON hr.employee_evaluations(employee_id)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_evaluations_evaluator_id ON hr.employee_evaluations(evaluator_id)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_evaluations_status ON hr.employee_evaluations(status)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_evaluations_period ON hr.employee_evaluations(evaluation_period)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_evaluations_date ON hr.employee_evaluations(evaluation_date)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_evaluations_overall_score ON hr.employee_evaluations(overall_score)`
    );

    // =====================================================
    // 2) WORKING SHIFTS TABLE
    // =====================================================

    // Make property_id nullable in working_shifts
    await queryRunner.query(`
      ALTER TABLE hr.working_shifts 
      ALTER COLUMN property_id DROP NOT NULL
    `);

    // =====================================================
    // 3) LEAVES TABLE
    // =====================================================

    // Add missing columns to leaves table if they don't exist
    await queryRunner.query(`
      DO $$
      BEGIN
          -- Add start_date column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'hr' AND table_name = 'leaves' AND column_name = 'start_date') THEN
              ALTER TABLE hr.leaves ADD COLUMN start_date DATE;
          END IF;

          -- Add end_date column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'hr' AND table_name = 'leaves' AND column_name = 'end_date') THEN
              ALTER TABLE hr.leaves ADD COLUMN end_date DATE;
          END IF;

          -- Add applied_date column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'hr' AND table_name = 'leaves' AND column_name = 'applied_date') THEN
              ALTER TABLE hr.leaves ADD COLUMN applied_date DATE DEFAULT CURRENT_DATE;
          END IF;

          -- Add approved_date column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'hr' AND table_name = 'leaves' AND column_name = 'approved_date') THEN
              ALTER TABLE hr.leaves ADD COLUMN approved_date DATE;
          END IF;

          -- Add rejection_reason column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'hr' AND table_name = 'leaves' AND column_name = 'rejection_reason') THEN
              ALTER TABLE hr.leaves ADD COLUMN rejection_reason TEXT;
          END IF;
      END $$
    `);

    // Update leave_type enum to include all types
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP CONSTRAINT IF EXISTS leaves_leave_type_check`
    );
    await queryRunner.query(`
      ALTER TABLE hr.leaves ADD CONSTRAINT leaves_leave_type_check 
          CHECK (leave_type IN ('annual', 'sick', 'unpaid', 'personal', 'maternity', 'emergency', 'other'))
    `);

    // Update status enum
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP CONSTRAINT IF EXISTS leaves_status_check`
    );
    await queryRunner.query(`
      ALTER TABLE hr.leaves ADD CONSTRAINT leaves_status_check 
          CHECK (status IN ('pending', 'approved', 'rejected'))
    `);

    // Ensure reason is not nullable (should be required)
    await queryRunner.query(
      `ALTER TABLE hr.leaves ALTER COLUMN reason SET NOT NULL`
    );

    // Update existing records to populate new fields
    await queryRunner.query(`
      UPDATE hr.leaves 
      SET 
          start_date = leave_date,
          end_date = leave_date + INTERVAL '1 day' * (number_of_days - 1),
          applied_date = COALESCE(applied_date, created_at::DATE)
      WHERE start_date IS NULL OR end_date IS NULL
    `);

    // Add indexes for better performance on leaves
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_leaves_leave_type ON hr.leaves(leave_type)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_leaves_start_date ON hr.leaves(start_date)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_leaves_end_date ON hr.leaves(end_date)`
    );

    // Create a view for leave requests with calculated fields
    await queryRunner.query(`
      CREATE OR REPLACE VIEW hr.leave_requests_view AS
      SELECT 
          l.*,
          e.full_name as employee_name,
          e.employee_code,
          e.position as employee_position,
          approver.full_name as approved_by_name,
          CASE 
              WHEN l.status = 'approved' THEN l.updated_at::DATE
              ELSE NULL 
          END as approved_date_calculated,
          CASE 
              WHEN l.status = 'rejected' THEN l.hr_note
              ELSE NULL 
          END as rejection_reason_calculated
      FROM hr.leaves l
      LEFT JOIN core.employees e ON l.employee_id = e.id
      LEFT JOIN core.employees approver ON l.approved_by = approver.id
    `);

    await queryRunner.query(`
      COMMENT ON VIEW hr.leave_requests_view IS 'Comprehensive view of leave requests with employee details and calculated fields'
    `);

    // =====================================================
    // 4) ATTENDANCE TABLE
    // =====================================================

    // Add date column to attendance table
    await queryRunner.query(`
      ALTER TABLE hr.attendance 
      ADD COLUMN IF NOT EXISTS date DATE
    `);

    // Add status column to attendance table
    await queryRunner.query(`
      ALTER TABLE hr.attendance 
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'present'
    `);

    // Update existing records with date from check_in_time
    await queryRunner.query(`
      UPDATE hr.attendance 
      SET date = DATE(check_in_time) 
      WHERE date IS NULL AND check_in_time IS NOT NULL
    `);

    // For records without check_in_time, set date to current date
    await queryRunner.query(`
      UPDATE hr.attendance 
      SET date = CURRENT_DATE 
      WHERE date IS NULL
    `);

    // Add check constraint for status
    await queryRunner.query(
      `ALTER TABLE hr.attendance DROP CONSTRAINT IF EXISTS chk_attendance_status`
    );

    await queryRunner.query(`
      ALTER TABLE hr.attendance 
      ADD CONSTRAINT chk_attendance_status 
      CHECK (status IN ('present', 'absent', 'late', 'half-day'))
    `);

    // Create indexes on attendance for better performance
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_attendance_date ON hr.attendance(date)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON hr.attendance(employee_id, date)`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_attendance_working_shift ON hr.attendance(working_shift_id)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // =====================================================
    // ROLLBACK - In reverse order
    // =====================================================

    // 4) Attendance table rollback
    await queryRunner.query(
      `DROP INDEX IF EXISTS hr.idx_attendance_working_shift`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS hr.idx_attendance_employee_date`
    );
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_attendance_date`);
    await queryRunner.query(
      `ALTER TABLE hr.attendance DROP CONSTRAINT IF EXISTS chk_attendance_status`
    );
    await queryRunner.query(
      `ALTER TABLE hr.attendance DROP COLUMN IF EXISTS status`
    );
    await queryRunner.query(
      `ALTER TABLE hr.attendance DROP COLUMN IF EXISTS date`
    );

    // 3) Leaves table rollback
    await queryRunner.query(`DROP VIEW IF EXISTS hr.leave_requests_view`);
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_leaves_end_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_leaves_start_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_leaves_leave_type`);
    await queryRunner.query(
      `ALTER TABLE hr.leaves ALTER COLUMN reason DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP CONSTRAINT IF EXISTS leaves_status_check`
    );
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP CONSTRAINT IF EXISTS leaves_leave_type_check`
    );
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP COLUMN IF EXISTS rejection_reason`
    );
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP COLUMN IF EXISTS approved_date`
    );
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP COLUMN IF EXISTS applied_date`
    );
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP COLUMN IF EXISTS end_date`
    );
    await queryRunner.query(
      `ALTER TABLE hr.leaves DROP COLUMN IF EXISTS start_date`
    );

    // 2) Working shifts rollback
    await queryRunner.query(`
      ALTER TABLE hr.working_shifts 
      ALTER COLUMN property_id SET NOT NULL
    `);

    // 1) Employee evaluations rollback
    await queryRunner.query(
      `DROP INDEX IF EXISTS hr.idx_evaluations_overall_score`
    );
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_evaluations_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_evaluations_period`);
    await queryRunner.query(`DROP INDEX IF EXISTS hr.idx_evaluations_status`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS hr.idx_evaluations_evaluator_id`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS hr.idx_evaluations_employee_id`
    );
    await queryRunner.query(`DROP TABLE IF EXISTS hr.employee_evaluations`);
  }
}
