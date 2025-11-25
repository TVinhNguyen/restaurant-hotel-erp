BEGIN;

-- Bỏ 2 cột giờ khỏi core.properties
ALTER TABLE core.properties
  DROP COLUMN IF EXISTS check_in_time,
  DROP COLUMN IF EXISTS check_out_time;

COMMIT;
