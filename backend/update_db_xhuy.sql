
-- PostgreSQL init script for PMS/Restaurant/HR system
-- Run with: psql -U postgres -f pms_postgres_init.sql

-- 0) Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- (Optional, alternative) CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS reservation;
CREATE SCHEMA IF NOT EXISTS restaurant;
CREATE SCHEMA IF NOT EXISTS hr;

-- 2) Auth & Core
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150),
  phone VARCHAR(20),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  scope VARCHAR(20) CHECK (scope IN ('global','per_property')) NOT NULL
);

CREATE TABLE IF NOT EXISTS core.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code VARCHAR(50),
  full_name VARCHAR(150) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(50) CHECK (department IN ('IT Department','Human Resources','Marketing','Finances','Sales')),
  status VARCHAR(20) CHECK (status IN ('active','on_leave','terminated')) DEFAULT 'active',
  hire_date DATE,
  termination_date DATE
);

CREATE TABLE IF NOT EXISTS core.employee_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE RESTRICT,
  effective_from DATE,
  effective_to DATE
);

CREATE TABLE IF NOT EXISTS core.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  loyalty_tier VARCHAR(50),
  passport_id VARCHAR(50),
  consent_marketing BOOLEAN DEFAULT FALSE,
  privacy_version VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3) Property & Inventory
CREATE TABLE IF NOT EXISTS core.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(100),
  property_type VARCHAR(50) CHECK (property_type IN ('Hotel','Resort','Restaurant Chain')),
  check_in_time TIME,
  check_out_time TIME
);

CREATE TABLE IF NOT EXISTS inventory.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_adults INT,
  max_children INT,
  base_price NUMERIC(12,2),
  bed_type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS inventory.amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('room','facility'))
);

CREATE TABLE IF NOT EXISTS inventory.room_type_amenities (
  room_type_id UUID REFERENCES inventory.room_types(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES inventory.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (room_type_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS inventory.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id UUID NOT NULL REFERENCES inventory.room_types(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT
);

CREATE TABLE IF NOT EXISTS inventory.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  room_type_id UUID NOT NULL REFERENCES inventory.room_types(id) ON DELETE RESTRICT,
  number VARCHAR(20) NOT NULL,
  floor VARCHAR(20),
  view_type VARCHAR(50),
  operational_status VARCHAR(20) CHECK (operational_status IN ('available','out_of_service')) DEFAULT 'available',
  housekeeping_status VARCHAR(20) CHECK (housekeeping_status IN ('clean','dirty','inspected')) DEFAULT 'clean',
  housekeeper_notes TEXT,
  UNIQUE(property_id, number)
);

CREATE TABLE IF NOT EXISTS inventory.room_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES inventory.rooms(id) ON DELETE CASCADE,
  status_type VARCHAR(20) CHECK (status_type IN ('operational','housekeeping')) NOT NULL,
  status VARCHAR(20) NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW(),
  changed_by UUID REFERENCES core.employees(id) ON DELETE SET NULL,
  notes TEXT
);

-- 4) Rates & Availability
CREATE TABLE IF NOT EXISTS reservation.rate_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  room_type_id UUID NOT NULL REFERENCES inventory.room_types(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  cancellation_policy TEXT,
  currency VARCHAR(10) NOT NULL,
  min_stay INT,
  max_stay INT,
  is_refundable BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservation.daily_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_plan_id UUID NOT NULL REFERENCES reservation.rate_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  available_rooms INT,
  stop_sell BOOLEAN DEFAULT FALSE,
  UNIQUE(rate_plan_id, date)
);

-- 5) Services, Promotions, Taxes
CREATE TABLE IF NOT EXISTS reservation.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  unit VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS reservation.property_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES reservation.services(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  currency VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS reservation.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent NUMERIC(5,2) CHECK (discount_percent >= 0 AND discount_percent <= 100) NOT NULL,
  valid_from DATE,
  valid_to DATE,
  property_id UUID REFERENCES core.properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservation.tax_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  rate NUMERIC(5,2) CHECK (rate >= 0 AND rate <= 100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('VAT','service')) NOT NULL
);

