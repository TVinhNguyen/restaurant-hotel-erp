// Mock data cho Inventory Management - Updated to match DB schema
export interface RoomType {
  id: string;
  propertyId: string;
  propertyName?: string; // For UI display
  name: string;
  description?: string;
  maxAdults?: number;
  maxChildren?: number;
  basePrice?: number;
  bedType?: string;
  amenities?: string[]; // IDs of associated amenities
  photos?: string[]; // Photo URLs for compatibility
  totalRooms?: number; // Calculated field
  // Backward compatibility fields
  capacity?: number;
  bedConfiguration?: string;
  size?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  amenityIds?: string[];
}

export interface Room {
  id: string;
  propertyId: string;
  propertyName?: string; // For UI display
  roomTypeId: string;
  roomTypeName?: string; // For UI display
  number: string;
  floor?: string;
  viewType?: string;
  operationalStatus: 'available' | 'out_of_service';
  housekeepingStatus: 'clean' | 'dirty' | 'inspected';
  housekeeperNotes?: string;
  notes?: string; // Additional field for UI compatibility
}

export interface Amenity {
  id: string;
  name: string;
  category: 'room' | 'facility';
  description?: string; // Not in DB but useful for UI
}

export interface Photo {
  id: string;
  roomTypeId: string;
  url: string;
  caption?: string;
}

export interface RoomStatusHistory {
  id: string;
  roomId: string;
  statusType: 'operational' | 'housekeeping';
  status: string;
  changedAt: Date;
  changedBy?: string; // Employee ID
  changedByName?: string; // For UI display
  notes?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  propertyType: 'Hotel' | 'Resort' | 'Restaurant Chain';
}

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Grand Hotel Saigon',
    address: '123 Dong Khoi Street',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    phone: '+84 28 1234 5678',
    email: 'info@grandhotelsaigon.com',
    propertyType: 'Hotel'
  },
  {
    id: '2',
    name: 'Ocean Resort Da Nang',
    address: '456 Beach Road',
    city: 'Da Nang',
    country: 'Vietnam',
    phone: '+84 236 789 0123',
    email: 'info@oceanresortdanang.com',
    propertyType: 'Resort'
  }
];

// Mock Amenities
export const mockAmenities: Amenity[] = [
  { id: '1', name: 'Air Conditioning', category: 'room', description: 'Climate control system' },
  { id: '2', name: 'WiFi', category: 'room', description: 'High-speed internet access' },
  { id: '3', name: 'TV', category: 'room', description: 'Flat screen television' },
  { id: '4', name: 'Mini Bar', category: 'room', description: 'In-room mini refrigerator' },
  { id: '5', name: 'Safe', category: 'room', description: 'Electronic safe for valuables' },
  { id: '6', name: 'Swimming Pool', category: 'facility', description: 'Outdoor swimming pool' },
  { id: '7', name: 'Gym', category: 'facility', description: 'Fitness center' },
  { id: '8', name: 'Spa', category: 'facility', description: 'Wellness and spa services' },
  { id: '9', name: 'Restaurant', category: 'facility', description: 'On-site dining' },
  { id: '10', name: 'Conference Room', category: 'facility', description: 'Meeting facilities' }
];

