export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    HALF_DAY = "half_day",
    OVERTIME = "overtime"
}
export declare class CreateAttendanceDto {
    employeeId: string;
    workingShiftId?: string;
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
}
export declare class UpdateAttendanceDto {
    workingShiftId?: string;
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
}
export declare class BulkAttendanceDto {
    date: string;
    attendances: Array<{
        employeeId: string;
        status: AttendanceStatus;
        checkInTime?: string;
        checkOutTime?: string;
        notes?: string;
    }>;
}
