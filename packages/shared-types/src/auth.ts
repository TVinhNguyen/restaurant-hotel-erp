/**
 * Authentication and Authorization types
 */

import { UUID } from './common';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}

export interface UserProfile {
  id: UUID;
  email: string;
  fullName?: string;
  role: UserRole;
  permissions?: string[];
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  RECEPTIONIST = 'receptionist',
  HOUSEKEEPER = 'housekeeper',
  WAITER = 'waiter',
  CHEF = 'chef',
  GUEST = 'guest',
}

export interface JwtPayload {
  sub: UUID;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
