"use client";

import React, { useState } from 'react';
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
import { getMockEmployees } from '../../../data/mockEmployees';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function PayrollPage() {
    const [selectedMonth, setSelectedMonth] = useState('08');
    const [selectedYear, setSelectedYear] = useState(2025);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
    const [form] = Form.useForm();
    const [payrollRecords, setPayrollRecords] = useState(getMockPayrollRecords());

    const employees = getMockEmployees();
    const monthlyRecords = getMockPayrollByMonth(selectedMonth, selectedYear);

    // Calculate statistics
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

    const handleProcessPayroll = (id: string) => {
        updateMockPayrollStatus(id, 'processed');
        setPayrollRecords([...getMockPayrollRecords()]);
        message.success('Payroll processed successfully!');
    };

    const handlePayPayroll = (id: string) => {
        updateMockPayrollStatus(id, 'paid', dayjs().format('YYYY-MM-DD'));
        setPayrollRecords([...getMockPayrollRecords()]);
        message.success('Payroll payment completed!');
    };

    const handleCalculatePayroll = (values: any) => {
        const employee = employees.find(emp => emp.id === values.employeeId);
        if (!employee) return;

        const calculated = calculatePayroll(
            employee.salary,
            values.overtime || 0,
            values.workingDays || 22,
            values.allowances || 0,
            values.deductions || 0
        );

        const newRecord: PayrollRecord = {
            id: (payrollRecords.length + 1).toString(),
            employeeId: values.employeeId,
            employeeName: employee.fullName,
            position: employee.position,
            department: employee.department,
            month: selectedMonth,
            year: selectedYear,
            status: 'draft',
            ...calculated,
        } as PayrollRecord;

        setPayrollRecords([...payrollRecords, newRecord]);
        message.success('Payroll calculated and added successfully!');
        setIsModalVisible(false);
        form.resetFields();
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
            render: (amount: number) => `${amount.toLocaleString()} VNĐ`,
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
                        +{record.overtimePay.toLocaleString()} VNĐ
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
                    {amount.toLocaleString()} VNĐ
                </Text>
            ),
            sorter: (a: PayrollRecord, b: PayrollRecord) => a.grossPay - b.grossPay,
        },
        {
            title: 'Deductions',
            key: 'deductions',
            render: (_: any, record: PayrollRecord) => {
                const totalDeductions = record.tax + record.socialInsurance + record.healthInsurance + record.deductions;
                return (
                    <Tooltip title={`Tax: ${record.tax.toLocaleString()} | SI: ${record.socialInsurance.toLocaleString()} | HI: ${record.healthInsurance.toLocaleString()} | Other: ${record.deductions.toLocaleString()}`}>
                        <Text style={{ color: '#ff4d4f' }}>
                            -{totalDeductions.toLocaleString()} VNĐ
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
                    {amount.toLocaleString()} VNĐ
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
                                    formatter={value => `${Number(value).toLocaleString()} VNĐ`}
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
                                    formatter={value => `${Number(value).toLocaleString()} VNĐ`}
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
                                    formatter={value => `${Number(value).toLocaleString()} VNĐ`}
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
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCalculatePayroll}
                >
                    <Form.Item
                        label="Employee"
                        name="employeeId"
                        rules={[{ required: true, message: 'Please select an employee!' }]}
                    >
                        <Select placeholder="Select employee">
                            {employees.filter(emp => emp.status === 'active').map(employee => (
                                <Select.Option key={employee.id} value={employee.id}>
                                    {employee.fullName} - {employee.position} ({employee.salary.toLocaleString()} VNĐ/month)
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
                                <InputNumber min={0} max={31} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Overtime Hours"
                                name="overtime"
                                initialValue={0}
                            >
                                <InputNumber min={0} max={100} style={{ width: '100%' }} />
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
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Deductions (VNĐ)"
                                name="deductions"
                                initialValue={0}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as any}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Alert
                        message="Tax and insurance will be calculated automatically based on current rates."
                        type="info"
                        style={{ marginBottom: '16px' }}
                    />

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Calculate & Save
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
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
                                        <Text>Basic Salary: <Text strong>{selectedRecord.basicSalary.toLocaleString()} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Overtime Pay: <Text strong>{selectedRecord.overtimePay.toLocaleString()} VNĐ</Text></Text>
                                        <Text type="secondary"> ({selectedRecord.overtime}h × {selectedRecord.overtimeRate.toLocaleString()})</Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Allowances: <Text strong>{selectedRecord.allowances.toLocaleString()} VNĐ</Text></Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div>
                                        <Text strong>Gross Pay: <Text style={{ color: '#1890ff' }}>{selectedRecord.grossPay.toLocaleString()} VNĐ</Text></Text>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Deductions">
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Income Tax: <Text strong>{selectedRecord.tax.toLocaleString()} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Social Insurance: <Text strong>{selectedRecord.socialInsurance.toLocaleString()} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Health Insurance: <Text strong>{selectedRecord.healthInsurance.toLocaleString()} VNĐ</Text></Text>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text>Other Deductions: <Text strong>{selectedRecord.deductions.toLocaleString()} VNĐ</Text></Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div>
                                        <Text strong>Total Deductions: <Text style={{ color: '#ff4d4f' }}>
                                            {(selectedRecord.tax + selectedRecord.socialInsurance + selectedRecord.healthInsurance + selectedRecord.deductions).toLocaleString()} VNĐ
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
                                        {selectedRecord.netPay.toLocaleString()} VNĐ
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
