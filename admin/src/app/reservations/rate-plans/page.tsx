"use client";

import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag, Modal, Form, InputNumber, Switch } from "antd";
import { useState, useEffect } from "react";
import { 
    PlusOutlined, 
    SearchOutlined,
    DollarOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

interface RoomType {
    id: string;
    name: string;
}

interface RatePlan {
    id: string;
    propertyId: string;
    roomTypeId: string;
    roomTypeName: string;
    name: string;
    cancellationPolicy: string;
    currency: string;
    minStay: number;
    maxStay: number;
    isRefundable: boolean;
}

export default function RatePlansPage() {
    const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
    const [filteredRatePlans, setFilteredRatePlans] = useState<RatePlan[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [searchText, setSearchText] = useState('');
    const [roomTypeFilter, setRoomTypeFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRatePlan, setEditingRatePlan] = useState<RatePlan | null>(null);
    const [form] = Form.useForm();
    const router = useRouter();

    useEffect(() => {
        fetchRoomTypes();
        fetchRatePlans();
    }, []);

    const fetchRoomTypes = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        try {
            const response = await fetch(`${API_ENDPOINT}/room-types?propertyId=${propertyId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                const result = await response.json();
                setRoomTypes(result.data);
            }
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

    const fetchRatePlans = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        if (!propertyId) {
            message.warning('Please select a property first');
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch(
                `${API_ENDPOINT}/rate-plans?propertyId=${propertyId}&limit=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const ratePlansData = result.data.map((rp: any) => ({
                    id: rp.id,
                    propertyId: rp.propertyId,
                    roomTypeId: rp.roomTypeId,
                    roomTypeName: rp.roomType?.name || '',
                    name: rp.name,
                    cancellationPolicy: rp.cancellationPolicy,
                    currency: rp.currency,
                    minStay: rp.minStay,
                    maxStay: rp.maxStay,
                    isRefundable: rp.isRefundable,
                }));

                setRatePlans(ratePlansData);
                setFilteredRatePlans(ratePlansData);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error loading rate plans');
            }
        } catch (error) {
            console.error('Error fetching rate plans:', error);
            message.error('Error loading rate plans');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/rate-plans/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                message.success('Rate plan deleted successfully!');
                fetchRatePlans();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error deleting rate plan!');
            }
        } catch (error) {
            console.error('Error deleting rate plan:', error);
            message.error('Error deleting rate plan!');
        }
    };

    const showEditModal = (ratePlan: RatePlan) => {
        setEditingRatePlan(ratePlan);
        form.setFieldsValue({
            roomTypeId: ratePlan.roomTypeId,
            name: ratePlan.name,
            cancellationPolicy: ratePlan.cancellationPolicy,
            currency: ratePlan.currency,
            minStay: ratePlan.minStay,
            maxStay: ratePlan.maxStay,
            isRefundable: ratePlan.isRefundable,
        });
        setModalVisible(true);
    };

    const showCreateModal = () => {
        setEditingRatePlan(null);
        form.resetFields();
        form.setFieldsValue({
            currency: 'USD',
            isRefundable: true,
            minStay: 1,
        });
        setModalVisible(true);
    };

    const handleSaveRatePlan = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        try {
            const payload = {
                propertyId,
                roomTypeId: values.roomTypeId,
                name: values.name,
                cancellationPolicy: values.cancellationPolicy,
                currency: values.currency,
                minStay: values.minStay,
                maxStay: values.maxStay,
                isRefundable: values.isRefundable,
            };

            const url = editingRatePlan
                ? `${API_ENDPOINT}/rate-plans/${editingRatePlan.id}`
                : `${API_ENDPOINT}/rate-plans`;
            
            const method = editingRatePlan ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success(`Rate plan ${editingRatePlan ? 'updated' : 'created'} successfully!`);
                setModalVisible(false);
                setEditingRatePlan(null);
                form.resetFields();
                fetchRatePlans();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || `Error ${editingRatePlan ? 'updating' : 'creating'} rate plan!`);
            }
        } catch (error) {
            console.error('Error saving rate plan:', error);
            message.error('Error saving rate plan!');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        applyFilters(value, roomTypeFilter);
    };

    const handleRoomTypeFilter = (value: string) => {
        setRoomTypeFilter(value);
        applyFilters(searchText, value);
    };

    const applyFilters = (search: string, roomType: string) => {
        let filtered = ratePlans;

        if (search) {
            filtered = filtered.filter(rp =>
                rp.name?.toLowerCase().includes(search.toLowerCase()) ||
                rp.roomTypeName?.toLowerCase().includes(search.toLowerCase()) ||
                rp.cancellationPolicy?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roomType !== 'all') {
            filtered = filtered.filter(rp => rp.roomTypeId === roomType);
        }

        setFilteredRatePlans(filtered);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Room Type',
            dataIndex: 'roomTypeName',
            key: 'roomTypeName',
            width: 150,
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
            width: 100,
            render: (currency: string) => <Tag color="blue">{currency}</Tag>,
        },
        {
            title: 'Stay Requirements',
            key: 'stay',
            width: 150,
            render: (record: RatePlan) => (
                <div>
                    <Text type="secondary">Min: {record.minStay || 1} night(s)</Text>
                    <br />
                    {record.maxStay && <Text type="secondary">Max: {record.maxStay} night(s)</Text>}
                </div>
            ),
        },
        {
            title: 'Refundable',
            dataIndex: 'isRefundable',
            key: 'isRefundable',
            width: 120,
            render: (isRefundable: boolean) => (
                <Tag color={isRefundable ? 'green' : 'red'}>
                    {isRefundable ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        {
            title: 'Cancellation Policy',
            dataIndex: 'cancellationPolicy',
            key: 'cancellationPolicy',
            ellipsis: true,
            render: (text: string) => text || <Text type="secondary">-</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 250,
            render: (record: RatePlan) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<CalendarOutlined />}
                        onClick={() => router.push(`/reservations/rate-plans/${record.id}/daily-rates`)}
                    >
                        Daily Rates
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            Modal.confirm({
                                title: 'Delete Rate Plan',
                                content: 'Are you sure you want to delete this rate plan?',
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk: () => handleDelete(record.id),
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
        <div>
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            <DollarOutlined /> Rate Plans Management
                        </Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showCreateModal}
                        >
                            New Rate Plan
                        </Button>
                    </Col>
                </Row>

                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search by name, room type..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Room Type"
                            value={roomTypeFilter}
                            onChange={handleRoomTypeFilter}
                        >
                            <Select.Option value="all">All Room Types</Select.Option>
                            {roomTypes.map(rt => (
                                <Select.Option key={rt.id} value={rt.id}>{rt.name}</Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredRatePlans}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1200 }}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} rate plans`,
                    }}
                />
            </Card>

            {/* Add/Edit Rate Plan Modal */}
            <Modal
                title={editingRatePlan ? 'Edit Rate Plan' : 'Create Rate Plan'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingRatePlan(null);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    onFinish={handleSaveRatePlan}
                    layout="vertical"
                >
                    <Form.Item
                        label="Rate Plan Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter rate plan name!' }]}
                    >
                        <Input placeholder="e.g., Standard Rate, Early Bird, Last Minute" />
                    </Form.Item>
                    
                    <Form.Item
                        label="Room Type"
                        name="roomTypeId"
                        rules={[{ required: true, message: 'Please select room type!' }]}
                    >
                        <Select
                            placeholder="Select room type"
                            showSearch
                            optionFilterProp="children"
                        >
                            {roomTypes.map(rt => (
                                <Select.Option key={rt.id} value={rt.id}>
                                    {rt.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Currency"
                                name="currency"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="USD">USD</Select.Option>
                                    <Select.Option value="EUR">EUR</Select.Option>
                                    <Select.Option value="GBP">GBP</Select.Option>
                                    <Select.Option value="VND">VND</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Refundable"
                                name="isRefundable"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Yes" unCheckedChildren="No" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Minimum Stay (nights)"
                                name="minStay"
                                rules={[{ required: true, type: 'number', min: 1 }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Maximum Stay (nights)"
                                name="maxStay"
                                rules={[
                                    { type: 'number', min: 1 },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const minStay = getFieldValue('minStay');
                                            if (!value || !minStay || value >= minStay) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Max stay must be >= min stay!'));
                                        },
                                    }),
                                ]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="Optional" />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item
                        label="Cancellation Policy"
                        name="cancellationPolicy"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Describe the cancellation policy for this rate plan..."
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingRatePlan ? 'Update' : 'Create'} Rate Plan
                            </Button>
                            <Button onClick={() => {
                                setModalVisible(false);
                                setEditingRatePlan(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