// Mock Room Types
export const mockRoomTypes: RoomType[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Grand Hotel Saigon',
    name: 'Standard Room',
    description: 'Comfortable room with city view',
    maxAdults: 2,
    maxChildren: 1,
    basePrice: 1500000,
    bedType: 'Double Bed',
    amenities: ['1', '2', '3', '5'],
    photos: ['/room1.jpg', '/room1_bath.jpg'],
    totalRooms: 20,
    capacity: 3,
    bedConfiguration: 'Double Bed',
    size: 25,
    status: 'active',
    amenityIds: ['1', '2', '3', '5']
  },
  {
    id: '2',
    propertyId: '1',
    propertyName: 'Grand Hotel Saigon',
    name: 'Deluxe Room',
    description: 'Spacious room with premium amenities',
    maxAdults: 2,
    maxChildren: 2,
    basePrice: 2500000,
    bedType: 'King Bed',
    amenities: ['1', '2', '3', '4', '5'],
    photos: ['/room2.jpg', '/room2_bath.jpg'],
    totalRooms: 15,
    capacity: 4,
    bedConfiguration: 'King Bed',
    size: 35,
    status: 'active',
    amenityIds: ['1', '2', '3', '4', '5']
  },
  {
    id: '3',
    propertyId: '1',
    propertyName: 'Grand Hotel Saigon',
    name: 'Suite',
    description: 'Luxury suite with separate living area',
    maxAdults: 4,
    maxChildren: 2,
    basePrice: 5000000,
    bedType: 'King Bed + Sofa Bed',
    amenities: ['1', '2', '3', '4', '5'],
    photos: ['/suite1.jpg', '/suite1_living.jpg'],
    totalRooms: 5,
    capacity: 6,
    bedConfiguration: 'King Bed + Sofa Bed',
    size: 65,
    status: 'active',
    amenityIds: ['1', '2', '3', '4', '5']
  },
  {
    id: '4',
    propertyId: '2',
    propertyName: 'Ocean Resort Da Nang',
    name: 'Ocean View Room',
    description: 'Beautiful ocean view with balcony',
    maxAdults: 2,
    maxChildren: 1,
    basePrice: 3000000,
    bedType: 'Double Bed',
    amenities: ['1', '2', '3', '4', '5'],
    photos: ['/oceanview1.jpg', '/oceanview1_balcony.jpg'],
    totalRooms: 25,
    capacity: 3,
    bedConfiguration: 'Double Bed',
    size: 30,
    status: 'active',
    amenityIds: ['1', '2', '3', '4', '5']
  },
  {
    id: '5',
    propertyId: '2',
    propertyName: 'Ocean Resort Da Nang',
    name: 'Villa',
    description: 'Private villa with pool access',
    maxAdults: 6,
    maxChildren: 4,
    basePrice: 8000000,
    bedType: '2 King Beds',
    amenities: ['1', '2', '3', '4', '5'],
    photos: ['/villa1.jpg', '/villa1_pool.jpg'],
    totalRooms: 10,
    capacity: 10,
    bedConfiguration: '2 King Beds',
    size: 100,
    status: 'active',
    amenityIds: ['1', '2', '3', '4', '5']
  }
];

// Mock Rooms
export const mockRooms: Room[] = [
  // Grand Hotel Saigon - Standard Rooms
  { id: '101', propertyId: '1', propertyName: 'Grand Hotel Saigon', roomTypeId: '1', roomTypeName: 'Standard Room', number: '101', floor: '1', viewType: 'City View', operationalStatus: 'available', housekeepingStatus: 'clean', notes: 'Recently renovated' },
  { id: '102', propertyId: '1', propertyName: 'Grand Hotel Saigon', roomTypeId: '1', roomTypeName: 'Standard Room', number: '102', floor: '1', viewType: 'City View', operationalStatus: 'available', housekeepingStatus: 'dirty', notes: 'Checkout completed' },
  { id: '103', propertyId: '1', propertyName: 'Grand Hotel Saigon', roomTypeId: '1', roomTypeName: 'Standard Room', number: '103', floor: '1', viewType: 'City View', operationalStatus: 'out_of_service', housekeepingStatus: 'clean', housekeeperNotes: 'AC maintenance required', notes: 'Under maintenance' },
  
  // Grand Hotel Saigon - Deluxe Rooms
  { id: '201', propertyId: '1', propertyName: 'Grand Hotel Saigon', roomTypeId: '2', roomTypeName: 'Deluxe Room', number: '201', floor: '2', viewType: 'Garden View', operationalStatus: 'available', housekeepingStatus: 'clean', notes: 'Premium location' },
  { id: '202', propertyId: '1', propertyName: 'Grand Hotel Saigon', roomTypeId: '2', roomTypeName: 'Deluxe Room', number: '202', floor: '2', viewType: 'Garden View', operationalStatus: 'available', housekeepingStatus: 'inspected', notes: 'Ready for check-in' },
  
  // Grand Hotel Saigon - Suites
  { id: '301', propertyId: '1', propertyName: 'Grand Hotel Saigon', roomTypeId: '3', roomTypeName: 'Suite', number: '301', floor: '3', viewType: 'City View', operationalStatus: 'available', housekeepingStatus: 'clean', notes: 'VIP suite with balcony' },
  
  // Ocean Resort Da Nang - Ocean View Rooms
  { id: '401', propertyId: '2', propertyName: 'Ocean Resort Da Nang', roomTypeId: '4', roomTypeName: 'Ocean View Room', number: '401', floor: '4', viewType: 'Ocean View', operationalStatus: 'available', housekeepingStatus: 'clean', notes: 'Best ocean view' },
  { id: '402', propertyId: '2', propertyName: 'Ocean Resort Da Nang', roomTypeId: '4', roomTypeName: 'Ocean View Room', number: '402', floor: '4', viewType: 'Ocean View', operationalStatus: 'available', housekeepingStatus: 'dirty', notes: 'Checkout at 11 AM' },
  
  // Ocean Resort Da Nang - Villas
  { id: 'V01', propertyId: '2', propertyName: 'Ocean Resort Da Nang', roomTypeId: '5', roomTypeName: 'Villa', number: 'V01', floor: 'Ground', viewType: 'Pool View', operationalStatus: 'available', housekeepingStatus: 'clean', notes: 'Private pool villa' },
  { id: 'V02', propertyId: '2', propertyName: 'Ocean Resort Da Nang', roomTypeId: '5', roomTypeName: 'Villa', number: 'V02', floor: 'Ground', viewType: 'Ocean View', operationalStatus: 'out_of_service', housekeepingStatus: 'clean', housekeeperNotes: 'Pool maintenance', notes: 'Pool under maintenance' }
];

