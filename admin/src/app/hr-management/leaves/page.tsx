"use client";

import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    message,
    Tag,
    Space,
    Row,
    Col,
    Statistic,
    Typography,
    Popconfirm,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    CheckOutlined,
    CloseOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { getMockLeaveRequests, updateMockLeaveRequest, type LeaveRequest } from '../../../data/mockAttendance';
import { getMockEmployees } from '../../../data/mockEmployees';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function LeavePage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [leaveRequests, setLeaveRequests] = useState(getMockLeaveRequests());

    const employees = getMockEmployees();

    // Calculate statistics
    const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
    const approvedRequests = leaveRequests.filter(req => req.status === 'approved').length;
    const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected').length;
    const totalRequests = leaveRequests.length;

    const handleApproveLeave = (id: string) => {
        const updated = updateMockLeaveRequest(id, {
            status: 'approved',
            approvedBy: 'HR Manager',
            approvedDate: dayjs().format('YYYY-MM-DD'),
        });

        if (updated) {
            setLeaveRequests([...getMockLeaveRequests()]);
            message.success('Leave request approved successfully!');
        }
    };

    const handleRejectLeave = (id: string, reason?: string) => {
        const updated = updateMockLeaveRequest(id, {
            status: 'rejected',
            approvedBy: 'HR Manager',
            approvedDate: dayjs().format('YYYY-MM-DD'),
            rejectionReason: reason || 'No reason provided',
        });

        if (updated) {
            setLeaveRequests([...getMockLeaveRequests()]);
            message.success('Leave request rejected!');
        }
    };

    const handleAddLeaveRequest = (values: any) => {
        const startDate = values.dateRange[0];
        const endDate = values.dateRange[1];
        const days = endDate.diff(startDate, 'day') + 1;

        const newRequest: LeaveRequest = {
            id: (leaveRequests.length + 1).toString(),
            employeeId: values.employeeId,
            employeeName: employees.find(emp => emp.id === values.employeeId)?.fullName || '',
            leaveType: values.leaveType,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            days: days,
            reason: values.reason,
            status: 'pending',
            appliedDate: dayjs().format('YYYY-MM-DD'),
        };

        setLeaveRequests([...leaveRequests, newRequest]);
        message.success('Leave request submitted successfully!');
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employeeName',
            key: 'employeeName',
            sorter: (a: LeaveRequest, b: LeaveRequest) => a.employeeName.localeCompare(b.employeeName),
        },
        {
            title: 'Leave Type',
            dataIndex: 'leaveType',
            key: 'leaveType',
            render: (type: string) => {
                const typeConfig = {
                    annual: { color: 'blue', text: 'Annual Leave' },
                    sick: { color: 'red', text: 'Sick Leave' },
                    personal: { color: 'orange', text: 'Personal Leave' },
                    maternity: { color: 'pink', text: 'Maternity Leave' },
                    emergency: { color: 'volcano', text: 'Emergency Leave' },
                };
                const config = typeConfig[type as keyof typeof typeConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a: LeaveRequest, b: LeaveRequest) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Days',
            dataIndex: 'days',
            key: 'days',
            sorter: (a: LeaveRequest, b: LeaveRequest) => a.days - b.days,
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
            render: (reason: string) => (
                <Tooltip title={reason}>
                    {reason.length > 50 ? `${reason.substring(0, 50)}...` : reason}
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig = {
                    pending: { color: 'processing', text: 'Pending' },
                    approved: { color: 'success', text: 'Approved' },
                    rejected: { color: 'error', text: 'Rejected' },
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Approved', value: 'approved' },
                { text: 'Rejected', value: 'rejected' },
            ],
            onFilter: (value: any, record: LeaveRequest) => record.status === value,
        },
        {
            title: 'Applied Date',
            dataIndex: 'appliedDate',
            key: 'appliedDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record: LeaveRequest) => {
                if (record.status === 'pending') {
                    return (
                        <Space>
                            <Popconfirm
                                title="Approve this leave request?"
                                onConfirm={() => handleApproveLeave(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<CheckOutlined />}
                                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                >
                                    Approve
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Reject this leave request?"
                                onConfirm={() => handleRejectLeave(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    size="small"
                                    icon={<CloseOutlined />}
                                >
                                    Reject
                                </Button>
                            </Popconfirm>
                        </Space>
                    );
                }
                return (
                    <Tag color={record.status === 'approved' ? 'green' : 'red'}>
                        {record.status === 'approved' ? 'Approved' : 'Rejected'}
                        {record.approvedDate && ` on ${dayjs(record.approvedDate).format('DD/MM/YYYY')}`}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Leave Management</Title>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Requests"
                            value={totalRequests}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={pendingRequests}
                            prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Approved"
                            value={approvedRequests}
                            prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Rejected"
                            value={rejectedRequests}
                            prefix={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Action Button */}
            <Card style={{ marginBottom: '24px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>Leave Requests</Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            New Leave Request
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Leave Requests Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={leaveRequests}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* Add Leave Request Modal */}
            <Modal
                title="New Leave Request"
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
                    onFinish={handleAddLeaveRequest}
                >
                    <Form.Item
                        label="Employee"
                        name="employeeId"
                        rules={[{ required: true, message: 'Please select an employee!' }]}
                    >
                        <Select placeholder="Select employee">
                            {employees.filter(emp => emp.status === 'active').map(employee => (
                                <Select.Option key={employee.id} value={employee.id}>
                                    <UserOutlined /> {employee.fullName} - {employee.position}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Leave Type"
                        name="leaveType"
                        rules={[{ required: true, message: 'Please select leave type!' }]}
                    >
                        <Select placeholder="Select leave type">
                            <Select.Option value="annual">Annual Leave</Select.Option>
                            <Select.Option value="sick">Sick Leave</Select.Option>
                            <Select.Option value="personal">Personal Leave</Select.Option>
                            <Select.Option value="maternity">Maternity Leave</Select.Option>
                            <Select.Option value="emergency">Emergency Leave</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Leave Duration"
                        name="dateRange"
                        rules={[{ required: true, message: 'Please select leave dates!' }]}
                    >
                        <RangePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[
                            { required: true, message: 'Please provide a reason!' },
                            { min: 10, message: 'Reason must be at least 10 characters!' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Please provide detailed reason for leave request..."
                            showCount
                            maxLength={500}
                        />
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
                                Submit Request
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
