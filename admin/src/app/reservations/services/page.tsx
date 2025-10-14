"use client";

import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag, Modal, Form, InputNumber, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { 
    PlusOutlined, 
    SearchOutlined,
    ShoppingOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;

interface Service {
    id: string;
    name: string;
    unit: string;
}

interface PropertyService {
    id: string;
    serviceId: string;
    serviceName: string;
    price: number;
    taxRate: number;
    currency: string;
}

interface ReservationService {
    id: string;
    reservationId: string;
    reservationCode: string;
    guestName: string;
    propertyServiceId: string;
    serviceName: string;
    quantity: number;
    totalPrice: number;
    dateProvided: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [propertyServices, setPropertyServices] = useState<PropertyService[]>([]);
    const [reservationServices, setReservationServices] = useState<ReservationService[]>([]);
    const [filteredServices, setFilteredServices] = useState<ReservationService[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<ReservationService | null>(null);
    const [form] = Form.useForm();
    const router = useRouter();

    useEffect(() => {
        fetchServices();
        fetchPropertyServices();
        fetchReservationServices();
    }, []);

    const fetchServices = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/services?limit=1000`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const result = await response.json();
                setServices(result.data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchPropertyServices = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        try {
            const response = await fetch(
                `${API_ENDPOINT}/property-services?propertyId=${propertyId}&limit=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const data = result.data.map((ps: any) => ({
                    id: ps.id,
                    serviceId: ps.serviceId,
                    serviceName: ps.service?.name || '',
                    price: parseFloat(ps.price),
                    taxRate: parseFloat(ps.taxRate),
                    currency: ps.currency,
                }));
                setPropertyServices(data);
            }
        } catch (error) {
            console.error('Error fetching property services:', error);
        }
    };

    const fetchReservationServices = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        setLoading(true);
        
        try {
            // Fetch all reservation services (you might need to filter by property)
            const response = await fetch(
                `${API_ENDPOINT}/reservation-services?limit=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const data = result.data.map((rs: any) => ({
                    id: rs.id,
                    reservationId: rs.reservationId,
                    reservationCode: rs.reservation?.confirmationCode || '',
                    guestName: rs.reservation?.guest?.name || '',
                    propertyServiceId: rs.propertyServiceId,
                    serviceName: rs.propertyService?.service?.name || '',
                    quantity: parseFloat(rs.quantity),
                    totalPrice: parseFloat(rs.totalPrice),
                    dateProvided: rs.dateProvided,
                }));
                setReservationServices(data);
                setFilteredServices(data);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error loading services');
            }
        } catch (error) {
            console.error('Error fetching reservation services:', error);
            message.error('Error loading services');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/reservation-services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                message.success('Service deleted successfully!');
                fetchReservationServices();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error deleting service!');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            message.error('Error deleting service!');
        }
    };

    const showEditModal = (service: ReservationService) => {
        setEditingService(service);
        form.setFieldsValue({
            propertyServiceId: service.propertyServiceId,
            quantity: service.quantity,
            dateProvided: dayjs(service.dateProvided),
        });
        setModalVisible(true);
    };

    const handleSaveService = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const propertyService = propertyServices.find(ps => ps.id === values.propertyServiceId);
            if (!propertyService) {
                message.error('Invalid service selected');
                return;
            }

            const totalPrice = propertyService.price * values.quantity * (1 + propertyService.taxRate / 100);

            const payload = {
                propertyServiceId: values.propertyServiceId,
                quantity: values.quantity,
                totalPrice: totalPrice,
                dateProvided: values.dateProvided.format('YYYY-MM-DD'),
            };

            const url = editingService
                ? `${API_ENDPOINT}/reservation-services/${editingService.id}`
                : `${API_ENDPOINT}/reservation-services`;
            
            const method = editingService ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success(`Service ${editingService ? 'updated' : 'added'} successfully!`);
                setModalVisible(false);
                setEditingService(null);
                form.resetFields();
                fetchReservationServices();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || `Error ${editingService ? 'updating' : 'adding'} service!`);
            }
        } catch (error) {
            console.error('Error saving service:', error);
            message.error('Error saving service!');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = reservationServices.filter(service =>
            service.reservationCode?.toLowerCase().includes(value.toLowerCase()) ||
            service.guestName?.toLowerCase().includes(value.toLowerCase()) ||
            service.serviceName?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredServices(filtered);
    };

    const columns = [
        {
            title: 'Date Provided',
            dataIndex: 'dateProvided',
            key: 'dateProvided',
            width: 120,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a: ReservationService, b: ReservationService) => 
                dayjs(a.dateProvided).unix() - dayjs(b.dateProvided).unix(),
        },
        {
            title: 'Reservation',
            dataIndex: 'reservationCode',
            key: 'reservationCode',
            width: 150,
            render: (code: string, record: ReservationService) => (
                <Button
                    type="link"
                    onClick={() => router.push(`/reservations/${record.reservationId}`)}
                >
                    {code}
                </Button>
            ),
        },
        {
            title: 'Guest',
            dataIndex: 'guestName',
            key: 'guestName',
            width: 150,
        },
        {
            title: 'Service',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: 200,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            render: (qty: number) => <Text>{qty.toFixed(2)}</Text>,
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 120,
            render: (price: number) => <Text strong>{price.toFixed(2)}</Text>,
            sorter: (a: ReservationService, b: ReservationService) => a.totalPrice - b.totalPrice,
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 200,
            render: (record: ReservationService) => (
                <Space size="small">
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
                                title: 'Delete Service',
                                content: 'Are you sure you want to delete this service?',
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
                            <ShoppingOutlined /> Reservation Services
                        </Title>
                    </Col>
                </Row>

                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search by reservation, guest, service..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredServices}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1100 }}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} services`,
                    }}
                    summary={(pageData) => {
                        const total = pageData.reduce((sum, record) => sum + record.totalPrice, 0);
                        return (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={5}>
                                        <Text strong>Total</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>
                                        <Text strong style={{ fontSize: 16 }}>{total.toFixed(2)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6} />
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />
            </Card>

            {/* Add/Edit Service Modal */}
            <Modal
                title={editingService ? 'Edit Service' : 'Add Service'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingService(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSaveService}
                    layout="vertical"
                >
                    <Form.Item
                        label="Service"
                        name="propertyServiceId"
                        rules={[{ required: true, message: 'Please select a service!' }]}
                    >
                        <Select
                            placeholder="Select service"
                            showSearch
                            optionFilterProp="children"
                        >
                            {propertyServices.map(ps => (
                                <Select.Option key={ps.id} value={ps.id}>
                                    {ps.serviceName} - {ps.price.toFixed(2)} {ps.currency}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[
                            { required: true, message: 'Please enter quantity!' },
                            { type: 'number', min: 0.01, message: 'Quantity must be greater than 0!' }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0.01}
                            precision={2}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="Date Provided"
                        name="dateProvided"
                        rules={[{ required: true, message: 'Please select date!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingService ? 'Update' : 'Add'} Service
                            </Button>
                            <Button onClick={() => {
                                setModalVisible(false);
                                setEditingService(null);
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
