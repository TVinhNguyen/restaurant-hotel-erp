-- Create Receptionist Employee Script
-- Run this script to create a receptionist user for the hotel

-- 1. Create a user account (if not exists)
INSERT INTO users (email, password_hash, full_name, phone_number, is_active, created_at, updated_at)
VALUES (
  'receptionist@hotel.com',
  '$2b$10$rQZ5YxJ0qH8Y7YZJ3YQJYuXZ5YxJ0qH8Y7YZJ3YQJYuXZ5YxJ0qH8Y', -- password: Receptionist@123
  'Receptionist User',
  '0123456790',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- 2. Create an employee record
INSERT INTO employees (
  user_id,
  first_name,
  last_name,
  email,
  phone_number,
  hire_date,
  employment_status,
  department,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'Receptionist',
  'User',
  'receptionist@hotel.com',
  '0123456790',
  NOW(),
  'active',
  'Front Desk',
  NOW(),
  NOW()
FROM users u
WHERE u.email = 'receptionist@hotel.com'
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- 3. Get or create Receptionist role
INSERT INTO roles (name, description, created_at, updated_at)
VALUES (
  'Receptionist',
  'Front desk receptionist with check-in/check-out access',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING
RETURNING id;

-- 4. Assign employee to Receptionist role with property
-- Assuming property_id = 1 (adjust based on your setup)
INSERT INTO employee_roles (
  employee_id,
  role_id,
  property_id,
  assigned_at,
  created_at,
  updated_at
)
SELECT 
  e.id,
  r.id,
  1, -- property_id, adjust this if needed
  NOW(),
  NOW(),
  NOW()
FROM employees e
CROSS JOIN roles r
WHERE e.email = 'receptionist@hotel.com'
  AND r.name = 'Receptionist'
ON CONFLICT DO NOTHING;

-- 5. Assign relevant permissions to Receptionist role
-- Receptionists typically need access to:
-- - Reservations (create, read, update)
-- - Guests (create, read, update)
-- - Rooms (read, update status)
-- - Check-in/Check-out operations
INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at)
SELECT 
  r.id,
  p.id,
  NOW(),
  NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Receptionist'
  AND p.resource IN ('reservations', 'guests', 'rooms', 'payments')
  AND p.action IN ('create', 'read', 'update')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Display the created receptionist user info
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  e.id as employee_id,
  e.department,
  r.name as role_name,
  er.property_id
FROM users u
JOIN employees e ON e.user_id = u.id
JOIN employee_roles er ON er.employee_id = e.id
JOIN roles r ON r.id = er.role_id
WHERE u.email = 'receptionist@hotel.com';
