"use client";

import React, { useEffect, useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Select, Input, message, Tag, Space, Row, Col,
    Statistic, Typography, DatePicker, TimePicker, Switch
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, UserOutlined,
    CalendarOutlined, TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

interface WorkingShift {
    id: string;
    propertyId?: string;
    employeeId?: string;
    employeeName?: string;
    workingDate: string;
    startTime: string;
    endTime: string;
    shiftType: 'morning' | 'night' | 'other';
    notes?: string;
    isReassigned: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Employee {
    id: string;
    fullName: string;
    position: string;
    department: string;
    status: string;
}

interface Property {
    id: string;
    name: string;
    type: string;
}

export default function WorkingShiftsPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedShift, setSelectedShift] = useState<WorkingShift | null>(null);
    const [form] = Form.useForm();
    const [shifts, setShifts] = useState<WorkingShift[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);

    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

    useEffect(() => {
        fetchShifts();
        fetchEmployees();
        fetchProperties();
    }, []);

    const fetchShifts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}/working-shifts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const formattedShifts = data.data.map((shift: any) => ({
                    id: shift.id,
                    propertyId: shift.propertyId || shift.property_id,
                    employeeId: shift.employeeId || shift.employee_id,
                    employeeName: shift.employee?.fullName || shift.employee?.full_name || 'Unknown',
                    workingDate: shift.workingDate || shift.working_date,
                    startTime: shift.startTime || shift.start_time,
                    endTime: shift.endTime || shift.end_time,
                    shiftType: shift.shiftType || shift.shift_type || 'other',
                    notes: shift.notes || '',
                    isReassigned: shift.isReassigned || shift.is_reassigned || false,
                    createdAt: shift.createdAt || shift.created_at,
                    updatedAt: shift.updatedAt || shift.updated_at,
                }));
                console.log('Fetched shifts:', formattedShifts);
                setShifts(formattedShifts);
            } else {
                message.error('Failed to fetch working shifts');
            }
        } catch (error) {
            console.error('Error fetching shifts:', error);
            message.error('Error fetching working shifts');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/employees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const formattedEmployees = data.data.map((employee: any) => ({
                    id: employee.id,
                    fullName: employee.fullName || employee.full_name || 'Unknown',
                    position: employee.position || 'Not specified',
                    department: employee.department || 'Unassigned',
                    status: employee.status || 'active',
                }));
                setEmployees(formattedEmployees);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/properties`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const formattedProperties = data.data.map((property: any) => ({
                    id: property.id,
                    name: property.name || 'Unknown Property',
                    type: property.type || 'Unknown',
                }));
                setProperties(formattedProperties);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handleCreateShift = async (values: any) => {
        try {
            const shiftData = {
                propertyId: values.propertyId,
                employeeId: values.employeeId,
                workingDate: values.workingDate.format('YYYY-MM-DD'),
                startTime: values.startTime.format('HH:mm:ss'),
                endTime: values.endTime.format('HH:mm:ss'),
                shiftType: values.shiftType,
                notes: values.notes || '',
                isReassigned: values.isReassigned || false,
            };

            const response = await fetch(`${API_ENDPOINT}/working-shifts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(shiftData),
            });

            if (response.ok) {
                message.success('Working shift created successfully!');
                setIsModalVisible(false);
                form.resetFields();
                fetchShifts();
            } else {
                const error = await response.json();
                message.error(`Error creating shift: ${error.message}`);
            }
        } catch (error) {
            console.error('Error creating shift:', error);
            message.error('Error creating working shift');
        }
    };

    const handleEditShift = async (values: any) => {
        if (!selectedShift) return;
        console.log('Editing shift with values:', values);
        console.log('Selected shift:', selectedShift);
        try {
            const shiftData = {
                propertyId: values.propertyId,
                employeeId: values.employeeId,
                workingDate: values.workingDate.format('YYYY-MM-DD'),
                startTime: values.startTime.format('HH:mm:ss'),
                endTime: values.endTime.format('HH:mm:ss'),
                shiftType: values.shiftType,
                notes: values.notes || '',
                isReassigned: values.isReassigned || false,
            };

            const response = await fetch(`${API_ENDPOINT}/working-shifts/${selectedShift.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(shiftData),
            });

            if (response.ok) {
                message.success('Working shift updated successfully!');
                setIsModalVisible(false);
                setIsEditMode(false);
                setSelectedShift(null);
                form.resetFields();
                fetchShifts();
            } else {
                const error = await response.json();
                message.error(`Error updating shift: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating shift:', error);
            message.error('Error updating working shift');
        }
    };

    const handleDeleteShift = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/working-shifts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                message.success('Working shift deleted successfully!');
                fetchShifts();
            } else {
                message.error('Error deleting working shift');
            }
        } catch (error) {
            console.error('Error deleting shift:', error);
            message.error('Error deleting working shift');
        }
    };

    const showCreateModal = () => {
        setIsEditMode(false);
        setSelectedShift(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (shift: WorkingShift) => {
        setIsEditMode(true);
        setSelectedShift(shift);
        form.setFieldsValue({
            propertyId: shift.propertyId,
            employeeId: shift.employeeId,
            workingDate: dayjs(shift.workingDate),
            startTime: dayjs(shift.startTime, 'HH:mm:ss'),
            endTime: dayjs(shift.endTime, 'HH:mm:ss'),
            shiftType: shift.shiftType,
            notes: shift.notes,
            isReassigned: shift.isReassigned,
        });
        setIsModalVisible(true);
    };

    const getShiftTypeColor = (type: string) => {
        switch (type) {
            case 'morning': return 'blue';
            case 'night': return 'purple';
            case 'other': return 'orange';
            default: return 'default';
        }
    };

    const getShiftTypeText = (type: string) => {
        switch (type) {
            case 'morning': return 'Morning';
            case 'night': return 'Night';
            case 'other': return 'Other';
            default: return 'Unknown';
        }
    };

    // Calculate statistics
    const totalShifts = shifts.length;
    const morningShifts = shifts.filter(shift => shift.shiftType === 'morning').length;
    const nightShifts = shifts.filter(shift => shift.shiftType === 'night').length;
    const reassignedShifts = shifts.filter(shift => shift.isReassigned).length;

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employeeName',
            key: 'employeeName',
            render: (name: string, record: WorkingShift) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        ID: {record.employeeId}
                    </div>
                </div>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'workingDate',
            key: 'workingDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a: WorkingShift, b: WorkingShift) =>
                dayjs(a.workingDate).unix() - dayjs(b.workingDate).unix(),
        },
        {
            title: 'Shift Time',
            key: 'shiftTime',
            render: (record: WorkingShift) => (
                <div>
                    <div>{record.startTime} - {record.endTime}</div>
                    <Tag color={getShiftTypeColor(record.shiftType)}>
                        {getShiftTypeText(record.shiftType)}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (record: WorkingShift) => (
                <div>
                    {record.isReassigned ? (
                        <Tag color="orange">Reassigned</Tag>
                    ) : (
                        <Tag color="green">Normal</Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes: string) => (
                <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {notes || 'No notes'}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: WorkingShift) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            Modal.confirm({
                                title: 'Are you sure you want to delete this shift?',
                                content: 'This action cannot be undone.',
                                okText: 'Yes, Delete',
                                cancelText: 'Cancel',
                                onOk: () => handleDeleteShift(record.id),
                            });
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <ClockCircleOutlined style={{ marginRight: '8px' }} />
                        Working Shifts Management
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showCreateModal}
                    >
                        Add New Shift
                    </Button>
                </Col>
            </Row>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Total Shifts"
                            value={totalShifts}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Morning Shifts"
                            value={morningShifts}
                            prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Night Shifts"
                            value={nightShifts}
                            prefix={<CalendarOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Reassigned"
                            value={reassignedShifts}
                            prefix={<TeamOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Shifts Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={shifts}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* Create/Edit Shift Modal */}
            <Modal
                title={isEditMode ? "Edit Working Shift" : "Add New Working Shift"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setIsEditMode(false);
                    setSelectedShift(null);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={isEditMode ? handleEditShift : handleCreateShift}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Property"
                                name="propertyId"
                            >
                                <Select placeholder="Select property">
                                    {properties.map(property => (
                                        <Select.Option key={property.id} value={property.id}>
                                            {property.name} ({property.type})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Employee"
                                name="employeeId"
                                rules={[{ required: true, message: 'Please select an employee!' }]}
                            >
                                <Select placeholder="Select employee">
                                    {employees.filter(emp => emp.status === 'active').map(employee => (
                                        <Select.Option key={employee.id} value={employee.id}>
                                            {employee.fullName} - {employee.position}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Working Date"
                                name="workingDate"
                                rules={[{ required: true, message: 'Please select working date!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Start Time"
                                name="startTime"
                                rules={[{ required: true, message: 'Please select start time!' }]}
                            >
                                <TimePicker style={{ width: '100%' }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="End Time"
                                name="endTime"
                                rules={[{ required: true, message: 'Please select end time!' }]}
                            >
                                <TimePicker style={{ width: '100%' }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Shift Type"
                                name="shiftType"
                                rules={[{ required: true, message: 'Please select shift type!' }]}
                            >
                                <Select placeholder="Select shift type">
                                    <Select.Option value="morning">Morning</Select.Option>
                                    <Select.Option value="night">Night</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Is Reassigned"
                                name="isReassigned"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <TextArea rows={3} placeholder="Additional notes..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                setIsEditMode(false);
                                setSelectedShift(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {isEditMode ? 'Update Shift' : 'Create Shift'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}