// Mock Photos
export const mockPhotos: Photo[] = [
  { id: 'p1', roomTypeId: '1', url: '/images/standard-room-1.jpg', caption: 'Standard Room - Main View' },
  { id: 'p2', roomTypeId: '1', url: '/images/standard-room-bath.jpg', caption: 'Standard Room - Bathroom' },
  { id: 'p3', roomTypeId: '2', url: '/images/deluxe-room-1.jpg', caption: 'Deluxe Room - Main View' },
  { id: 'p4', roomTypeId: '2', url: '/images/deluxe-room-bath.jpg', caption: 'Deluxe Room - Bathroom' },
  { id: 'p5', roomTypeId: '3', url: '/images/suite-living.jpg', caption: 'Suite - Living Area' },
  { id: 'p6', roomTypeId: '3', url: '/images/suite-bedroom.jpg', caption: 'Suite - Bedroom' },
  { id: 'p7', roomTypeId: '4', url: '/images/ocean-view-main.jpg', caption: 'Ocean View Room - Main' },
  { id: 'p8', roomTypeId: '4', url: '/images/ocean-view-balcony.jpg', caption: 'Ocean View Room - Balcony' },
  { id: 'p9', roomTypeId: '5', url: '/images/villa-exterior.jpg', caption: 'Villa - Exterior' },
  { id: 'p10', roomTypeId: '5', url: '/images/villa-pool.jpg', caption: 'Villa - Private Pool' }
];

// Mock Room Status History
export const mockRoomStatusHistory: RoomStatusHistory[] = [
  {
    id: 'h1',
    roomId: '101',
    statusType: 'housekeeping',
    status: 'clean',
    changedAt: new Date('2024-01-15T10:30:00'),
    changedBy: 'emp1',
    changedByName: 'Maria Santos',
    notes: 'Room cleaned and inspected'
  },
  {
    id: 'h2',
    roomId: '102',
    statusType: 'housekeeping',
    status: 'dirty',
    changedAt: new Date('2024-01-15T11:45:00'),
    changedBy: 'emp2',
    changedByName: 'John Smith',
    notes: 'Guest checked out, needs cleaning'
  },
  {
    id: 'h3',
    roomId: '103',
    statusType: 'operational',
    status: 'out_of_service',
    changedAt: new Date('2024-01-14T14:20:00'),
    changedBy: 'emp3',
    changedByName: 'David Johnson',
    notes: 'AC maintenance required, room temporarily out of service'
  },
  {
    id: 'h4',
    roomId: '201',
    statusType: 'housekeeping',
    status: 'clean',
    changedAt: new Date('2024-01-15T09:15:00'),
    changedBy: 'emp1',
    changedByName: 'Maria Santos',
    notes: 'Deep cleaning completed'
  },
  {
    id: 'h5',
    roomId: 'V02',
    statusType: 'operational',
    status: 'out_of_service',
    changedAt: new Date('2024-01-13T16:00:00'),
    changedBy: 'emp4',
    changedByName: 'Lisa Chen',
    notes: 'Pool maintenance in progress'
  }
];

// Utility functions
export const getMockProperties = (): Property[] => {
  return mockProperties;
};

export const getMockProperty = (id: string): Property | undefined => {
  return mockProperties.find(prop => prop.id === id);
};

export const getMockAmenities = (): Amenity[] => {
  return mockAmenities;
};

export const getMockAmenity = (id: string): Amenity | undefined => {
  return mockAmenities.find(amenity => amenity.id === id);
};

export const getMockRoomTypes = (): RoomType[] => {
  return mockRoomTypes;
};

export const getMockRoomType = (id: string): RoomType | undefined => {
  return mockRoomTypes.find(roomType => roomType.id === id);
};

export const getMockRoomTypesByProperty = (propertyId: string): RoomType[] => {
  return mockRoomTypes.filter(roomType => roomType.propertyId === propertyId);
};

export const getMockRooms = (): Room[] => {
  return mockRooms;
};

export const getMockRoom = (id: string): Room | undefined => {
  return mockRooms.find(room => room.id === id);
};

export const getMockRoomsByProperty = (propertyId: string): Room[] => {
  return mockRooms.filter(room => room.propertyId === propertyId);
};

export const getMockRoomsByRoomType = (roomTypeId: string): Room[] => {
  return mockRooms.filter(room => room.roomTypeId === roomTypeId);
};

