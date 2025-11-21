export interface WorkingShift {
  id: string;
  propertyId?: string;
  propertyName?: string;
  employeeId?: string;
  employeeName?: string;
  workingDate: string;
  startTime: string;
  endTime: string;
  shiftType: 'morning' | 'night' | 'other';
  notes?: string;
  isReassigned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockWorkingShifts: WorkingShift[] = [
  {
    id: '1',
    propertyId: 'prop-001',
    propertyName: 'Grand Hotel Downtown',
    employeeId: 'emp-001',
    employeeName: 'Nguyễn Văn An',
    workingDate: '2025-10-05',
    startTime: '08:00:00',
    endTime: '16:00:00',
    shiftType: 'morning',
    notes: 'Front desk duty',
    isReassigned: false,
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2025-10-01T08:00:00Z'
  },
  {
    id: '2',
    propertyId: 'prop-001',
    propertyName: 'Grand Hotel Downtown',
    employeeId: 'emp-002',
    employeeName: 'Trần Thị Bình',
    workingDate: '2025-10-05',
    startTime: '22:00:00',
    endTime: '06:00:00',
    shiftType: 'night',
    notes: 'Night security',
    isReassigned: false,
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2025-10-01T08:00:00Z'
  },
  {
    id: '3',
    propertyId: 'prop-002',
    propertyName: 'Luxury Resort & Spa',
    employeeId: 'emp-003',
    employeeName: 'Lê Văn Cường',
    workingDate: '2025-10-06',
    startTime: '06:00:00',
    endTime: '14:00:00',
    shiftType: 'morning',
    notes: 'Kitchen prep',
    isReassigned: true,
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2025-10-03T10:00:00Z'
  },
  {
    id: '4',
    propertyId: 'prop-001',
    propertyName: 'Grand Hotel Downtown',
    employeeId: 'emp-004',
    employeeName: 'Phạm Thị Dung',
    workingDate: '2025-10-06',
    startTime: '14:00:00',
    endTime: '22:00:00',
    shiftType: 'other',
    notes: 'Housekeeping afternoon shift',
    isReassigned: false,
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2025-10-01T08:00:00Z'
  },
  {
    id: '5',
    propertyId: 'prop-003',
    propertyName: 'Business Hotel Center',
    employeeId: 'emp-005',
    employeeName: 'Hoàng Văn Em',
    workingDate: '2025-10-07',
    startTime: '08:00:00',
    endTime: '16:00:00',
    shiftType: 'morning',
    notes: 'Concierge service',
    isReassigned: false,
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2025-10-01T08:00:00Z'
  }
];

// Mock functions for API simulation
export const getMockWorkingShifts = (): WorkingShift[] => {
  return mockWorkingShifts;
};

export const getMockWorkingShiftsByEmployee = (
  employeeId: string
): WorkingShift[] => {
  return mockWorkingShifts.filter(shift => shift.employeeId === employeeId);
};

export const getMockWorkingShiftsByDate = (date: string): WorkingShift[] => {
  return mockWorkingShifts.filter(shift => shift.workingDate === date);
};

export const getMockWorkingShiftById = (
  id: string
): WorkingShift | undefined => {
  return mockWorkingShifts.find(shift => shift.id === id);
};

export const addMockWorkingShift = (
  shift: Omit<WorkingShift, 'id' | 'createdAt' | 'updatedAt'>
): WorkingShift => {
  const newShift: WorkingShift = {
    ...shift,
    id: (mockWorkingShifts.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockWorkingShifts.push(newShift);
  return newShift;
};

export const updateMockWorkingShift = (
  id: string,
  data: Partial<WorkingShift>
): WorkingShift | null => {
  const index = mockWorkingShifts.findIndex(shift => shift.id === id);
  if (index !== -1) {
    mockWorkingShifts[index] = {
      ...mockWorkingShifts[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockWorkingShifts[index];
  }
  return null;
};

export const deleteMockWorkingShift = (id: string): boolean => {
  const index = mockWorkingShifts.findIndex(shift => shift.id === id);
  if (index !== -1) {
    mockWorkingShifts.splice(index, 1);
    return true;
  }
  return false;
};
