/**
 * Room and Room Type types
 */

import { UUID, TimestampFields } from './common';

export interface RoomType extends TimestampFields {
  id: UUID;
  propertyId: UUID;
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  bedType: BedType;
  size?: number;
  sizeUnit?: 'sqm' | 'sqft';
  amenities?: string[];
  images?: string[];
}

export enum BedType {
  SINGLE = 'single',
  DOUBLE = 'double',
  QUEEN = 'queen',
  KING = 'king',
  TWIN = 'twin',
  SOFA_BED = 'sofa_bed',
}

export interface Room extends TimestampFields {
  id: UUID;
  propertyId: UUID;
  roomTypeId: UUID;
  roomNumber: string;
  floor?: number;
  operationalStatus: RoomOperationalStatus;
  cleaningStatus: RoomCleaningStatus;
  notes?: string;
  roomType?: RoomType;
}

export enum RoomOperationalStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  OUT_OF_ORDER = 'out_of_order',
  UNDER_MAINTENANCE = 'under_maintenance',
}

export enum RoomCleaningStatus {
  CLEAN = 'clean',
  DIRTY = 'dirty',
  INSPECTED = 'inspected',
  CLEANING = 'cleaning',
}

export interface CreateRoomTypeDto {
  propertyId: UUID;
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  bedType: BedType;
  size?: number;
  sizeUnit?: 'sqm' | 'sqft';
  amenities?: string[];
}

export interface UpdateRoomTypeDto extends Partial<CreateRoomTypeDto> {
  id: UUID;
}

export interface CreateRoomDto {
  propertyId: UUID;
  roomTypeId: UUID;
  roomNumber: string;
  floor?: number;
  notes?: string;
}

export interface UpdateRoomDto extends Partial<CreateRoomDto> {
  id: UUID;
  operationalStatus?: RoomOperationalStatus;
  cleaningStatus?: RoomCleaningStatus;
}
