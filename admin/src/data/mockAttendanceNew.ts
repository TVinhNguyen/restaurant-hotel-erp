// Mock data cho Attendance Management
export interface AttendanceRecord {
  id: string;
  workingShiftId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
}

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    workingShiftId: 'shift-1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '2025-08-28',
    checkIn: '08:00',
    checkOut: '17:30',
    status: 'present'
  },
  {
    id: '2',
    workingShiftId: 'shift-1',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    date: '2025-08-28',
    checkIn: '08:15',
    checkOut: '17:00',
    status: 'late',
    notes: 'Đến muộn 15 phút'
  },
  {
    id: '3',
    workingShiftId: 'shift-1',
    employeeId: '3',
    employeeName: 'Lê Minh Cường',
    date: '2025-08-28',
    checkIn: '08:00',
    checkOut: '12:00',
    status: 'half-day',
    notes: 'Xin nghỉ buổi chiều'
  },
  {
    id: '4',
    workingShiftId: 'shift-2',
    employeeId: '4',
    employeeName: 'Phạm Thị Dưng',
    date: '2025-08-28',
    checkIn: '',
    checkOut: '',
    status: 'absent',
    notes: 'Nghỉ ốm'
  },
  {
    id: '5',
    workingShiftId: 'shift-1',
    employeeId: '5',
    employeeName: 'Hoàng Văn Em',
    date: '2025-08-28',
    checkIn: '07:45',
    checkOut: '18:00',
    status: 'present'
  },
  {
    id: '6',
    workingShiftId: 'shift-3',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '2025-08-27',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present'
  },
  {
    id: '7',
    workingShiftId: 'shift-1',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    date: '2025-08-27',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present'
  }
];

export function getMockAttendance(): AttendanceRecord[] {
  return mockAttendance;
}

export function getMockAttendanceByDate(date: string): AttendanceRecord[] {
  return mockAttendance.filter(attendance => attendance.date === date);
}

export function getMockAttendanceByEmployee(
  employeeId: string
): AttendanceRecord[] {
  return mockAttendance.filter(
    attendance => attendance.employeeId === employeeId
  );
}

export function addMockAttendance(
  attendance: Omit<AttendanceRecord, 'id'>
): AttendanceRecord {
  const newAttendance: AttendanceRecord = {
    ...attendance,
    id: (mockAttendance.length + 1).toString()
  };
  mockAttendance.push(newAttendance);
  return newAttendance;
}

export function updateMockAttendance(
  id: string,
  updates: Partial<AttendanceRecord>
): AttendanceRecord | null {
  const index = mockAttendance.findIndex(attendance => attendance.id === id);
  if (index !== -1) {
    mockAttendance[index] = { ...mockAttendance[index], ...updates };
    return mockAttendance[index];
  }
  return null;
}

export function deleteMockAttendance(id: string): boolean {
  const index = mockAttendance.findIndex(attendance => attendance.id === id);
  if (index !== -1) {
    mockAttendance.splice(index, 1);
    return true;
  }
  return false;
}
