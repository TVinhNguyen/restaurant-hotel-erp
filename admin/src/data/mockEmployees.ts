// Mock data cho HR Management
export interface Employee {
  userId?: string;
  employeeCode?: string;
  id: string;
  title?: string;
  fullName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  salary?: number;
  status: 'active' | 'inactive';
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    title: 'Senior Developer',
    fullName: 'Nguyễn Văn An',
    position: 'Senior Developer',
    department: 'IT Department',
    email: 'an.nguyen@company.com',
    phone: '0901234567',
    hireDate: '2023-01-15',
    salary: 25000000,
    status: 'active'
  },
  {
    id: '2',
    title: 'HR Manager',
    fullName: 'Trần Thị Bình',
    position: 'HR Manager',
    department: 'Human Resources',
    email: 'binh.tran@company.com',
    phone: '0902345678',
    hireDate: '2022-06-01',
    salary: 30000000,
    status: 'active'
  },
  {
    id: '3',
    title: 'Marketing Specialist',
    fullName: 'Lê Minh Cường',
    position: 'Marketing Specialist',
    department: 'Marketing',
    email: 'cuong.le@company.com',
    phone: '0903456789',
    hireDate: '2023-03-20',
    salary: 18000000,
    status: 'active'
  },
  {
    id: '4',
    title: 'Accountant',
    fullName: 'Phạm Thu Dung',
    position: 'Accountant',
    department: 'Finance',
    email: 'dung.pham@company.com',
    phone: '0904567890',
    hireDate: '2022-11-10',
    salary: 20000000,
    status: 'inactive'
  },
  {
    id: '5',
    title: 'Sales Executive',
    fullName: 'Hoàng Văn Em',
    position: 'Sales Executive',
    department: 'Sales',
    email: 'em.hoang@company.com',
    phone: '0905678901',
    hireDate: '2023-05-05',
    salary: 16000000,
    status: 'active'
  }
];

// Utility functions để làm việc với mock data
export const getMockEmployee = (id: string): Employee | undefined => {
  return mockEmployees.find(emp => emp.id === id);
};

export const getMockEmployees = (): Employee[] => {
  return mockEmployees;
};

export const addMockEmployee = (employee: Omit<Employee, 'id'>): Employee => {
  const newEmployee: Employee = {
    ...employee,
    id: (mockEmployees.length + 1).toString()
  };
  mockEmployees.push(newEmployee);
  return newEmployee;
};

export const updateMockEmployee = (
  id: string,
  data: Partial<Employee>
): Employee | null => {
  const index = mockEmployees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    mockEmployees[index] = { ...mockEmployees[index], ...data };
    return mockEmployees[index];
  }
  return null;
};

export const deleteMockEmployee = (id: string): boolean => {
  const index = mockEmployees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    mockEmployees.splice(index, 1);
    return true;
  }
  return false;
};
