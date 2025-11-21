-- Update leave schema to be fully consistent
-- Add missing fields and ensure data types are aligned

-- First, add missing columns if they don't exist
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
END $$;

-- Update leave_type enum to include all types
ALTER TABLE hr.leaves DROP CONSTRAINT IF EXISTS leaves_leave_type_check;
ALTER TABLE hr.leaves ADD CONSTRAINT leaves_leave_type_check 
    CHECK (leave_type IN ('annual', 'sick', 'unpaid', 'personal', 'maternity', 'emergency', 'other'));

-- Update status enum 
ALTER TABLE hr.leaves DROP CONSTRAINT IF EXISTS leaves_status_check;
ALTER TABLE hr.leaves ADD CONSTRAINT leaves_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- Ensure reason is not nullable (should be required)
ALTER TABLE hr.leaves ALTER COLUMN reason SET NOT NULL;

-- Update existing records to populate new fields
UPDATE hr.leaves 
SET 
    start_date = leave_date,
    end_date = leave_date + INTERVAL '1 day' * (number_of_days - 1),
    applied_date = COALESCE(applied_date, created_at::DATE)
WHERE start_date IS NULL OR end_date IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leaves_employee_id ON hr.leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_leave_date ON hr.leaves(leave_date);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON hr.leaves(status);
CREATE INDEX IF NOT EXISTS idx_leaves_leave_type ON hr.leaves(leave_type);
CREATE INDEX IF NOT EXISTS idx_leaves_start_date ON hr.leaves(start_date);
CREATE INDEX IF NOT EXISTS idx_leaves_end_date ON hr.leaves(end_date);

-- Create a view for leave requests with calculated fields
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
LEFT JOIN core.employees approver ON l.approved_by = approver.id;

COMMENT ON VIEW hr.leave_requests_view IS 'Comprehensive view of leave requests with employee details and calculated fields';