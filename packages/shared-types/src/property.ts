/**
 * Property (Hotel/Restaurant) types
 */

import { UUID, TimestampFields } from './common';

export interface Property extends TimestampFields {
  id: UUID;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  website?: string;
  starRating?: number;
  checkInTime?: string;
  checkOutTime?: string;
  currency: string;
  timezone: string;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: UUID;
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

export interface CreatePropertyDto {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  website?: string;
  starRating?: number;
  checkInTime?: string;
  checkOutTime?: string;
  currency?: string;
  timezone?: string;
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {
  id: UUID;
}

export interface PropertyAmenity {
  id: UUID;
  propertyId: UUID;
  name: string;
  icon?: string;
  category: AmenityCategory;
}

export enum AmenityCategory {
  ROOM = 'room',
  HOTEL = 'hotel',
  DINING = 'dining',
  RECREATION = 'recreation',
  BUSINESS = 'business',
  WELLNESS = 'wellness',
}
