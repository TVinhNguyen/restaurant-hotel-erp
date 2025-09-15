export declare enum DeductionType {
    TAX = "tax",
    INSURANCE = "insurance",
    OTHER = "other"
}
export declare class CreateDeductionDto {
    employeeId?: string;
    leaveId?: string;
    type?: DeductionType;
    amount?: number;
    date?: string;
    reasonDetails?: string;
}
