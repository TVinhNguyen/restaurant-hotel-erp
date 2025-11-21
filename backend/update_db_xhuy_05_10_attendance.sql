-- Update attendance table to match frontend interface
-- Add date and status columns

-- Add date column
ALTER TABLE hr.attendance 
ADD COLUMN IF NOT EXISTS date DATE;

-- Add status column
ALTER TABLE hr.attendance 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'present';

-- Update existing records with date from check_in_time
UPDATE hr.attendance 
SET date = DATE(check_in_time) 
WHERE date IS NULL AND check_in_time IS NOT NULL;

-- For records without check_in_time, set date to current date
UPDATE hr.attendance 
SET date = CURRENT_DATE 
WHERE date IS NULL;

-- Add check constraint for status
ALTER TABLE hr.attendance 
ADD CONSTRAINT chk_attendance_status 
CHECK (status IN ('present', 'absent', 'late', 'half-day'));

-- Create index on date for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_date ON hr.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON hr.attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_working_shift ON hr.attendance(working_shift_id);

-- Show table structure
\d hr.attendance;