-- 6) Reservation & Payment
CREATE TABLE IF NOT EXISTS reservation.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES core.guests(id) ON DELETE RESTRICT,
  booker_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  channel VARCHAR(20) CHECK (channel IN ('ota','website','walkin','phone')),
  external_ref VARCHAR(100),
  promotion_id UUID REFERENCES reservation.promotions(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending','confirmed','checked_in','checked_out','cancelled','no_show')) DEFAULT 'pending',
  room_type_id UUID NOT NULL REFERENCES inventory.room_types(id) ON DELETE RESTRICT,
  rate_plan_id UUID NOT NULL REFERENCES reservation.rate_plans(id) ON DELETE RESTRICT,
  assigned_room_id UUID REFERENCES inventory.rooms(id) ON DELETE SET NULL,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  contact_name VARCHAR(100),
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  guest_notes TEXT,
  confirmation_code VARCHAR(50) UNIQUE,
  total_amount NUMERIC(12,2) DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  service_amount NUMERIC(12,2) DEFAULT 0,
  amount_paid NUMERIC(12,2) DEFAULT 0,
  currency VARCHAR(10) NOT NULL,
  payment_status VARCHAR(20) CHECK (payment_status IN ('unpaid','partial','paid','refunded')) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservation.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservation.reservations(id) ON DELETE CASCADE,
  parent_payment_id UUID REFERENCES reservation.payments(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  method VARCHAR(50) CHECK (method IN ('cash','card','bank','e_wallet','ota_virtual')) NOT NULL,
  transaction_id VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('authorized','captured','refunded','voided')) NOT NULL,
  paid_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS reservation.reservation_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservation.reservations(id) ON DELETE CASCADE,
  property_service_id UUID NOT NULL REFERENCES reservation.property_services(id) ON DELETE RESTRICT,
  quantity NUMERIC(10,2) DEFAULT 1,
  total_price NUMERIC(12,2) NOT NULL,
  date_provided DATE
);

-- 7) Restaurant
CREATE TABLE IF NOT EXISTS restaurant.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  opening_hours VARCHAR(100),
  cuisine_type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS restaurant.restaurant_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurant.restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS restaurant.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurant.restaurants(id) ON DELETE CASCADE,
  area_id UUID REFERENCES restaurant.restaurant_areas(id) ON DELETE SET NULL,
  table_number VARCHAR(20) NOT NULL,
  capacity INT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('available','occupied','reserved')) DEFAULT 'available',
  UNIQUE(restaurant_id, table_number)
);

CREATE TABLE IF NOT EXISTS restaurant.table_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurant.restaurants(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES core.guests(id) ON DELETE SET NULL,
  reservation_id UUID REFERENCES reservation.reservations(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  pax INT NOT NULL,
  status VARCHAR(30) CHECK (status IN ('pending','confirmed','seated','completed','no_show','cancelled')) DEFAULT 'pending',
  assigned_table_id UUID REFERENCES restaurant.restaurant_tables(id) ON DELETE SET NULL,
  special_requests TEXT,
  duration_minutes INT DEFAULT 90,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8) HR
CREATE TABLE IF NOT EXISTS hr.working_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES core.properties(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  working_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  shift_type VARCHAR(20) CHECK (shift_type IN ('morning','night','other')),
  notes TEXT,
  is_reassigned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  working_shift_id UUID REFERENCES hr.working_shifts(id) ON DELETE SET NULL,
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS hr.leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  leave_date DATE NOT NULL,
  number_of_days INT DEFAULT 1,
  leave_type VARCHAR(20) CHECK (leave_type IN ('annual','sick','unpaid','other')),
  status VARCHAR(20) CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  reason TEXT,
  approved_by UUID REFERENCES core.employees(id) ON DELETE SET NULL,
  hr_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr.employee_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  evaluated_by UUID REFERENCES core.employees(id) ON DELETE SET NULL,
  rate INT CHECK (rate BETWEEN 1 AND 10),
  period VARCHAR(20) CHECK (period IN ('quarterly','annual')),
  goals TEXT,
  strength TEXT,
  improvement TEXT,
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr.payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  period VARCHAR(10) NOT NULL, -- YYYY-MM
  basic_salary NUMERIC(12,2) NOT NULL,
  net_salary NUMERIC(12,2) NOT NULL,
  bonus NUMERIC(12,2) DEFAULT 0,
  currency VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr.overtimes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  working_shift_id UUID REFERENCES hr.working_shifts(id) ON DELETE SET NULL,
  number_of_hours NUMERIC(6,2) NOT NULL,
  rate NUMERIC(8,2) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  approved_by UUID REFERENCES core.employees(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr.deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES core.employees(id) ON DELETE CASCADE,
  leave_id UUID REFERENCES hr.leaves(id) ON DELETE SET NULL,
  type VARCHAR(20) CHECK (type IN ('tax','insurance','other')),
  amount NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL,
  reason_details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_reservations_property_dates ON reservation.reservations(property_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_payments_reservation ON reservation.payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_daily_rates_plan_date ON reservation.daily_rates(rate_plan_id, date);
CREATE INDEX IF NOT EXISTS idx_rooms_property_status ON inventory.rooms(property_id, operational_status);
CREATE INDEX IF NOT EXISTS idx_table_bookings_restaurant_date ON restaurant.table_bookings(restaurant_id, booking_date);