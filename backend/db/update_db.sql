-- 1) FK còn thiếu
ALTER TABLE core.employee_roles
  ADD CONSTRAINT employee_roles_property_fk
  FOREIGN KEY (property_id) REFERENCES core.properties(id) ON DELETE CASCADE;

-- 2) TableBooking hỗ trợ "guest hoặc user nội bộ"
ALTER TABLE restaurant.table_bookings
  ADD COLUMN booked_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- (Tuỳ chọn) Bảo đảm có ít nhất một trong hai: guest hoặc user
ALTER TABLE restaurant.table_bookings
  ADD CONSTRAINT tbl_booking_guest_or_user_chk
  CHECK (guest_id IS NOT NULL OR booked_by_user_id IS NOT NULL);

-- 3) (Tuỳ chọn) Role name unique (và/hoặc ràng buộc tập giá trị nếu bạn muốn)
ALTER TABLE auth.roles
  ADD CONSTRAINT uq_roles_name UNIQUE (name);
-- Nếu muốn “đóng” đúng 3 role:
-- ALTER TABLE auth.roles
--   ADD CONSTRAINT chk_roles_allowed_names
--   CHECK (name IN ('CHAIN_ADMIN','PROPERTY_MANAGER','RECEPTIONIST'));

-- 4) (Khuyến nghị) Ràng buộc logic phổ biến
ALTER TABLE reservation.reservations
  ADD CONSTRAINT chk_resv_dates CHECK (check_in < check_out);

ALTER TABLE reservation.daily_rates
  ADD CONSTRAINT chk_daily_available_nonneg CHECK (available_rooms IS NULL OR available_rooms >= 0);

-- 5) (Khuyến nghị) Unique cho payroll & photo
ALTER TABLE hr.payrolls
  ADD CONSTRAINT uq_payroll_employee_period UNIQUE (employee_id, period);

ALTER TABLE inventory.photos
  ADD CONSTRAINT uq_photo_roomtype_url UNIQUE (room_type_id, url);

-- 6) (Khuyến nghị) Index giao dịch thanh toán
CREATE INDEX IF NOT EXISTS ix_payments_tx ON reservation.payments(transaction_id);
