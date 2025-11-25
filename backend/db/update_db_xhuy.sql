-- update.sql
-- Mục tiêu: core.employees có schema như sau:
--  id UUID DEFAULT gen_random_uuid() PRIMARY KEY
--  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
--  employee_code VARCHAR(50)
--  full_name VARCHAR(150) NOT NULL
--  position VARCHAR(100)
--  department IN ('IT Department','Human Resources','Marketing','Finances','Sales')
--  status IN ('active','on_leave','terminated') DEFAULT 'active'
--  hire_date DATE
--  termination_date DATE

-- 0) Bảo đảm extension & schema tồn tại (không lỗi nếu đã có)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS core;

BEGIN;

-- 1) Bảo đảm bảng đã tồn tại (nếu chưa có thì tạo khung tối thiểu để ALTER)
--    (Nếu bạn chắc chắn bảng đã có thì có thể bỏ khối CREATE này)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'core' AND table_name = 'employees'
  ) THEN
    CREATE TABLE core.employees (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      employee_code VARCHAR(50),
      full_name VARCHAR(150) NOT NULL,
      department VARCHAR(50),
      status VARCHAR(20) DEFAULT 'active',
      hire_date DATE,
      termination_date DATE
    );
  END IF;
END$$;

-- 2) Thêm cột position nếu chưa có
ALTER TABLE core.employees
  ADD COLUMN IF NOT EXISTS position VARCHAR(100);

-- 3) Gỡ CHECK constraint cũ trên department (tên tự sinh nên phải dò)
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'core'
      AND rel.relname = 'employees'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%department%'
  LOOP
    EXECUTE format('ALTER TABLE core.employees DROP CONSTRAINT %I', c.conname);
  END LOOP;
END$$;

-- 4) Chuẩn hoá dữ liệu department từ bộ cũ sang bộ mới (tùy bạn chỉnh lại mapping)
--    Nếu bạn muốn khác mapping, sửa các UPDATE bên dưới cho phù hợp.
UPDATE core.employees SET department = 'Human Resources' WHERE department IN ('HR');
UPDATE core.employees SET department = 'Sales'           WHERE department IN ('Front Desk');
-- 'Housekeeping' không còn trong bộ mới -> tạm cho NULL (hoặc tự mapping sang 'Finances'/'IT Department'/... theo nhu cầu)
UPDATE core.employees SET department = NULL              WHERE department IN ('Housekeeping');

-- 5) Thêm CHECK constraint mới cho department (chỉ các giá trị “bản dưới”)
ALTER TABLE core.employees
  ADD CONSTRAINT employees_department_check
    CHECK (
      department IS NULL
      OR department IN ('IT Department','Human Resources','Marketing','Finances','Sales')
    );

-- 6) Bảo đảm CHECK cho status (nếu trước đó có ràng buộc khác, ta thay bằng đúng bộ giá trị)
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'core'
      AND rel.relname = 'employees'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE core.employees DROP CONSTRAINT %I', c.conname);
  END LOOP;
END$$;

ALTER TABLE core.employees
  ADD CONSTRAINT employees_status_check
    CHECK (status IN ('active','on_leave','terminated'));

COMMIT;
