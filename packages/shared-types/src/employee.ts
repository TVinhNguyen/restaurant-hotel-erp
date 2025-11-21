/**
 * Employee and HR types
 */

import { UUID, TimestampFields } from './common';

export interface Employee extends TimestampFields {
  id: UUID;
  userId: UUID;
  propertyId: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  hireDate: Date;
  terminationDate?: Date | null;
  position: string;
  department: Department;
  salary?: number;
  status: EmployeeStatus;
  emergencyContact?: EmergencyContact;
}

export enum Department {
  FRONT_DESK = 'front_desk',
  HOUSEKEEPING = 'housekeeping',
  FOOD_BEVERAGE = 'food_beverage',
  KITCHEN = 'kitchen',
  MAINTENANCE = 'maintenance',
  MANAGEMENT = 'management',
  SALES_MARKETING = 'sales_marketing',
  FINANCE = 'finance',
  HR = 'hr',
  IT = 'it',
  SECURITY = 'security',
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface CreateEmployeeDto {
  userId: UUID;
  propertyId: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  hireDate: string;
  position: string;
  department: Department;
  salary?: number;
  emergencyContact?: EmergencyContact;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  id: UUID;
  status?: EmployeeStatus;
  terminationDate?: string;
}

export interface WorkingShift extends TimestampFields {
  id: UUID;
  employeeId: UUID;
  shiftDate: Date;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  hoursWorked?: number;
  status: ShiftStatus;
  notes?: string;
}

export enum ShiftStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export interface Attendance extends TimestampFields {
  id: UUID;
  employeeId: UUID;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  status: AttendanceStatus;
  notes?: string;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  ON_LEAVE = 'on_leave',
}

export interface Leave extends TimestampFields {
  id: UUID;
  employeeId: UUID;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: UUID;
  approvedAt?: Date;
}

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  UNPAID = 'unpaid',
  BEREAVEMENT = 'bereavement',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}