export const addMockRoomType = (roomType: Omit<RoomType, 'id'>): RoomType => {
  const newRoomType: RoomType = {
    ...roomType,
    id: (mockRoomTypes.length + 1).toString()
  };
  mockRoomTypes.push(newRoomType);
  return newRoomType;
};

export const updateMockRoomType = (
  id: string,
  data: Partial<RoomType>
): RoomType | null => {
  const index = mockRoomTypes.findIndex(roomType => roomType.id === id);
  if (index !== -1) {
    mockRoomTypes[index] = { ...mockRoomTypes[index], ...data };
    return mockRoomTypes[index];
  }
  return null;
};

export const deleteMockRoomType = (id: string): boolean => {
  const index = mockRoomTypes.findIndex(roomType => roomType.id === id);
  if (index !== -1) {
    mockRoomTypes.splice(index, 1);
    return true;
  }
  return false;
};

export const addMockRoom = (room: Omit<Room, 'id'>): Room => {
  const newRoom: Room = {
    ...room,
    id: (mockRooms.length + 1).toString()
  };
  mockRooms.push(newRoom);
  return newRoom;
};

export const updateMockRoom = (
  id: string,
  data: Partial<Room>
): Room | null => {
  const index = mockRooms.findIndex(room => room.id === id);
  if (index !== -1) {
    mockRooms[index] = { ...mockRooms[index], ...data };
    return mockRooms[index];
  }
  return null;
};

export const deleteMockRoom = (id: string): boolean => {
  const index = mockRooms.findIndex(room => room.id === id);
  if (index !== -1) {
    mockRooms.splice(index, 1);
    return true;
  }
  return false;
};

export const addMockAmenity = (amenity: Omit<Amenity, 'id'>): Amenity => {
  const newAmenity: Amenity = {
    ...amenity,
    id: (mockAmenities.length + 1).toString()
  };
  mockAmenities.push(newAmenity);
  return newAmenity;
};

export const updateMockAmenity = (
  id: string,
  data: Partial<Amenity>
): Amenity | null => {
  const index = mockAmenities.findIndex(amenity => amenity.id === id);
  if (index !== -1) {
    mockAmenities[index] = { ...mockAmenities[index], ...data };
    return mockAmenities[index];
  }
  return null;
};

export const deleteMockAmenity = (id: string): boolean => {
  const index = mockAmenities.findIndex(amenity => amenity.id === id);
  if (index !== -1) {
    mockAmenities.splice(index, 1);
    return true;
  }
  return false;
};

// Photos utility functions
export const getMockPhotos = (): Photo[] => {
  return mockPhotos;
};

export const getMockPhotosByRoomType = (roomTypeId: string): Photo[] => {
  return mockPhotos.filter(photo => photo.roomTypeId === roomTypeId);
};

export const addMockPhoto = (photo: Omit<Photo, 'id'>): Photo => {
  const newPhoto: Photo = {
    ...photo,
    id: `p${mockPhotos.length + 1}`
  };
  mockPhotos.push(newPhoto);
  return newPhoto;
};

export const deleteMockPhoto = (id: string): boolean => {
  const index = mockPhotos.findIndex(photo => photo.id === id);
  if (index !== -1) {
    mockPhotos.splice(index, 1);
    return true;
  }
  return false;
};

// Room Status History utility functions
export const getMockRoomStatusHistory = (): RoomStatusHistory[] => {
  return mockRoomStatusHistory;
};

export const getMockRoomStatusHistoryByRoom = (roomId: string): RoomStatusHistory[] => {
  return mockRoomStatusHistory
    .filter(history => history.roomId === roomId)
    .sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
};

export const addMockRoomStatusHistory = (history: Omit<RoomStatusHistory, 'id' | 'changedAt'>): RoomStatusHistory => {
  const newHistory: RoomStatusHistory = {
    ...history,
    id: `h${mockRoomStatusHistory.length + 1}`,
    changedAt: new Date()
  };
  mockRoomStatusHistory.push(newHistory);
  return newHistory;
};

// Enhanced room status change with history tracking
export const updateRoomStatus = (
  roomId: string,
  statusType: 'operational' | 'housekeeping',
  newStatus: string,
  changedBy?: string,
  changedByName?: string,
  notes?: string
): Room | null => {
  const room = getMockRoom(roomId);
  if (!room) return null;

  // Update room status
  if (statusType === 'operational') {
    room.operationalStatus = newStatus as 'available' | 'out_of_service';
  } else {
    room.housekeepingStatus = newStatus as 'clean' | 'dirty' | 'inspected';
  }

  // Add to history
  addMockRoomStatusHistory({
    roomId,
    statusType,
    status: newStatus,
    changedBy,
    changedByName,
    notes
  });

  return updateMockRoom(roomId, room);
};
