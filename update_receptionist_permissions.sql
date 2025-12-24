-- Update Receptionist Permissions Script
-- Run this script to add necessary permissions for receptionist to manage services

-- =====================================================
-- PART 1: Add new permissions for services (if not exist)
-- =====================================================

-- Permission for reservation-services (services used by guests)
INSERT INTO permissions (slug, name, module, description)
VALUES 
  ('reservation-service.create', 'Add Services to Reservation', 'FrontDesk', 'Can add services to guest reservations'),
  ('reservation-service.view', 'View Reservation Services', 'FrontDesk', 'Can view services used by guests'),
  ('reservation-service.edit', 'Edit Reservation Services', 'FrontDesk', 'Can edit services on reservations'),
  ('reservation-service.delete', 'Delete Reservation Services', 'FrontDesk', 'Can remove services from reservations')
ON CONFLICT (slug) DO NOTHING;

-- Permission for property-services (viewing available services)
INSERT INTO permissions (slug, name, module, description)
VALUES 
  ('property-service.view', 'View Property Services', 'FrontDesk', 'Can view available services for property')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- PART 2: Assign permissions to Receptionist role
-- =====================================================

-- Get Receptionist role ID
-- Receptionist role ID: 86997941-56b0-4e72-8a0d-8c1f4acda6ee

-- Insert role-permissions for Receptionist
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  '86997941-56b0-4e72-8a0d-8c1f4acda6ee'::uuid,
  p.id
FROM permissions p
WHERE p.slug IN (
  -- Reservation permissions
  'reservation.view',
  'reservation.create',
  'reservation.edit',
  'reservation.cancel',
  'reservation.checkin',
  'reservation.checkout',
  
  -- Guest permissions
  'guest.view',
  'guest.edit',
  
  -- Room permissions
  'room.view',
  'room.edit',
  
  -- Payment permissions
  'payment.view',
  'payment.process',
  
  -- Property permissions
  'property.view',
  
  -- Reservation services permissions (new)
  'reservation-service.create',
  'reservation-service.view',
  'reservation-service.edit',
  'reservation-service.delete',
  
  -- Property services permissions (new)
  'property-service.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =====================================================
-- PART 3: Verify the receptionist user exists
-- =====================================================

-- Check if receptionist user exists
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  e.id as employee_id,
  e.department
FROM users u
LEFT JOIN employees e ON e.user_id = u.id
WHERE u.email = 'receptionist@hotel.com';

-- =====================================================
-- PART 4: Assign Receptionist role to employee (if not already)
-- =====================================================

-- First, ensure employee exists and is linked to Receptionist role
-- Property ID for Mường Thanh Grand Đà Nẵng: 6fd10d2a-db53-4405-a03d-c022b54cf5bd

INSERT INTO employee_roles (employee_id, role_id, property_id, assigned_at)
SELECT 
  e.id,
  '86997941-56b0-4e72-8a0d-8c1f4acda6ee'::uuid,
  '6fd10d2a-db53-4405-a03d-c022b54cf5bd'::uuid,
  NOW()
FROM employees e
JOIN users u ON u.id = e.user_id
WHERE u.email = 'receptionist@hotel.com'
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 5: Verify role permissions
-- =====================================================

SELECT 
  r.name as role_name,
  p.slug as permission_slug,
  p.name as permission_name,
  p.module
FROM roles r
JOIN role_permissions rp ON rp.role_id = r.id
JOIN permissions p ON p.id = rp.permission_id
WHERE r.name = 'Receptionist'
ORDER BY p.module, p.slug;

-- =====================================================
-- Summary
-- =====================================================
-- Receptionist account:
--   Email: receptionist@hotel.com
--   Password: Receptionist@123
--
-- Permissions assigned:
--   - View/Create/Edit/Cancel reservations
--   - Check-in/Check-out guests
--   - View/Edit guests
--   - View/Edit rooms
--   - View/Process payments
--   - View property
--   - View/Create/Edit/Delete reservation services
--   - View property services
