// Mock data cho Payroll Management
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  period: string; // Format: YYYY-MM
  month: string;
  year: number;
  basicSalary: number;
  overtime: number;
  overtimeRate: number;
  overtimePay: number;
  allowances: number;
  deductions: number;
  tax: number;
  socialInsurance: number;
  healthInsurance: number;
  grossPay: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  paidDate?: string;
  workingDays: number;
  totalWorkingDays: number;
}

export const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    position: 'Senior Developer',
    department: 'IT Department',
    period: '2025-08',
    month: '08',
    year: 2025,
    basicSalary: 25000000,
    overtime: 10,
    overtimeRate: 150000,
    overtimePay: 1500000,
    allowances: 2000000,
    deductions: 0,
    tax: 2800000,
    socialInsurance: 2000000,
    healthInsurance: 625000,
    grossPay: 28500000,
    netPay: 23075000,
    status: 'paid',
    paidDate: '2025-08-30',
    workingDays: 22,
    totalWorkingDays: 22
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Trần Thị Bình',
    position: 'HR Manager',
    department: 'Human Resources',
    period: '2025-08',
    month: '08',
    year: 2025,
    basicSalary: 30000000,
    overtime: 5,
    overtimeRate: 180000,
    overtimePay: 900000,
    allowances: 3000000,
    deductions: 500000,
    tax: 3340000,
    socialInsurance: 2400000,
    healthInsurance: 750000,
    grossPay: 33900000,
    netPay: 26910000,
    status: 'processed',
    workingDays: 22,
    totalWorkingDays: 22
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Lê Minh Cường',
    position: 'Marketing Specialist',
    department: 'Marketing',
    period: '2025-08',
    month: '08',
    year: 2025,
    basicSalary: 18000000,
    overtime: 8,
    overtimeRate: 110000,
    overtimePay: 880000,
    allowances: 1500000,
    deductions: 200000,
    tax: 2018000,
    socialInsurance: 1440000,
    healthInsurance: 450000,
    grossPay: 20380000,
    netPay: 16272000,
    status: 'draft',
    workingDays: 21,
    totalWorkingDays: 22
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Phạm Thu Dung',
    position: 'Accountant',
    department: 'Finance',
    period: '2025-08',
    month: '08',
    year: 2025,
    basicSalary: 20000000,
    overtime: 3,
    overtimeRate: 125000,
    overtimePay: 375000,
    allowances: 1000000,
    deductions: 0,
    tax: 2137500,
    socialInsurance: 1600000,
    healthInsurance: 500000,
    grossPay: 21375000,
    netPay: 17137500,
    status: 'processed',
    workingDays: 22,
    totalWorkingDays: 22
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Hoàng Văn Em',
    position: 'Sales Executive',
    department: 'Sales',
    period: '2025-08',
    month: '08',
    year: 2025,
    basicSalary: 16000000,
    overtime: 12,
    overtimeRate: 100000,
    overtimePay: 1200000,
    allowances: 2500000, // Sales commission
    deductions: 100000,
    tax: 1960000,
    socialInsurance: 1280000,
    healthInsurance: 400000,
    grossPay: 19700000,
    netPay: 15960000,
    status: 'draft',
    workingDays: 22,
    totalWorkingDays: 22
  }
];

// Payroll settings
export interface PayrollSettings {
  taxRates: {
    bracket1: { min: number; max: number; rate: number };
    bracket2: { min: number; max: number; rate: number };
    bracket3: { min: number; max: number; rate: number };
  };
  socialInsuranceRate: number;
  healthInsuranceRate: number;
  defaultOvertimeRate: number;
  workingDaysPerMonth: number;
}

export const payrollSettings: PayrollSettings = {
  taxRates: {
    bracket1: { min: 0, max: 11000000, rate: 0.05 },
    bracket2: { min: 11000000, max: 20000000, rate: 0.1 },
    bracket3: { min: 20000000, max: Infinity, rate: 0.15 }
  },
  socialInsuranceRate: 0.08,
  healthInsuranceRate: 0.025,
  defaultOvertimeRate: 1.5,
  workingDaysPerMonth: 22
};

// Utility functions
export const getMockPayrollRecords = (): PayrollRecord[] => {
  return mockPayrollRecords;
};

export const getMockPayrollByMonth = (
  month: string,
  year: number
): PayrollRecord[] => {
  return mockPayrollRecords.filter(
    record => record.month === month && record.year === year
  );
};

export const getMockPayrollByEmployee = (
  employeeId: string
): PayrollRecord[] => {
  return mockPayrollRecords.filter(record => record.employeeId === employeeId);
};

export const calculatePayroll = (
  basicSalary: number,
  overtimeHours: number,
  workingDays: number,
  allowances: number = 0,
  deductions: number = 0
): Partial<PayrollRecord> => {
  const dailySalary = basicSalary / payrollSettings.workingDaysPerMonth;
  const adjustedBasic = dailySalary * workingDays;

  const overtimeRate =
    (basicSalary / payrollSettings.workingDaysPerMonth / 8) *
    payrollSettings.defaultOvertimeRate;
  const overtimePay = overtimeHours * overtimeRate;

  const grossPay = adjustedBasic + overtimePay + allowances - deductions;

  // Calculate tax (simplified)
  let tax = 0;
  if (grossPay > payrollSettings.taxRates.bracket3.min) {
    tax = grossPay * payrollSettings.taxRates.bracket3.rate;
  } else if (grossPay > payrollSettings.taxRates.bracket2.min) {
    tax = grossPay * payrollSettings.taxRates.bracket2.rate;
  } else {
    tax = grossPay * payrollSettings.taxRates.bracket1.rate;
  }

  const socialInsurance = basicSalary * payrollSettings.socialInsuranceRate;
  const healthInsurance = basicSalary * payrollSettings.healthInsuranceRate;

  const netPay = grossPay - tax - socialInsurance - healthInsurance;

  return {
    basicSalary: adjustedBasic,
    overtime: overtimeHours,
    overtimeRate,
    overtimePay,
    allowances,
    deductions,
    tax,
    socialInsurance,
    healthInsurance,
    grossPay,
    netPay,
    workingDays,
    totalWorkingDays: payrollSettings.workingDaysPerMonth
  };
};

export const updateMockPayrollStatus = (
  id: string,
  status: PayrollRecord['status'],
  paidDate?: string
): PayrollRecord | null => {
  const index = mockPayrollRecords.findIndex(record => record.id === id);
  if (index !== -1) {
    mockPayrollRecords[index] = {
      ...mockPayrollRecords[index],
      status,
      ...(paidDate && { paidDate })
    };
    return mockPayrollRecords[index];
  }
  return null;
};
