"use client";

import React, { useState } from 'react';
import {
    Card,
    Table,
    DatePicker,
    Row,
    Col,
    Tag,
    Button,
    Modal,
    Form,
    Select,
    Input,
    TimePicker,
    message,
    Statistic,
    Progress,
    Space,
    Typography
} from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { getMockAttendance, getMockAttendanceByDate, addMockAttendance, type AttendanceRecord } from '../../../data/mockAttendance';
import { getMockEmployees } from '../../../data/mockEmployees';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function AttendancePage() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const allAttendance = getMockAttendance();
    const todayAttendance = getMockAttendanceByDate(selectedDate.format('YYYY-MM-DD'));
    const employees = getMockEmployees();

    // Calculate statistics
    const presentCount = todayAttendance.filter(a => a.status === 'present').length;
    const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
    const lateCount = todayAttendance.filter(a => a.status === 'late').length;
    const halfDayCount = todayAttendance.filter(a => a.status === 'half-day').length;

    const totalWorkingHours = todayAttendance.reduce((sum, a) => sum + (a.workingHours || 0), 0);
    const totalOvertime = todayAttendance.reduce((sum, a) => sum + (a.overtime || 0), 0);

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            key: 'employeeName',
            sorter: (a: AttendanceRecord, b: AttendanceRecord) => a.employeeName.localeCompare(b.employeeName),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Check In',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (time: string) => time || '-',
        },
        {
            title: 'Check Out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: (time: string) => time || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig = {
                    present: { color: 'green', text: 'Present' },
                    absent: { color: 'red', text: 'Absent' },
                    late: { color: 'orange', text: 'Late' },
                    'half-day': { color: 'blue', text: 'Half Day' },
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Working Hours',
            dataIndex: 'workingHours',
            key: 'workingHours',
            render: (hours: number) => hours ? `${hours}h` : '-',
        },
        {
            title: 'Overtime',
            dataIndex: 'overtime',
            key: 'overtime',
            render: (hours: number) => hours ? `${hours}h` : '-',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes: string) => notes || '-',
        },
    ];

    const handleAddAttendance = (values: any) => {
        const newRecord = {
            employeeId: values.employeeId,
            employeeName: employees.find(emp => emp.id === values.employeeId)?.fullName || '',
            date: values.date.format('YYYY-MM-DD'),
            checkIn: values.checkIn?.format('HH:mm') || '',
            checkOut: values.checkOut?.format('HH:mm') || '',
            status: values.status,
            workingHours: values.workingHours || 0,
            overtime: values.overtime || 0,
            notes: values.notes || '',
        };

        addMockAttendance(newRecord);
        message.success('Attendance record added successfully!');
        setIsModalVisible(false);
        form.resetFields();
        // Trigger re-render by updating state (in real app, you'd refetch data)
        window.location.reload();
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Attendance Management</Title>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Present"
                            value={presentCount}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Absent"
                            value={absentCount}
                            prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Late"
                            value={lateCount}
                            prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Half Day"
                            value={halfDayCount}
                            prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Working Hours Summary */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} md={12}>
                    <Card>
                        <Statistic
                            title="Total Working Hours"
                            value={totalWorkingHours}
                            suffix="hours"
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card>
                        <Statistic
                            title="Total Overtime"
                            value={totalOvertime}
                            suffix="hours"
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: totalOvertime > 0 ? '#faad14' : undefined }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Date Filter and Add Button */}
            <Card style={{ marginBottom: '24px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <CalendarOutlined />
                            <DatePicker
                                value={selectedDate}
                                onChange={(date) => setSelectedDate(date || dayjs())}
                                format="DD/MM/YYYY"
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Add Attendance
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Attendance Table */}
            <Card title={`Attendance Records - ${selectedDate.format('DD/MM/YYYY')}`}>
                <Table
                    columns={columns}
                    dataSource={todayAttendance}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Add Attendance Modal */}
            <Modal
                title="Add Attendance Record"
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
                    onFinish={handleAddAttendance}
                >
                    <Form.Item
                        label="Employee"
                        name="employeeId"
                        rules={[{ required: true, message: 'Please select an employee!' }]}
                    >
                        <Select placeholder="Select employee">
                            {employees.map(employee => (
                                <Select.Option key={employee.id} value={employee.id}>
                                    {employee.fullName} - {employee.position}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select date!' }]}
                        initialValue={dayjs()}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Check In Time"
                                name="checkIn"
                            >
                                <TimePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Check Out Time"
                                name="checkOut"
                            >
                                <TimePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select status!' }]}
                    >
                        <Select placeholder="Select status">
                            <Select.Option value="present">Present</Select.Option>
                            <Select.Option value="absent">Absent</Select.Option>
                            <Select.Option value="late">Late</Select.Option>
                            <Select.Option value="half-day">Half Day</Select.Option>
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Working Hours"
                                name="workingHours"
                            >
                                <Input type="number" min={0} max={24} step={0.5} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Overtime Hours"
                                name="overtime"
                            >
                                <Input type="number" min={0} max={12} step={0.5} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <Input.TextArea rows={3} placeholder="Additional notes..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Add Record
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
