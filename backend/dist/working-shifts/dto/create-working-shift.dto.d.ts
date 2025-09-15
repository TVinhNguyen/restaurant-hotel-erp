export declare enum ShiftType {
    MORNING = "morning",
    NIGHT = "night",
    OTHER = "other"
}
export declare class CreateWorkingShiftDto {
    propertyId?: string;
    employeeId?: string;
    workingDate?: string;
    startTime?: string;
    endTime?: string;
    shiftType?: ShiftType;
    notes?: string;
    isReassigned?: boolean;
}
