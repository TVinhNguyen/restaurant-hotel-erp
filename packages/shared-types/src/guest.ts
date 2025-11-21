/**
 * Guest types
 */

import { UUID, TimestampFields } from './common';

export interface Guest extends TimestampFields {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
  idType?: IdType;
  idNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  preferences?: GuestPreferences;
  loyaltyPoints?: number;
  vipStatus?: boolean;
}

export enum IdType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  OTHER = 'other',
}

export interface GuestPreferences {
  roomPreferences?: string[];
  dietaryRestrictions?: string[];
  specialRequests?: string[];
  preferredLanguage?: string;
  smokingRoom?: boolean;
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
}

export interface CreateGuestDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  idType?: IdType;
  idNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdateGuestDto extends Partial<CreateGuestDto> {
  id: UUID;
  preferences?: GuestPreferences;
  vipStatus?: boolean;
}
