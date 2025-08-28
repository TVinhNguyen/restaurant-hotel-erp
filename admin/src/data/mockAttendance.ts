// Mock data cho Attendance Management
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workingHours?: number;
  overtime?: number;
  notes?: string;
}

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '2025-08-28',
    checkIn: '08:00',
    checkOut: '17:30',
    status: 'present',
    workingHours: 8.5,
    overtime: 0.5
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    date: '2025-08-28',
    checkIn: '08:15',
    checkOut: '17:00',
    status: 'late',
    workingHours: 8,
    overtime: 0,
    notes: 'Đến muộn 15 phút'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Lê Minh Cường',
    date: '2025-08-28',
    checkIn: '08:00',
    checkOut: '12:00',
    status: 'half-day',
    workingHours: 4,
    overtime: 0,
    notes: 'Xin nghỉ buổi chiều'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Phạm Thu Dung',
    date: '2025-08-28',
    checkIn: '',
    checkOut: '',
    status: 'absent',
    workingHours: 0,
    overtime: 0,
    notes: 'Nghỉ ốm'
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Hoàng Văn Em',
    date: '2025-08-28',
    checkIn: '07:45',
    checkOut: '18:00',
    status: 'present',
    workingHours: 9,
    overtime: 1
  },
  // Previous day records
  {
    id: '6',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '2025-08-27',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present',
    workingHours: 8,
    overtime: 0
  },
  {
    id: '7',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    date: '2025-08-27',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present',
    workingHours: 8,
    overtime: 0
  }
];

// Leave Management
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'Lê Minh Cường',
    leaveType: 'annual',
    startDate: '2025-09-01',
    endDate: '2025-09-05',
    days: 5,
    reason: 'Nghỉ phép thường niên',
    status: 'pending',
    appliedDate: '2025-08-20'
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    leaveType: 'sick',
    startDate: '2025-08-25',
    endDate: '2025-08-26',
    days: 2,
    reason: 'Bị cảm sốt, cần nghỉ dưỡng bệnh',
    status: 'approved',
    appliedDate: '2025-08-24',
    approvedBy: 'HR Manager',
    approvedDate: '2025-08-24'
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Hoàng Văn Em',
    leaveType: 'personal',
    startDate: '2025-09-10',
    endDate: '2025-09-10',
    days: 1,
    reason: 'Giải quyết việc cá nhân',
    status: 'rejected',
    appliedDate: '2025-08-28',
    approvedBy: 'HR Manager',
    approvedDate: '2025-08-28',
    rejectionReason: 'Không đủ ngày phép còn lại'
  }
];

// Utility functions
export const getMockAttendance = (): AttendanceRecord[] => {
  return mockAttendance;
};

export const getMockAttendanceByDate = (date: string): AttendanceRecord[] => {
  return mockAttendance.filter(record => record.date === date);
};

export const getMockAttendanceByEmployee = (
  employeeId: string
): AttendanceRecord[] => {
  return mockAttendance.filter(record => record.employeeId === employeeId);
};

export const getMockLeaveRequests = (): LeaveRequest[] => {
  return mockLeaveRequests;
};

export const addMockAttendance = (
  record: Omit<AttendanceRecord, 'id'>
): AttendanceRecord => {
  const newRecord: AttendanceRecord = {
    ...record,
    id: (mockAttendance.length + 1).toString()
  };
  mockAttendance.push(newRecord);
  return newRecord;
};

export const updateMockLeaveRequest = (
  id: string,
  data: Partial<LeaveRequest>
): LeaveRequest | null => {
  const index = mockLeaveRequests.findIndex(req => req.id === id);
  if (index !== -1) {
    mockLeaveRequests[index] = { ...mockLeaveRequests[index], ...data };
    return mockLeaveRequests[index];
  }
  return null;
};
