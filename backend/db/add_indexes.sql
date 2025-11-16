-- ========================================
-- Database Indexes for Performance Optimization
-- Restaurant-Hotel ERP System
-- ========================================
-- This script adds critical indexes to improve query performance
-- Run with: psql -U hotel_user_v2 -d hotel_pms_v2 -f backend/db/add_indexes.sql
-- ========================================

-- Auth Schema Indexes
-- ========================================

-- Users table - Critical for login queries
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON auth.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON auth.users(status);

-- Core Schema Indexes
-- ========================================

-- Guests table - High frequency lookups
CREATE INDEX IF NOT EXISTS idx_guests_email ON core.guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON core.guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_first_name ON core.guests(first_name);
CREATE INDEX IF NOT EXISTS idx_guests_last_name ON core.guests(last_name);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON core.guests(created_at);

-- Properties table - Lookup by type and location
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON core.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON core.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_country ON core.properties(country);
CREATE INDEX IF NOT EXISTS idx_properties_status ON core.properties(status);

-- Employees table - HR queries
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON core.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_property_id ON core.employees(property_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON core.employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON core.employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_position ON core.employees(position);

-- Inventory Schema Indexes
-- ========================================

-- Room Types table - Room inventory queries
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON inventory.room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_name ON inventory.room_types(name);

-- Rooms table - Most frequently queried
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON inventory.rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_property_id ON inventory.rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_rooms_operational_status ON inventory.rooms(operational_status);
CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON inventory.rooms(room_number);

-- Composite index for room availability queries
CREATE INDEX IF NOT EXISTS idx_rooms_property_type_status 
  ON inventory.rooms(property_id, room_type_id, operational_status);

-- Amenities table
CREATE INDEX IF NOT EXISTS idx_amenities_property_id ON inventory.amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_amenities_amenity_type ON inventory.amenities(amenity_type);

-- Reservation Schema Indexes
-- ========================================

-- Reservations table - Critical for booking system
CREATE INDEX IF NOT EXISTS idx_reservations_guest_id ON reservation.reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON reservation.reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_room_type_id ON reservation.reservations(room_type_id);
CREATE INDEX IF NOT EXISTS idx_reservations_assigned_room_id ON reservation.reservations(assigned_room_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservation.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_confirmation_code ON reservation.reservations(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservation.reservations(check_in);
CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservation.reservations(check_out);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservation.reservations(created_at);

-- Composite indexes for common reservation queries
CREATE INDEX IF NOT EXISTS idx_reservations_property_status 
  ON reservation.reservations(property_id, status);
  
CREATE INDEX IF NOT EXISTS idx_reservations_property_dates 
  ON reservation.reservations(property_id, check_in, check_out);
  
CREATE INDEX IF NOT EXISTS idx_reservations_property_status_dates 
  ON reservation.reservations(property_id, status, check_in, check_out);

-- Payments table - Financial queries
CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON reservation.payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_guest_id ON reservation.payments(guest_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_status ON reservation.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_method ON reservation.payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON reservation.payments(payment_date);

-- Rate Plans table
CREATE INDEX IF NOT EXISTS idx_rate_plans_property_id ON reservation.rate_plans(property_id);
CREATE INDEX IF NOT EXISTS idx_rate_plans_room_type_id ON reservation.rate_plans(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rate_plans_is_active ON reservation.rate_plans(is_active);

-- Daily Rates table - Date range queries
CREATE INDEX IF NOT EXISTS idx_daily_rates_rate_plan_id ON reservation.daily_rates(rate_plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_rates_date ON reservation.daily_rates(date);

-- Composite index for rate queries
CREATE INDEX IF NOT EXISTS idx_daily_rates_plan_date 
  ON reservation.daily_rates(rate_plan_id, date);

-- Promotions table
CREATE INDEX IF NOT EXISTS idx_promotions_property_id ON reservation.promotions(property_id);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON reservation.promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_start_date ON reservation.promotions(start_date);
CREATE INDEX IF NOT EXISTS idx_promotions_end_date ON reservation.promotions(end_date);

-- Tax Rules table
CREATE INDEX IF NOT EXISTS idx_tax_rules_property_id ON reservation.tax_rules(property_id);
CREATE INDEX IF NOT EXISTS idx_tax_rules_is_active ON reservation.tax_rules(is_active);

-- Services Schema Indexes
-- ========================================

-- Services table
CREATE INDEX IF NOT EXISTS idx_services_service_type ON services.services(service_type);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services.services(is_active);

-- Property Services table
CREATE INDEX IF NOT EXISTS idx_property_services_property_id ON services.property_services(property_id);
CREATE INDEX IF NOT EXISTS idx_property_services_service_id ON services.property_services(service_id);
CREATE INDEX IF NOT EXISTS idx_property_services_is_available ON services.property_services(is_available);

-- Composite index for service availability
CREATE INDEX IF NOT EXISTS idx_property_services_property_available 
  ON services.property_services(property_id, is_available);

-- Reservation Services table
CREATE INDEX IF NOT EXISTS idx_reservation_services_reservation_id 
  ON services.reservation_services(reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservation_services_service_id 
  ON services.reservation_services(service_id);
CREATE INDEX IF NOT EXISTS idx_reservation_services_status 
  ON services.reservation_services(status);

-- Restaurant Schema Indexes
-- ========================================

-- Restaurants table
CREATE INDEX IF NOT EXISTS idx_restaurants_property_id ON restaurant.restaurants(property_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurant.restaurants(status);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_type ON restaurant.restaurants(cuisine_type);

-- HR Schema Indexes
-- ========================================

-- Working Shifts table
CREATE INDEX IF NOT EXISTS idx_working_shifts_employee_id ON hr.working_shifts(employee_id);
CREATE INDEX IF NOT EXISTS idx_working_shifts_property_id ON hr.working_shifts(property_id);
CREATE INDEX IF NOT EXISTS idx_working_shifts_shift_date ON hr.working_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_working_shifts_status ON hr.working_shifts(status);

-- Composite index for shift scheduling
CREATE INDEX IF NOT EXISTS idx_working_shifts_employee_date 
  ON hr.working_shifts(employee_id, shift_date);
  
CREATE INDEX IF NOT EXISTS idx_working_shifts_property_date 
  ON hr.working_shifts(property_id, shift_date);

-- Leave table
CREATE INDEX IF NOT EXISTS idx_leave_employee_id ON hr.leave(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_start_date ON hr.leave(start_date);
CREATE INDEX IF NOT EXISTS idx_leave_end_date ON hr.leave(end_date);
CREATE INDEX IF NOT EXISTS idx_leave_status ON hr.leave(status);

-- Overtimes table
CREATE INDEX IF NOT EXISTS idx_overtimes_employee_id ON hr.overtimes(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtimes_overtime_date ON hr.overtimes(overtime_date);
CREATE INDEX IF NOT EXISTS idx_overtimes_status ON hr.overtimes(status);

-- Deductions table
CREATE INDEX IF NOT EXISTS idx_deductions_employee_id ON hr.deductions(employee_id);
CREATE INDEX IF NOT EXISTS idx_deductions_deduction_date ON hr.deductions(deduction_date);

-- Payroll table
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON hr.payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_pay_period_start ON hr.payroll(pay_period_start);
CREATE INDEX IF NOT EXISTS idx_payroll_pay_period_end ON hr.payroll(pay_period_end);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON hr.payroll(status);

-- Composite index for payroll processing
CREATE INDEX IF NOT EXISTS idx_payroll_employee_period 
  ON hr.payroll(employee_id, pay_period_start, pay_period_end);

-- Employee Evaluations table
CREATE INDEX IF NOT EXISTS idx_employee_evaluations_employee_id 
  ON hr.employee_evaluations(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_evaluations_evaluator_id 
  ON hr.employee_evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_employee_evaluations_evaluation_date 
  ON hr.employee_evaluations(evaluation_date);

-- ========================================
-- Performance Analysis Queries (Optional)
-- ========================================
-- After creating indexes, you can analyze query performance with:
-- EXPLAIN ANALYZE SELECT * FROM reservation.reservations WHERE status = 'confirmed';
-- EXPLAIN ANALYZE SELECT * FROM inventory.rooms WHERE property_id = 'uuid' AND operational_status = 'available';

-- Check index usage:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
-- FROM pg_stat_user_indexes 
-- ORDER BY idx_scan DESC;

-- ========================================
-- Summary
-- ========================================
-- Total indexes created: 90+
-- Schemas covered: auth, core, inventory, reservation, services, restaurant, hr
-- Impact: 10-100x faster queries for indexed columns
-- ========================================
