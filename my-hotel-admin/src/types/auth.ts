export interface Role {
  id: string;
  name: string;
  description?: string;
  scope: 'global' | 'per_property';
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface EmployeeRole {
  id: string;
  employeeId: string;
  propertyId: string;
  roleId: string;
  role: Role;
  effectiveFrom?: Date;
  effectiveTo?: Date;
}

export interface Employee {
  id: string;
  userId?: string;
  employeeCode?: string;
  fullName: string;
  department?: 'Front Desk' | 'Housekeeping' | 'HR' | 'F&B';
  position?: string;
  status: 'active' | 'on_leave' | 'terminated';
  employeeRoles?: EmployeeRole[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  employee?: Employee;
  roles?: string[]; // Role names for backward compatibility
  permissions?: string[]; // Permission slugs for fine-grained access control
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Define role constants
export const ROLES = {
  ADMIN: 'Admin',
  FRONT_DESK: 'Front Desk',
  HOUSEKEEPING: 'Housekeeping',
  HR: 'HR',
  FB: 'F&B',
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];
