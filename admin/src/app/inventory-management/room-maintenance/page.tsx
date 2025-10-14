"use client";

import { Table, Card, Row, Col, Tag, Typography, Select, Button, Space, Modal, Form, Input, DatePicker, message, Progress, Spin } from "antd";
import { ToolOutlined, PlusOutlined, EditOutlined, CheckOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface MaintenanceRequest {
    id: string;
    roomId: string;
    issueType: 'ac' | 'plumbing' | 'electrical' | 'furniture' | 'cleaning' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    description: string;
    reportedBy: string;
    reportedAt: string;
    assignedTo?: string;
    startedAt?: string;
    completedAt?: string;
    estimatedHours?: number;
    actualHours?: number;
    cost?: number;
    notes?: string;
    room?: {
        id: string;
        number: string;
        property?: {
            name: string;
        };
    };
}

interface Room {
    id: string;
    number: string;
    propertyId: string;
    property?: {
        id: string;
        name: string;
    };
}

interface Property {
    id: string;
    name: string;
}

export default function RoomMaintenancePage() {
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);

    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            // Fetch maintenance requests
            const maintenanceResponse = await fetch(`${API_ENDPOINT}/rooms/maintenance?limit=1000`, { headers });
            if (maintenanceResponse.ok) {
                const maintenanceData = await maintenanceResponse.json();
                setMaintenanceRequests(maintenanceData.data || []);
            }

            // Fetch rooms
            const roomsResponse = await fetch(`${API_ENDPOINT}/rooms?limit=1000`, { headers });
            if (roomsResponse.ok) {
                const roomsData = await roomsResponse.json();
                setRooms(roomsData.data || []);
            }

            // Fetch properties
            const propertiesResponse = await fetch(`${API_ENDPOINT}/properties`, { headers });
            if (propertiesResponse.ok) {
                const propertiesData = await propertiesResponse.json();
                setProperties(propertiesData.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to load maintenance data');
        } finally {
            setLoading(false);
        }
    };

    // Filter requests
    const filteredRequests = maintenanceRequests.filter(request => {
        if (selectedProperty) {
            const room = rooms.find(r => r.id === request.roomId);
            if (!room || room.propertyId !== selectedProperty) return false;
        }
        if (selectedStatus && request.status !== selectedStatus) return false;
        if (selectedPriority && request.priority !== selectedPriority) return false;
        return true;
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return '#f5222d';
            case 'high': return '#fa8c16';
            case 'medium': return '#faad14';
            case 'low': return '#52c41a';
            default: return '#d9d9d9';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'in_progress': return 'blue';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            default: return 'default';
        }
    };

    const getIssueTypeIcon = (issueType: string) => {
        switch (issueType) {
            case 'ac': return '❄️';
            case 'plumbing': return '🚿';
            case 'electrical': return '⚡';
            case 'furniture': return '🪑';
            case 'cleaning': return '🧽';
            default: return '🔧';
        }
    };

    const handleAddRequest = () => {
        setEditingRequest(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditRequest = (request: MaintenanceRequest) => {
        setEditingRequest(request);
        form.setFieldsValue({
            ...request,
            reportedAt: dayjs(request.reportedAt),
            startedAt: request.startedAt ? dayjs(request.startedAt) : null,
            completedAt: request.completedAt ? dayjs(request.completedAt) : null,
        });
        setIsModalVisible(true);
    };

    const handleCompleteRequest = async (requestId: string) => {
        Modal.confirm({
            title: 'Complete Maintenance Request',
            content: 'Mark this maintenance request as completed?',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_ENDPOINT}/rooms/maintenance/${requestId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            status: 'completed',
                            completedAt: new Date().toISOString(),
                        })
                    });

                    if (response.ok) {
                        message.success('Maintenance request completed');
                        fetchData();
                    } else {
                        message.error('Failed to complete maintenance request');
                    }
                } catch (error) {
                    message.error('Failed to complete maintenance request');
                }
            }
        });
    };

    const handleSubmit = async (values: any) => {
        try {
            const token = localStorage.getItem('token');
            const requestData = {
                roomId: values.roomId,
                issueType: values.issueType,
                priority: values.priority,
                status: values.status || 'pending',
                description: values.description,
                reportedBy: values.reportedBy,
                assignedTo: values.assignedTo,
                estimatedHours: values.estimatedHours,
                actualHours: values.actualHours,
                cost: values.cost,
                notes: values.notes,
                startedAt: values.startedAt ? dayjs(values.startedAt).toISOString() : undefined,
                completedAt: values.completedAt ? dayjs(values.completedAt).toISOString() : undefined,
            };

            if (editingRequest) {
                const response = await fetch(`${API_ENDPOINT}/rooms/maintenance/${editingRequest.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData)
                });

                if (response.ok) {
                    message.success('Maintenance request updated');
                    fetchData();
                } else {
                    message.error('Failed to update maintenance request');
                }
            } else {
                const response = await fetch(`${API_ENDPOINT}/rooms/maintenance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData)
                });

                if (response.ok) {
                    message.success('Maintenance request created');
                    fetchData();

                    // Set room to out of service if high priority
                    if (values.priority === 'high' || values.priority === 'urgent') {
                        await fetch(`${API_ENDPOINT}/rooms/${values.roomId}/status`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                operationalStatus: 'out_of_service',
                            })
                        });
                    }
                } else {
                    message.error('Failed to create maintenance request');
                }
            }
            
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error saving maintenance request:', error);
            message.error('Failed to save maintenance request');
        }
    };

    const columns = [
        {
            title: 'Room',
            dataIndex: 'roomId',
            key: 'roomId',
            render: (roomId: string, record: MaintenanceRequest) => {
                const roomNumber = record.room?.number || 'Unknown';
                const propertyName = record.room?.property?.name || 'Unknown Property';
                return (
                    <Space>
                        <Tag color="blue">Room {roomNumber}</Tag>
                        <Text type="secondary">{propertyName}</Text>
                    </Space>
                );
            },
        },
        {
            title: 'Issue',
            dataIndex: 'issueType',
            key: 'issueType',
            render: (issueType: string, record: MaintenanceRequest) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <span>{getIssueTypeIcon(issueType)}</span>
                        <Text strong>{issueType.replace('_', ' ').toUpperCase()}</Text>
                    </Space>
                    <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                        {record.description}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => (
                <Tag color={getPriorityColor(priority)} style={{ color: 'white' }}>
                    {priority.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Progress',
            key: 'progress',
            render: (record: MaintenanceRequest) => {
                let percent = 0;
                switch (record.status) {
                    case 'pending': percent = 0; break;
                    case 'in_progress': percent = record.actualHours && record.estimatedHours 
                        ? Math.min((record.actualHours / record.estimatedHours) * 100, 100) : 50; break;
                    case 'completed': percent = 100; break;
                    case 'cancelled': percent = 0; break;
                }
                return (
                    <Progress 
                        percent={percent} 
                        size="small" 
                        status={record.status === 'cancelled' ? 'exception' : undefined}
                    />
                );
            },
        },
        {
            title: 'Assigned To',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            render: (assignedTo: string) => assignedTo || <Text type="secondary">Unassigned</Text>,
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            render: (cost: number) => cost ? `${cost.toLocaleString()} VNĐ` : <Text type="secondary">-</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: MaintenanceRequest) => (
                <Space>
                    <Button 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => handleEditRequest(record)}
                    />
                    {record.status !== 'completed' && record.status !== 'cancelled' && (
                        <Button 
                            icon={<CheckOutlined />} 
                            size="small"
                            type="primary"
                            onClick={() => handleCompleteRequest(record.id)}
                        />
                    )}
                </Space>
            ),
        },
    ];

    // Statistics
    const totalRequests = filteredRequests.length;
    const pendingRequests = filteredRequests.filter(r => r.status === 'pending').length;
    const inProgressRequests = filteredRequests.filter(r => r.status === 'in_progress').length;
    const completedRequests = filteredRequests.filter(r => r.status === 'completed').length;
    const urgentRequests = filteredRequests.filter(r => r.priority === 'urgent').length;

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <ToolOutlined style={{ marginRight: '8px' }} />
                        Room Maintenance
                    </Title>
                    <Text type="secondary">Manage room maintenance requests and track progress</Text>
                </Col>
                <Col>
                    <Space>
                        <Button onClick={fetchData} loading={loading}>
                            Refresh
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRequest}>
                            New Request
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Property"
                            allowClear
                            value={selectedProperty || undefined}
                            onChange={setSelectedProperty}
                        >
                            {properties.map(property => (
                                <Select.Option key={property.id} value={property.id}>
                                    {property.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Status"
                            allowClear
                            value={selectedStatus || undefined}
                            onChange={setSelectedStatus}
                        >
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="in_progress">In Progress</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Priority"
                            allowClear
                            value={selectedPriority || undefined}
                            onChange={setSelectedPriority}
                        >
                            <Select.Option value="urgent">Urgent</Select.Option>
                            <Select.Option value="high">High</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="low">Low</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={6}>
                        <Button 
                            onClick={() => {
                                setSelectedProperty('');
                                setSelectedStatus('');
                                setSelectedPriority('');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <ToolOutlined style={{ color: '#1890ff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalRequests}</div>
                                <div style={{ color: '#666' }}>Total Requests</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <ClockCircleOutlined style={{ color: '#faad14' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{pendingRequests}</div>
                                <div style={{ color: '#666' }}>Pending</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <EditOutlined style={{ color: '#1890ff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{inProgressRequests}</div>
                                <div style={{ color: '#666' }}>In Progress</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{urgentRequests}</div>
                                <div style={{ color: '#666' }}>Urgent</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Maintenance Requests Table */}
            <Card title="Maintenance Requests">
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={filteredRequests}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} of ${total} requests`,
                        }}
                        scroll={{ x: 1200 }}
                    />
                </Spin>
            </Card>

            {/* Add/Edit Maintenance Request Modal */}
            <Modal
                title={editingRequest ? 'Edit Maintenance Request' : 'New Maintenance Request'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Room"
                                name="roomId"
                                rules={[{ required: true, message: 'Please select a room!' }]}
                            >
                                <Select placeholder="Select room">
                                    {rooms.map(room => (
                                        <Select.Option key={room.id} value={room.id}>
                                            Room {room.number} - {room.property?.name || 'N/A'}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Issue Type"
                                name="issueType"
                                rules={[{ required: true, message: 'Please select issue type!' }]}
                            >
                                <Select placeholder="Select issue type">
                                    <Select.Option value="ac">Air Conditioning</Select.Option>
                                    <Select.Option value="plumbing">Plumbing</Select.Option>
                                    <Select.Option value="electrical">Electrical</Select.Option>
                                    <Select.Option value="furniture">Furniture</Select.Option>
                                    <Select.Option value="cleaning">Cleaning</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Priority"
                                name="priority"
                                rules={[{ required: true, message: 'Please select priority!' }]}
                            >
                                <Select placeholder="Select priority">
                                    <Select.Option value="low">Low</Select.Option>
                                    <Select.Option value="medium">Medium</Select.Option>
                                    <Select.Option value="high">High</Select.Option>
                                    <Select.Option value="urgent">Urgent</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                            >
                                <Select placeholder="Select status">
                                    <Select.Option value="pending">Pending</Select.Option>
                                    <Select.Option value="in_progress">In Progress</Select.Option>
                                    <Select.Option value="completed">Completed</Select.Option>
                                    <Select.Option value="cancelled">Cancelled</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: 'Please enter description!' }]}
                            >
                                <TextArea rows={3} placeholder="Describe the issue..." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Reported By"
                                name="reportedBy"
                                rules={[{ required: true, message: 'Please enter reporter name!' }]}
                            >
                                <Input placeholder="Reporter name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Assigned To"
                                name="assignedTo"
                            >
                                <Input placeholder="Assigned technician/team" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Estimated Hours"
                                name="estimatedHours"
                            >
                                <Input type="number" placeholder="Hours" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Actual Hours"
                                name="actualHours"
                            >
                                <Input type="number" placeholder="Hours" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Cost (VNĐ)"
                                name="cost"
                            >
                                <Input type="number" placeholder="Cost" />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Notes"
                                name="notes"
                            >
                                <TextArea rows={2} placeholder="Additional notes..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingRequest ? 'Update' : 'Create'} Request
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
