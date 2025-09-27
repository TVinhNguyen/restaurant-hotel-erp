"use client";

import { Table, Card, Row, Col, Tag, Typography, Select, Button, Space, Modal, Form, Input, DatePicker, message, Progress } from "antd";
import { ToolOutlined, PlusOutlined, EditOutlined, CheckOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from 'dayjs';
import { 
    getMockRooms,
    getMockProperties,
    getMockRoomStatusHistory,
    updateRoomStatus,
    addMockRoomStatusHistory 
} from "../../../data/mockInventory";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Mock maintenance data
interface MaintenanceRequest {
    id: string;
    roomId: string;
    roomNumber: string;
    propertyName: string;
    issueType: 'ac' | 'plumbing' | 'electrical' | 'furniture' | 'cleaning' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    description: string;
    reportedBy: string;
    reportedAt: Date;
    assignedTo?: string;
    startedAt?: Date;
    completedAt?: Date;
    estimatedHours?: number;
    actualHours?: number;
    cost?: number;
    notes?: string;
}

const mockMaintenanceRequests: MaintenanceRequest[] = [
    {
        id: 'm1',
        roomId: '103',
        roomNumber: '103',
        propertyName: 'Grand Hotel Saigon',
        issueType: 'ac',
        priority: 'high',
        status: 'in_progress',
        description: 'Air conditioning not cooling properly',
        reportedBy: 'Housekeeping Staff',
        reportedAt: new Date('2024-01-14T14:20:00'),
        assignedTo: 'John Technician',
        startedAt: new Date('2024-01-15T08:00:00'),
        estimatedHours: 4,
        actualHours: 2,
        cost: 500000
    },
    {
        id: 'm2',
        roomId: 'V02',
        roomNumber: 'V02',
        propertyName: 'Ocean Resort Da Nang',
        issueType: 'plumbing',
        priority: 'urgent',
        status: 'in_progress',
        description: 'Pool maintenance and cleaning required',
        reportedBy: 'Maintenance Manager',
        reportedAt: new Date('2024-01-13T16:00:00'),
        assignedTo: 'Pool Maintenance Team',
        startedAt: new Date('2024-01-14T09:00:00'),
        estimatedHours: 8,
        actualHours: 6,
        cost: 1200000
    },
    {
        id: 'm3',
        roomId: '201',
        roomNumber: '201',
        propertyName: 'Grand Hotel Saigon',
        issueType: 'furniture',
        priority: 'medium',
        status: 'pending',
        description: 'Bed frame needs tightening',
        reportedBy: 'Guest Services',
        reportedAt: new Date('2024-01-15T10:30:00'),
        estimatedHours: 2
    }
];

export default function RoomMaintenancePage() {
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
    const [form] = Form.useForm();

    const rooms = getMockRooms();
    const properties = getMockProperties();
    const [maintenanceRequests, setMaintenanceRequests] = useState(mockMaintenanceRequests);

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

    const handleCompleteRequest = (requestId: string) => {
        Modal.confirm({
            title: 'Complete Maintenance Request',
            content: 'Mark this maintenance request as completed?',
            onOk: () => {
                setMaintenanceRequests(prev => 
                    prev.map(req => 
                        req.id === requestId 
                            ? { ...req, status: 'completed', completedAt: new Date() }
                            : req
                    )
                );
                
                // Update room status back to available if it was out of service
                const request = maintenanceRequests.find(r => r.id === requestId);
                if (request) {
                    updateRoomStatus(
                        request.roomId,
                        'operational',
                        'available',
                        'maintenance-system',
                        'Maintenance System',
                        'Maintenance completed, room back to service'
                    );
                }
                
                message.success('Maintenance request completed');
            }
        });
    };

    const handleSubmit = (values: any) => {
        try {
            const newRequest: MaintenanceRequest = {
                id: editingRequest ? editingRequest.id : `m${maintenanceRequests.length + 1}`,
                roomId: values.roomId,
                roomNumber: rooms.find(r => r.id === values.roomId)?.number || '',
                propertyName: rooms.find(r => r.id === values.roomId)?.propertyName || '',
                issueType: values.issueType,
                priority: values.priority,
                status: values.status || 'pending',
                description: values.description,
                reportedBy: values.reportedBy,
                reportedAt: values.reportedAt.toDate(),
                assignedTo: values.assignedTo,
                startedAt: values.startedAt?.toDate(),
                completedAt: values.completedAt?.toDate(),
                estimatedHours: values.estimatedHours,
                actualHours: values.actualHours,
                cost: values.cost,
                notes: values.notes
            };

            if (editingRequest) {
                setMaintenanceRequests(prev => 
                    prev.map(req => req.id === editingRequest.id ? newRequest : req)
                );
                message.success('Maintenance request updated');
            } else {
                setMaintenanceRequests(prev => [...prev, newRequest]);
                
                // Set room to out of service if high priority
                if (values.priority === 'high' || values.priority === 'urgent') {
                    updateRoomStatus(
                        values.roomId,
                        'operational',
                        'out_of_service',
                        'maintenance-system',
                        'Maintenance System',
                        `Room taken out of service for ${values.issueType} maintenance`
                    );
                }
                
                message.success('Maintenance request created');
            }
            
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to save maintenance request');
        }
    };

    const columns = [
        {
            title: 'Room',
            dataIndex: 'roomNumber',
            key: 'roomNumber',
            render: (roomNumber: string, record: MaintenanceRequest) => (
                <Space>
                    <Tag color="blue">Room {roomNumber}</Tag>
                    <Text type="secondary">{record.propertyName}</Text>
                </Space>
            ),
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRequest}>
                        New Request
                    </Button>
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
                                            Room {room.number} - {room.propertyName}
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
