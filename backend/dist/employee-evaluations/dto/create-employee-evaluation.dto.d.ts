export declare enum EvaluationPeriod {
    QUARTERLY = "quarterly",
    ANNUAL = "annual"
}
export declare class CreateEmployeeEvaluationDto {
    employeeId?: string;
    evaluatedBy?: string;
    rate?: number;
    period?: EvaluationPeriod;
    goals?: string;
    strength?: string;
    improvement?: string;
    comments?: string;
}
