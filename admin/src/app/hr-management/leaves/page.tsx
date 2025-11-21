"use client";

import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Descriptions,
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
    Tooltip,
    Spin
} from 'antd';
import {
    PlusOutlined,
    CheckOutlined,
    CloseOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// API Base URL
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Types
interface LeaveRequest {
    id: string;
    employeeId: string;
    employee?: {
        id: string;
        fullName: string;
        employeeCode: string;
    };
    leaveDate: string;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    leaveType: string;
    status: string;
    reason: string;
    appliedDate?: string;
    approvedBy?: string;
    approvedDate?: string;
    hrNote?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

interface Employee {
    id: string;
    fullName: string;
    position: string;
    status: string;
}

export default function LeavePage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    // Action modal state for approve/reject with note
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [actionRecordId, setActionRecordId] = useState<string | null>(null);
    const [actionNote, setActionNote] = useState<string>('');
    const [actionSubmitting, setActionSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch data from API
    const fetchLeaveRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}/leaves?page=1&limit=100`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched leave requests:', data.data);
                setLeaveRequests(data.data || []);
            } else {
                message.error('Failed to fetch leave requests');
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            message.error('Error fetching leave requests');
        } finally {
            setLoading(false);
        }
    };

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
                console.log('Fetched employees:', data.data);
                setEmployees(data.data || []);
            } else {
                message.error('Failed to fetch employees');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            message.error('Error fetching employees');
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
        fetchEmployees();
    }, []);

    // Calculate statistics
    const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
    const approvedRequests = leaveRequests.filter(req => req.status === 'approved').length;
    const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected').length;
    const totalRequests = leaveRequests.length;

    // selected record for action modal
    const selectedRecord = actionRecordId ? leaveRequests.find(r => r.id === actionRecordId) ?? null : null;

    const handleApproveLeave = async (id: string, hrNote?: string) => {
        try {
            if (hrNote === undefined || hrNote.trim() === '') {
                message.error('Please provide a note for approval.');
                return;
            }
            const retrievedUserID = JSON.parse(localStorage.getItem('user') || '{}').id;
            const responseUser = await fetch(`${API_ENDPOINT}/employees/get-employee-by-user-id/${retrievedUserID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log('Fetched user details response:', responseUser);
            if (responseUser.ok) {
                console.log('Failed to fetch user details', responseUser);
                const response = await fetch(`${API_ENDPOINT}/leaves/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: 'approved',
                        hrNote: hrNote,
                        approvedBy: retrievedUserID.id,
                        approvedDate: dayjs().format('YYYY-MM-DD')
                    })
                });

                if (response.ok) {
                    message.success('Leave request approved successfully!');
                    fetchLeaveRequests();
                } else {
                    const error = await response.json();
                    message.error(error.message || 'Failed to approve leave request');
                }
            }
        } catch (error) {
            console.error('Error approving leave:', error);
            message.error('Error approving leave request');
        }
    };

    const handleRejectLeave = async (id: string, reason?: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/leaves/${id}/approve-reject?approverId=${localStorage.getItem('userId')}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'rejected',
                    hrNote: reason || 'Rejected by HR'
                })
            });

            if (response.ok) {
                message.success('Leave request rejected!');
                fetchLeaveRequests(); // Refresh data
            } else {
                const error = await response.json();
                message.error(error.message || 'Failed to reject leave request');
            }
        } catch (error) {
            console.error('Error rejecting leave:', error);
            message.error('Error rejecting leave request');
        }
    };

    const handleDeleteLeave = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/leaves/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                message.success('Leave request deleted successfully!');
                fetchLeaveRequests(); // Refresh data
            } else {
                const error = await response.json();
                message.error(error.message || 'Failed to delete leave request');
            }
        } catch (error) {
            console.error('Error deleting leave:', error);
            message.error('Error deleting leave request');
        }
    };

    const handleAddLeaveRequest = async (values: any) => {
        setSubmitting(true);
        try {
            const startDate = values.dateRange[0];
            const endDate = values.dateRange[1];
            const numberOfDays = endDate.diff(startDate, 'day') + 1;

            const leaveData = {
                employeeId: values.employeeId,
                leaveDate: startDate.format('YYYY-MM-DD'),
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
                numberOfDays: numberOfDays,
                leaveType: values.leaveType,
                reason: values.reason,
                status: 'pending',
                appliedDate: dayjs().format('YYYY-MM-DD')
            };

            const response = await fetch(`${API_ENDPOINT}/leaves`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leaveData)
            });

            if (response.ok) {
                message.success('Leave request submitted successfully!');
                setIsModalVisible(false);
                form.resetFields();
                fetchLeaveRequests(); // Refresh data
            } else {
                const error = await response.json();
                message.error(error.message || 'Failed to submit leave request');
            }
        } catch (error) {
            console.error('Error submitting leave request:', error);
            message.error('Error submitting leave request');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employee',
            key: 'employee',
            render: (employee: any, record: LeaveRequest) => {
                const empName = employee?.fullName || `Employee ${record.employeeId}`;
                return empName;
            },
            sorter: (a: LeaveRequest, b: LeaveRequest) => {
                const nameA = a.employee?.fullName || '';
                const nameB = b.employee?.fullName || '';
                return nameA.localeCompare(nameB);
            },
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
                    unpaid: { color: 'gray', text: 'Unpaid Leave' },
                    other: { color: 'default', text: 'Other Leave' },
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
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Days',
            dataIndex: 'numberOfDays',
            key: 'numberOfDays',
            sorter: (a: LeaveRequest, b: LeaveRequest) => a.numberOfDays - b.numberOfDays,
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
            render: (_: any, record: LeaveRequest) => {
                if (record.status === 'pending') {
                    return (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckOutlined />}
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                onClick={() => {
                                    setActionType('approve');
                                    setActionRecordId(record.id);
                                    setActionNote(record.hrNote || '');
                                    setIsActionModalVisible(true);
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={() => {
                                    setActionType('reject');
                                    setActionRecordId(record.id);
                                    setActionNote(record.rejectionReason || record.hrNote || '');
                                    setIsActionModalVisible(true);
                                }}
                            >
                                Reject
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete this leave request?"
                                onConfirm={() => handleDeleteLeave(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </div>
                    );
                }
                return (
                    <Tag color={record.status === 'approved' ? 'green' : 'red'}>
                        {record.status === 'approved' ? 'Approved' : 'Rejected'}
                        {record.updatedAt && ` on ${dayjs(record.updatedAt).format('DD/MM/YYYY')}`}
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
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        total: leaveRequests.length,
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
                        <Select placeholder="Select employee" loading={employees.length === 0}>
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
                            <Select.Option value="unpaid">Unpaid Leave</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
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
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Submit Request
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Approve/Reject with note modal */}
            <Modal
                title={actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                open={isActionModalVisible}
                onCancel={() => {
                    setIsActionModalVisible(false);
                    setActionType(null);
                    setActionRecordId(null);
                    setActionNote('');
                }}
                onOk={async () => {
                    if (!actionRecordId || !actionType) return;
                    setActionSubmitting(true);
                    try {
                        if (actionType === 'approve') {
                            await handleApproveLeave(actionRecordId, actionNote);
                        } else {
                            await handleRejectLeave(actionRecordId, actionNote);
                        }
                        setIsActionModalVisible(false);
                        setActionType(null);
                        setActionRecordId(null);
                        setActionNote('');
                    } finally {
                        setActionSubmitting(false);
                    }
                }}
                confirmLoading={actionSubmitting}
                width={720}
            >
                {selectedRecord ? (
                    <>
                        <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Employee">{selectedRecord.employee?.fullName || selectedRecord.employeeId}</Descriptions.Item>
                            <Descriptions.Item label="Employee Code">{selectedRecord.employee?.employeeCode || selectedRecord.employeeId || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Leave Type">{selectedRecord.leaveType}</Descriptions.Item>
                            <Descriptions.Item label="Status">{selectedRecord.status}</Descriptions.Item>
                            <Descriptions.Item label="Start Date">{dayjs(selectedRecord.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="End Date">{dayjs(selectedRecord.endDate).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Days">{selectedRecord.numberOfDays}</Descriptions.Item>
                            <Descriptions.Item label="Applied Date">{selectedRecord.appliedDate ? dayjs(selectedRecord.appliedDate).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="Reason" span={2}>{selectedRecord.reason}</Descriptions.Item>
                            <Descriptions.Item label="HR Note" span={2}>{selectedRecord.hrNote || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Rejection Reason" span={2}>{selectedRecord.rejectionReason || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Created At">{dayjs(selectedRecord.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                            <Descriptions.Item label="Updated At">{selectedRecord.updatedAt ? dayjs(selectedRecord.updatedAt).format('DD/MM/YYYY HH:mm') : '-'}</Descriptions.Item>
                        </Descriptions>

                        <Form layout="vertical">
                            <Form.Item label={actionType === 'approve' ? 'Approval note (optional)' : 'Rejection note (optional)'}>
                                <TextArea
                                    rows={4}
                                    value={actionNote}
                                    onChange={(e) => setActionNote(e.target.value)}
                                    placeholder={actionType === 'approve' ? 'Add an approval note (optional)...' : 'Add a rejection reason or note...'}
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                        </Form>
                    </>
                ) : (
                    <Spin />
                )}
            </Modal>
        </div>
    );
}
