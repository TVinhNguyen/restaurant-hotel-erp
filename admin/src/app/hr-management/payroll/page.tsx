"use client";

import React, { useEffect, useState } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Select,
    InputNumber,
    message,
    Tag,
    Space,
    Row,
    Col,
    Statistic,
    Typography,
    Popconfirm,
    Tooltip,
    Divider,
    Alert
} from 'antd';
import {
    DollarOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalculatorOutlined,
    PlusOutlined,
    EyeOutlined,
    PrinterOutlined
} from '@ant-design/icons';
import {
    getMockPayrollRecords,
    getMockPayrollByMonth,
    updateMockPayrollStatus,
    calculatePayroll,
    type PayrollRecord
} from '../../../data/mockPayroll';
import { Employee, getMockEmployees } from '../../../data/mockEmployees';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Helper function to format numbers in Vietnamese style (1.000.000)
const formatVND = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function PayrollPage() {
    const [selectedMonth, setSelectedMonth] = useState('08');
    const [selectedYear, setSelectedYear] = useState(2025);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [calculatedPayroll, setCalculatedPayroll] = useState<any>(null);
    // const [payrollRecords, setPayrollRecords] = useState(getMockPayrollRecords());
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);

    const [employees, setEmployees] = useState<Employee[]>([]);
    // Filter payroll records by selected month/year
    const monthlyRecords = payrollRecords.filter(record => {
        const recordPeriod = record.period || `${record.year}-${record.month}`;
        const selectedPeriod = `${selectedYear}-${selectedMonth}`;
        return recordPeriod === selectedPeriod;
    });

    const fetchPayrollRecords = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/payroll/get-all-payrolls`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched payroll records from API:', data);
                // Map backend data to match frontend interface
                const mappedRecords = (data.data || []).map((record: any) => ({
                    ...record,
                    employeeName: record.employee?.fullName || 'Unknown',
                    position: record.employee?.position || '-',
                    department: record.employee?.department || '-',
                    basicSalary: record.basicSalary || 0,
                    overtimePay: record.overtimePay || 0,
                    grossPay: record.grossPay || 0,
                    netPay: record.netSalary || 0,
                    overtime: record.overtimeHours || 0,
                    overtimeRate: record.overtimePay && record.overtimeHours
                        ? record.overtimePay / record.overtimeHours
                        : 0,
                    month: record.period ? record.period.split('-')[1] : selectedMonth,
                    year: record.period ? parseInt(record.period.split('-')[0]) : selectedYear,
                }));
                setPayrollRecords(mappedRecords);
            } else {
                message.error('Failed to fetch payroll records');
            }
        } catch (error) {
            console.error('Error fetching payroll:', error);
            message.error('Error fetching payroll records');
        }
    }

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/employees`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data.data || []);
            } else {
                message.error('Failed to fetch employees');
            }
        } catch (error) {
            message.error('Error fetching employees');
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchPayrollRecords();
    }, [selectedMonth, selectedYear])

    // Auto-fill data when employee is selected
    const handleEmployeeChange = async (employeeId: string) => {
        setLoading(true);
        try {
            const period = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

            // Calculate total days in month
            const year = parseInt(selectedYear.toString());
            const month = parseInt(selectedMonth);
            const totalDaysInMonth = new Date(year, month, 0).getDate();

            // Fetch leave records for the period
            const leaveResponse = await fetch(
                `${API_ENDPOINT}/leaves/by-employee/${employeeId}?period=${period}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            console.log(leaveResponse);
            console.log(period);
            // Fetch overtime hours
            const overtimeResponse = await fetch(
                `${API_ENDPOINT}/overtimes?employeeId=${employeeId}&period=${period}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            let leaveDays = 0;
            let overtimeHours = 0;

            // Calculate total leave days (approved leaves only)
            if (leaveResponse.ok) {
                const leaveData = await leaveResponse.json();
                const leaveRecords = leaveData.data || [];
                leaveDays = leaveRecords
                    .filter((record: any) => record.status === 'approved')
                    .reduce((sum: number, record: any) => sum + (record.numberOfDays || 0), 0);
            }

            // Calculate total overtime hours (approved overtimes only)
            if (overtimeResponse.ok) {
                const overtimeData = await overtimeResponse.json();
                const overtimeRecords = overtimeData.data || [];
                overtimeHours = overtimeRecords
                    .filter((record: any) => record.status === 'approved')
                    .reduce((sum: number, record: any) => sum + (record.hours || 0), 0);
            }

            // Working days = Total days in month - Leave days
            const workingDays = totalDaysInMonth - leaveDays;

            // Update form fields
            form.setFieldsValue({
                workingDays: workingDays,
                overtime: overtimeHours,
            });

            message.success(`Auto-filled: ${workingDays} working days (${totalDaysInMonth} - ${leaveDays} leave days), ${overtimeHours} overtime hours`);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            message.warning('Could not auto-fill data. Please enter manually.');
        } finally {
            setLoading(false);
        }
    };    // Calculate statistics
    const totalPaid = monthlyRecords
        .filter(record => record.status === 'paid')
        .reduce((sum, record) => sum + record.netPay, 0);

    const totalProcessed = monthlyRecords
        .filter(record => record.status === 'processed')
        .reduce((sum, record) => sum + record.netPay, 0);

    const totalDraft = monthlyRecords
        .filter(record => record.status === 'draft')
        .reduce((sum, record) => sum + record.netPay, 0);

    const paidCount = monthlyRecords.filter(record => record.status === 'paid').length;
    const processedCount = monthlyRecords.filter(record => record.status === 'processed').length;
    const draftCount = monthlyRecords.filter(record => record.status === 'draft').length;

    const handleProcessPayroll = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/payroll/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'processed' })
            });

            if (response.ok) {
                message.success('Payroll processed successfully!');
                fetchPayrollRecords();
            } else {
                const error = await response.json();
                message.error(error.message || 'Failed to process payroll');
            }
        } catch (error) {
            console.error('Error processing payroll:', error);
            message.error('Error processing payroll');
        }
    };

    const handlePayPayroll = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/payroll/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'paid',
                    paidDate: dayjs().format('YYYY-MM-DD')
                })
            });

            if (response.ok) {
                message.success('Payroll payment completed!');
                fetchPayrollRecords();
            } else {
                const error = await response.json();
                message.error(error.message || 'Failed to mark as paid');
            }
        } catch (error) {
            console.error('Error paying payroll:', error);
            message.error('Error paying payroll');
        }
    };

    // Auto-calculate preview whenever form values change
    const handleFormValuesChange = () => {
        const values = form.getFieldsValue();
        const employee = employees.find(emp => emp.id === values.employeeId);

        if (!employee || !employee.salary) {
            setCalculatedPayroll(null);
            return;
        }

        // Get form values
        const basicSalary = employee.salary;
        const workingDays = values.workingDays || 22;
        const totalWorkingDays = 22;
        const overtimeHours = values.overtime || 0;
        const allowances = values.allowances || 0;
        const otherDeductions = values.otherDeductions || 0;
        const bonus = values.bonus || 0;

        // Calculate overtime pay
        const dailySalary = basicSalary / totalWorkingDays;
        const hourlyRate = dailySalary / 8;
        const overtimePay = overtimeHours * hourlyRate * 1.5;

        // Calculate gross pay
        const actualBasicSalary = (basicSalary * workingDays / totalWorkingDays);
        const grossPay = actualBasicSalary + overtimePay + allowances + bonus;

        // Calculate deductions
        const tax = grossPay > 11000000 ? grossPay * 0.1 : 0;
        const socialInsurance = basicSalary * 0.08;
        const healthInsurance = basicSalary * 0.015;
        const totalDeductionsCalc = tax + socialInsurance + healthInsurance + otherDeductions;

        // Calculate net salary
        const netSalary = grossPay - totalDeductionsCalc;

        setCalculatedPayroll({
            employee: employee,
            basicSalary: basicSalary,
            workingDays: workingDays,
            totalWorkingDays: totalWorkingDays,
            actualBasicSalary: actualBasicSalary,
            overtimeHours: overtimeHours,
            hourlyRate: hourlyRate,
            overtimePay: overtimePay,
            allowances: allowances,
            bonus: bonus,
            grossPay: grossPay,
            tax: tax,
            socialInsurance: socialInsurance,
            healthInsurance: healthInsurance,
            otherDeductions: otherDeductions,
            totalDeductions: totalDeductionsCalc,
            netSalary: netSalary
        });
    };

    const handleCalculatePayroll = async (values: any) => {
        try {
            const employee = employees.find(emp => emp.id === values.employeeId);
            if (!employee) {
                message.error('Employee not found');
                return;
            }

            if (!employee.salary || employee.salary === 0) {
                message.error('Employee salary is not set. Please update employee information first.');
                return;
            }

            // Create period in YYYY-MM format
            const period = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

            // Get form values
            const basicSalary = employee.salary;
            const workingDays = values.workingDays || 22;
            const totalWorkingDays = 22;
            const overtimeHours = values.overtime || 0;
            const allowances = values.allowances || 0;
            const totalDeductions = values.deductions || 0;
            const bonus = values.bonus || 0;

            // Calculate overtime pay (hourly rate * 1.5)
            const dailySalary = basicSalary / totalWorkingDays;
            const hourlyRate = dailySalary / 8;
            const overtimePay = overtimeHours * hourlyRate * 1.5;

            // Calculate gross pay
            const grossPay = (basicSalary * workingDays / totalWorkingDays) + overtimePay + allowances + bonus;

            // Calculate tax (10% if gross > 11M VND)
            const tax = grossPay > 11000000 ? grossPay * 0.1 : 0;

            // Calculate insurance
            const socialInsurance = basicSalary * 0.08;
            const healthInsurance = basicSalary * 0.015;

            // Calculate net salary
            const netSalary = grossPay - tax - socialInsurance - healthInsurance - totalDeductions;

            // Prepare payload matching CreatePayrollDto
            const payrollData = {
                employeeId: values.employeeId,
                period: period,
                basicSalary: basicSalary,
                workingDays: workingDays,
                totalWorkingDays: totalWorkingDays,
                overtimePay: overtimePay,
                allowances: allowances,
                bonus: bonus,
                grossPay: grossPay,
                tax: tax,
                socialInsurance: socialInsurance,
                healthInsurance: healthInsurance,
                totalDeductions: totalDeductions,
                netSalary: netSalary,
                status: 'draft',
                currency: 'VND'
            };

            console.log('Creating payroll with data:', payrollData);

            const response = await fetch(`${API_ENDPOINT}/payroll`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payrollData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Payroll created:', result);
                message.success('Payroll calculated and saved successfully!');
                fetchPayrollRecords(); // Refresh data from API
                setIsModalVisible(false);
                form.resetFields();
            } else {
                const error = await response.json();
                console.error('API error:', error);
                message.error(error.message || 'Failed to create payroll');
            }
        } catch (error) {
            console.error('Error creating payroll:', error);
            message.error('Error creating payroll');
        }
    };

    const showPayrollDetail = (record: PayrollRecord) => {
        setSelectedRecord(record);
        setIsDetailModalVisible(true);
    };

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employeeName',
            key: 'employeeName',
            render: (name: string, record: PayrollRecord) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{record.position}</div>
                </div>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Basic Salary',
            dataIndex: 'basicSalary',
            key: 'basicSalary',
            render: (amount: number) => `${formatVND(amount)} VNĐ`,
            sorter: (a: PayrollRecord, b: PayrollRecord) => a.basicSalary - b.basicSalary,
        },
        {
            title: 'Overtime',
            dataIndex: 'overtime',
            key: 'overtime',
            render: (hours: number, record: PayrollRecord) => (
                <div>
                    <div>{hours}h</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        +{formatVND(record.overtimePay)} VNĐ
                    </div>
                </div>
            ),
        },
        {
            title: 'Gross Pay',
            dataIndex: 'grossPay',
            key: 'grossPay',
            render: (amount: number) => (
                <Text strong style={{ color: '#1890ff' }}>
                    {formatVND(amount)} VNĐ
                </Text>
            ),
            sorter: (a: PayrollRecord, b: PayrollRecord) => a.grossPay - b.grossPay,
        },
        {
            title: 'Deductions',
            key: 'deductions',
            render: (_: any, record: PayrollRecord) => {
                const totalDeductions =
                    Number(record?.tax ?? 0) +
                    Number(record?.socialInsurance ?? 0) +
                    Number(record?.healthInsurance ?? 0) +
                    Number(record?.deductions ?? 0);
                return (
                    <Tooltip title={`Tax: ${formatVND(record?.tax)} | Social Insurance: ${formatVND(record?.socialInsurance)} | Health Insurance: ${formatVND(record?.healthInsurance)} | Other: ${formatVND(record?.deductions)}`}>
                        <Text style={{ color: '#ff4d4f' }}>
                            -{formatVND(totalDeductions)} VNĐ
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Net Pay',
            dataIndex: 'netPay',
            key: 'netPay',
            render: (amount: number) => (
                <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                    {formatVND(amount)} VNĐ
                </Text>
            ),
            sorter: (a: PayrollRecord, b: PayrollRecord) => a.netPay - b.netPay,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: PayrollRecord) => {
                const statusConfig = {
                    draft: { color: 'default', text: 'Draft' },
                    processed: { color: 'processing', text: 'Processed' },
                    paid: { color: 'success', text: 'Paid' },
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return (
                    <div>
                        <Tag color={config.color}>{config.text}</Tag>
                        {record.paidDate && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Paid: {dayjs(record.paidDate).format('DD/MM/YYYY')}
                            </div>
                        )}
                    </div>
                );
            },
            filters: [
                { text: 'Draft', value: 'draft' },
                { text: 'Processed', value: 'processed' },
                { text: 'Paid', value: 'paid' },
            ],
            onFilter: (value: any, record: PayrollRecord) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: PayrollRecord) => (
                <Space direction="vertical" size="small">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => showPayrollDetail(record)}
                    >
                        Details
                    </Button>
                    {record.status === 'draft' && (
                        <Popconfirm
                            title="Process this payroll?"
                            onConfirm={() => handleProcessPayroll(record.id)}
                        >
                            <Button
                                size="small"
                                type="primary"
                                icon={<CheckCircleOutlined />}
                            >
                                Process
                            </Button>
                        </Popconfirm>
                    )}
                    {record.status === 'processed' && (
                        <Popconfirm
                            title="Mark as paid?"
                            onConfirm={() => handlePayPayroll(record.id)}
                        >
                            <Button
                                size="small"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                                icon={<DollarOutlined />}
                            >
                                Pay
                            </Button>
                        </Popconfirm>
                    )}
                    {record.status === 'paid' && (
                        <Button
                            size="small"
                            icon={<PrinterOutlined />}
                            onClick={() => message.info('Payslip printing feature will be implemented')}
                        >
                            Print
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Payroll Management</Title>

            {/* Month/Year Selector and Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} md={6}>
                    <Card>
                        <div style={{ marginBottom: '16px' }}>
                            <Text>Select Period:</Text>
                        </div>
                        <Space>
                            <Select
                                value={selectedMonth}
                                onChange={setSelectedMonth}
                                style={{ width: 80 }}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <Select.Option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {dayjs().month(i).format('MMM')}
                                    </Select.Option>
                                ))}
                            </Select>
                            <Select
                                value={selectedYear}
                                onChange={setSelectedYear}
                                style={{ width: 100 }}
                            >
                                <Select.Option value={2025}>2025</Select.Option>
                                <Select.Option value={2024}>2024</Select.Option>
                            </Select>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={18}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Card>
                                <Statistic
                                    title={`Paid (${paidCount})`}
                                    value={totalPaid}
                                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                    formatter={value => `${formatVND(Number(value))} VNĐ`}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card>
                                <Statistic
                                    title={`Processed (${processedCount})`}
                                    value={totalProcessed}
                                    prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                                    formatter={value => `${formatVND(Number(value))} VNĐ`}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card>
                                <Statistic
                                    title={`Draft (${draftCount})`}
                                    value={totalDraft}
                                    prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
                                    formatter={value => `${formatVND(Number(value))} VNĐ`}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Action Button */}
            <Card style={{ marginBottom: '24px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            Payroll Records - {dayjs().month(parseInt(selectedMonth) - 1).format('MMMM')} {selectedYear}
                        </Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<CalculatorOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Calculate Payroll
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Payroll Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={monthlyRecords}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Calculate Payroll Modal */}
            <Modal
                title="Calculate Employee Payroll"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCalculatedPayroll(null);
                    form.resetFields();
                }}
                footer={null}
                width={1200}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleCalculatePayroll}
                            onValuesChange={handleFormValuesChange}
                        >
                            <Form.Item
                                label="Employee"
                                name="employeeId"
                                rules={[{ required: true, message: 'Please select an employee!' }]}
                            >
                                <Select
                                    placeholder="Select employee"
                                    onChange={handleEmployeeChange}
                                    loading={loading}
                                >
                                    {employees.filter(emp => emp.status === 'active').map(employee => (
                                        <Select.Option key={employee.id} value={employee.id}>
                                            {employee.fullName} - {employee.position} ({formatVND(employee?.salary)} VNĐ/month)
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Working Days"
                                        name="workingDays"
                                        initialValue={22}
                                        rules={[{ required: true, message: 'Please enter working days!' }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={31}
                                            style={{ width: '100%' }}
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Overtime Hours"
                                        name="overtime"
                                        initialValue={0}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={200}
                                            style={{ width: '100%' }}
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Allowances (VNĐ)"
                                        name="allowances"
                                        initialValue={0}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as any}
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Bonus (VNĐ)"
                                        name="bonus"
                                        initialValue={0}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as any}
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Other Deductions (VNĐ)"
                                        name="otherDeductions"
                                        initialValue={0}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as any}
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Alert
                                message="Working days and overtime hours are automatically calculated from attendance and overtime records."
                                type="info"
                                style={{ marginBottom: '16px' }}
                            />

                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Space>
                                    <Button onClick={() => {
                                        setIsModalVisible(false);
                                        setCalculatedPayroll(null);
                                        form.resetFields();
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" disabled={!calculatedPayroll}>
                                        Calculate & Save
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col span={12}>
                        {calculatedPayroll && (
                            <Card size="small" style={{ height: '100%', backgroundColor: '#f5f5f5' }}>
                                <Title level={5}>Calculation Preview</Title>
                                <Divider style={{ margin: '12px 0' }} />

                                <div style={{ marginBottom: '12px' }}>
                                    <Text strong>Earnings</Text>
                                    <div style={{ marginLeft: '16px', marginTop: '8px' }}>
                                        <div>Basic Salary: <Text strong>{formatVND(calculatedPayroll.basicSalary)} VNĐ</Text></div>
                                        <div>× Working Days: <Text strong>{calculatedPayroll.workingDays}/{calculatedPayroll.totalWorkingDays} days</Text></div>
                                        <div>= Actual Basic: <Text strong>{formatVND(calculatedPayroll.actualBasicSalary)} VNĐ</Text></div>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div>Overtime: <Text strong>{calculatedPayroll.overtimeHours} hours × {formatVND(calculatedPayroll.hourlyRate)} VNĐ/h × 1.5</Text></div>
                                        <div>= Overtime Pay: <Text strong>{formatVND(calculatedPayroll.overtimePay)} VNĐ</Text></div>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div>Allowances: <Text strong>{formatVND(calculatedPayroll.allowances)} VNĐ</Text></div>
                                        <div>Bonus: <Text strong>{formatVND(calculatedPayroll.bonus)} VNĐ</Text></div>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div style={{ fontSize: '16px' }}>
                                            <Text strong style={{ color: '#1890ff' }}>Gross Pay: {formatVND(calculatedPayroll.grossPay)} VNĐ</Text>
                                        </div>
                                    </div>
                                </div>

                                <Divider style={{ margin: '12px 0' }} />

                                <div style={{ marginBottom: '12px' }}>
                                    <Text strong>Deductions</Text>
                                    <div style={{ marginLeft: '16px', marginTop: '8px' }}>
                                        <div>Income Tax (10%): <Text strong>{formatVND(calculatedPayroll.tax)} VNĐ</Text></div>
                                        <div>Social Insurance (8%): <Text strong>{formatVND(calculatedPayroll.socialInsurance)} VNĐ</Text></div>
                                        <div>Health Insurance (1.5%): <Text strong>{formatVND(calculatedPayroll.healthInsurance)} VNĐ</Text></div>
                                        <div>Other Deductions: <Text strong>{formatVND(calculatedPayroll.otherDeductions)} VNĐ</Text></div>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div style={{ fontSize: '16px' }}>
                                            <Text strong style={{ color: '#ff4d4f' }}>Total Deductions: {formatVND(calculatedPayroll.totalDeductions)} VNĐ</Text>
                                        </div>
                                    </div>
                                </div>

                                <Divider style={{ margin: '12px 0' }} />

                                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '4px' }}>
                                    <Text type="secondary">Net Salary</Text>
                                    <div style={{ fontSize: '24px', marginTop: '8px' }}>
                                        <Text strong style={{ color: '#52c41a' }}>{formatVND(calculatedPayroll.netSalary)} VNĐ</Text>
                                    </div>
                                </div>
                            </Card>
                        )}
                        {!calculatedPayroll && (
                            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                                <div style={{ textAlign: 'center', color: '#999' }}>
                                    <CalculatorOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                    <div>Select an employee and fill in the details to see calculation preview</div>
                                </div>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Modal>

            {/* Payroll Detail Modal */}
            <Modal
                title="Payroll Details"
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                width={700}
            >
                {selectedRecord && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small" title="Employee Information">
                                    <Row gutter={16}>
                                        <Col span={8}><Text strong>Name:</Text> {selectedRecord.employeeName}</Col>
                                        <Col span={8}><Text strong>Position:</Text> {selectedRecord.position}</Col>
                                        <Col span={8}><Text strong>Department:</Text> {selectedRecord.department}</Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                        <Divider />

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card size="small" title="Earnings">
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Basic Salary: <Text strong>{formatVND(selectedRecord.basicSalary)} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Overtime Pay: <Text strong>{formatVND(selectedRecord.overtimePay)} VNĐ</Text></Text>
                                        <Text type="secondary"> ({selectedRecord.overtime}h × {formatVND(selectedRecord.overtimeRate)})</Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Allowances: <Text strong>{formatVND(selectedRecord.allowances)} VNĐ</Text></Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div>
                                        <Text strong>Gross Pay: <Text style={{ color: '#1890ff' }}>{formatVND(selectedRecord.grossPay)} VNĐ</Text></Text>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Deductions">
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Income Tax: <Text strong>{formatVND(selectedRecord?.tax)} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Social Insurance: <Text strong>{formatVND(selectedRecord?.socialInsurance)} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Health Insurance: <Text strong>{formatVND(selectedRecord?.healthInsurance)} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Other Deductions: <Text strong>{formatVND(selectedRecord?.deductions)} VNĐ</Text></Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div>
                                        <Text strong>Total Deductions: <Text style={{ color: '#ff4d4f' }}>
                                            {formatVND(selectedRecord.tax + selectedRecord.socialInsurance + selectedRecord.healthInsurance + (selectedRecord.deductions || 0))} VNĐ
                                        </Text></Text>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Divider />

                        <Card size="small">
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Title level={4} style={{ margin: 0 }}>Net Pay:</Title>
                                </Col>
                                <Col>
                                    <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                                        {formatVND(selectedRecord.netPay)} VNĐ
                                    </Title>
                                </Col>
                            </Row>
                        </Card>

                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Space>
                                <Text type="secondary">Working Days: {selectedRecord.workingDays}/{selectedRecord.totalWorkingDays}</Text>
                                <Divider type="vertical" />
                                <Text type="secondary">Period: {dayjs().month(parseInt(selectedRecord.month) - 1).format('MMMM')} {selectedRecord.year}</Text>
                            </Space>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
