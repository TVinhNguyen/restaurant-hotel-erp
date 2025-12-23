-- Create Admin Employee Script
-- Run this script to create an admin user for testing

-- 1. Create a user account (if not exists)
INSERT INTO users (email, password_hash, full_name, phone_number, is_active, created_at, updated_at)
VALUES (
  'admin@hotel.com',
  '$2b$10$rQZ5YxJ0qH8Y7YZJ3YQJYuXZ5YxJ0qH8Y7YZJ3YQJYuXZ5YxJ0qH8Y', -- password: Admin@123
  'Admin User',
  '0123456789',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Get the user_id (you may need to adjust this based on your actual user_id)
-- Let's assume the user_id is returned or you can query it

-- 2. Create an employee record
-- First, let's get the property_id (assuming property_id = 1, adjust as needed)
INSERT INTO employees (
  user_id,
  first_name,
  last_name,
  email,
  phone_number,
  hire_date,
  employment_status,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'Admin',
  'User',
  'admin@hotel.com',
  '0123456789',
  NOW(),
  'active',
  NOW(),
  NOW()
FROM users u
WHERE u.email = 'admin@hotel.com'
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- 3. Get or create Admin role
INSERT INTO roles (name, description, created_at, updated_at)
VALUES (
  'Admin',
  'Administrator with full access',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING
RETURNING id;

-- 4. Assign employee to Admin role with property
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
  1, -- property_id, adjust this
  NOW(),
  NOW(),
  NOW()
FROM employees e
CROSS JOIN roles r
WHERE e.email = 'admin@hotel.com'
  AND r.name = 'Admin'
ON CONFLICT DO NOTHING;

-- 5. Assign all permissions to Admin role
INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at)
SELECT 
  r.id,
  p.id,
  NOW(),
  NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Display the created admin user info
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  e.id as employee_id,
  r.name as role_name,
  er.property_id
FROM users u
JOIN employees e ON e.user_id = u.id
JOIN employee_roles er ON er.employee_id = e.id
JOIN roles r ON r.id = er.role_id
WHERE u.email = 'admin@hotel.com';
