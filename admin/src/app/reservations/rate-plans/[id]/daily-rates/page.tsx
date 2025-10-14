"use client";

import { Space, Table, message, Button, Card, Row, Col, Typography, Modal, Form, InputNumber, DatePicker, Switch, Statistic } from "antd";
import { useState, useEffect } from "react";
import { 
    PlusOutlined, 
    ArrowLeftOutlined,
    DollarOutlined,
    EditOutlined,
    DeleteOutlined,
    StopOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface RatePlan {
    id: string;
    name: string;
    roomTypeName: string;
    currency: string;
}

interface DailyRate {
    id: string;
    ratePlanId: string;
    date: string;
    price: number;
    availableRooms: number;
    stopSell: boolean;
}

export default function DailyRatesPage() {
    const params = useParams();
    const router = useRouter();
    const [ratePlan, setRatePlan] = useState<RatePlan | null>(null);
    const [dailyRates, setDailyRates] = useState<DailyRate[]>([]);
    const [filteredRates, setFilteredRates] = useState<DailyRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [bulkModalVisible, setBulkModalVisible] = useState(false);
    const [editingRate, setEditingRate] = useState<DailyRate | null>(null);
    const [form] = Form.useForm();
    const [bulkForm] = Form.useForm();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs(),
        dayjs().add(30, 'days')
    ]);

    useEffect(() => {
        if (params.id) {
            fetchRatePlan(params.id as string);
            fetchDailyRates(params.id as string);
        }
    }, [params.id]);

    const fetchRatePlan = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/rate-plans/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.data;
                setRatePlan({
                    id: data.id,
                    name: data.name,
                    roomTypeName: data.roomType?.name || '',
                    currency: data.currency,
                });
            } else {
                message.error('Error loading rate plan');
                router.push('/reservations/rate-plans');
            }
        } catch (error) {
            console.error('Error fetching rate plan:', error);
            message.error('Error loading rate plan');
        }
    };

    const fetchDailyRates = async (ratePlanId: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        setLoading(true);
        
        try {
            const response = await fetch(
                `${API_ENDPOINT}/rate-plans/${ratePlanId}/daily-rates`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const ratesData = result.data.map((dr: any) => ({
                    id: dr.id,
                    ratePlanId: dr.ratePlanId,
                    date: dr.date,
                    price: parseFloat(dr.price),
                    availableRooms: dr.availableRooms,
                    stopSell: dr.stopSell,
                }));

                setDailyRates(ratesData);
                filterRatesByDateRange(ratesData, dateRange);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error loading daily rates');
            }
        } catch (error) {
            console.error('Error fetching daily rates:', error);
            message.error('Error loading daily rates');
        } finally {
            setLoading(false);
        }
    };

    const filterRatesByDateRange = (rates: DailyRate[], range: [dayjs.Dayjs, dayjs.Dayjs]) => {
        const filtered = rates.filter(rate => {
            const rateDate = dayjs(rate.date);
            return rateDate.isAfter(range[0].subtract(1, 'day')) && rateDate.isBefore(range[1].add(1, 'day'));
        });
        setFilteredRates(filtered);
    };

    const handleDateRangeChange = (dates: any) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange(dates);
            filterRatesByDateRange(dailyRates, dates);
        }
    };

    const handleDelete = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/daily-rates/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                message.success('Daily rate deleted successfully!');
                fetchDailyRates(params.id as string);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error deleting daily rate!');
            }
        } catch (error) {
            console.error('Error deleting daily rate:', error);
            message.error('Error deleting daily rate!');
        }
    };

    const showEditModal = (rate: DailyRate) => {
        setEditingRate(rate);
        form.setFieldsValue({
            date: dayjs(rate.date),
            price: rate.price,
            availableRooms: rate.availableRooms,
            stopSell: rate.stopSell,
        });
        setModalVisible(true);
    };

    const showCreateModal = () => {
        setEditingRate(null);
        form.resetFields();
        form.setFieldsValue({
            date: dayjs(),
            stopSell: false,
        });
        setModalVisible(true);
    };

    const showBulkModal = () => {
        bulkForm.resetFields();
        bulkForm.setFieldsValue({
            dateRange: [dayjs(), dayjs().add(30, 'days')],
            stopSell: false,
        });
        setBulkModalVisible(true);
    };

    const handleSaveDailyRate = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const payload = {
                ratePlanId: params.id,
                date: values.date.format('YYYY-MM-DD'),
                price: values.price,
                availableRooms: values.availableRooms,
                stopSell: values.stopSell,
            };

            const url = editingRate
                ? `${API_ENDPOINT}/daily-rates/${editingRate.id}`
                : `${API_ENDPOINT}/daily-rates`;
            
            const method = editingRate ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success(`Daily rate ${editingRate ? 'updated' : 'created'} successfully!`);
                setModalVisible(false);
                setEditingRate(null);
                form.resetFields();
                fetchDailyRates(params.id as string);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || `Error ${editingRate ? 'updating' : 'creating'} daily rate!`);
            }
        } catch (error) {
            console.error('Error saving daily rate:', error);
            message.error('Error saving daily rate!');
        }
    };

    const handleBulkCreate = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const startDate = values.dateRange[0];
            const endDate = values.dateRange[1];
            const days = endDate.diff(startDate, 'days') + 1;
            
            const promises = [];
            for (let i = 0; i < days; i++) {
                const date = startDate.add(i, 'days').format('YYYY-MM-DD');
                const payload = {
                    ratePlanId: params.id,
                    date,
                    price: values.price,
                    availableRooms: values.availableRooms,
                    stopSell: values.stopSell,
                };
                
                promises.push(
                    fetch(`${API_ENDPOINT}/daily-rates`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    })
                );
            }

            await Promise.all(promises);
            message.success(`Created ${days} daily rates successfully!`);
            setBulkModalVisible(false);
            bulkForm.resetFields();
            fetchDailyRates(params.id as string);
        } catch (error) {
            console.error('Error creating bulk daily rates:', error);
            message.error('Error creating bulk daily rates!');
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (date: string) => {
                const d = dayjs(date);
                const isWeekend = d.day() === 0 || d.day() === 6;
                return (
                    <Text strong={isWeekend} style={{ color: isWeekend ? '#1890ff' : undefined }}>
                        {d.format('DD/MM/YYYY')}
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {d.format('dddd')}
                        </Text>
                    </Text>
                );
            },
            sorter: (a: DailyRate, b: DailyRate) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => (
                <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                    {price.toFixed(2)} {ratePlan?.currency}
                </Text>
            ),
            sorter: (a: DailyRate, b: DailyRate) => a.price - b.price,
        },
        {
            title: 'Available Rooms',
            dataIndex: 'availableRooms',
            key: 'availableRooms',
            width: 150,
            render: (rooms: number) => rooms !== null ? rooms : <Text type="secondary">Unlimited</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'stopSell',
            key: 'stopSell',
            width: 120,
            render: (stopSell: boolean) => (
                stopSell ? (
                    <Space>
                        <StopOutlined style={{ color: '#ff4d4f' }} />
                        <Text type="danger">Stop Sell</Text>
                    </Space>
                ) : (
                    <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text type="success">Available</Text>
                    </Space>
                )
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 150,
            render: (record: DailyRate) => (
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
                                title: 'Delete Daily Rate',
                                content: 'Are you sure you want to delete this daily rate?',
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

    const avgPrice = filteredRates.length > 0 
        ? filteredRates.reduce((sum, r) => sum + r.price, 0) / filteredRates.length 
        : 0;
    const stopSellCount = filteredRates.filter(r => r.stopSell).length;

    return (
        <div>
            {ratePlan && (
                <Card style={{ marginBottom: 16 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>
                                {ratePlan.name} - {ratePlan.roomTypeName}
                            </Title>
                        </Col>
                        <Col>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push('/reservations/rate-plans')}
                            >
                                Back to Rate Plans
                            </Button>
                        </Col>
                    </Row>
                </Card>
            )}

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Days"
                            value={filteredRates.length}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Average Price"
                            value={avgPrice}
                            precision={2}
                            prefix={<DollarOutlined />}
                            suffix={ratePlan?.currency}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Stop Sell Days"
                            value={stopSellCount}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Available Days"
                            value={filteredRates.length - stopSellCount}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            <DollarOutlined /> Daily Rates
                        </Title>
                    </Col>
                    <Col>
                        <Space>
                            <RangePicker
                                value={dateRange}
                                format="DD/MM/YYYY"
                                onChange={handleDateRangeChange}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={showBulkModal}
                            >
                                Bulk Create
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showCreateModal}
                            >
                                Add Single Rate
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredRates}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 31,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} days`,
                    }}
                />
            </Card>

            {/* Add/Edit Daily Rate Modal */}
            <Modal
                title={editingRate ? 'Edit Daily Rate' : 'Add Daily Rate'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingRate(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSaveDailyRate}
                    layout="vertical"
                >
                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select date!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label={`Price (${ratePlan?.currency})`}
                        name="price"
                        rules={[
                            { required: true, message: 'Please enter price!' },
                            { type: 'number', min: 0.01, message: 'Price must be greater than 0!' }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            addonAfter={ratePlan?.currency}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="Available Rooms"
                        name="availableRooms"
                        tooltip="Leave empty for unlimited availability"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Optional - unlimited if empty"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Stop Sell"
                        name="stopSell"
                        valuePropName="checked"
                        tooltip="When enabled, this rate cannot be booked"
                    >
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingRate ? 'Update' : 'Add'} Rate
                            </Button>
                            <Button onClick={() => {
                                setModalVisible(false);
                                setEditingRate(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Bulk Create Modal */}
            <Modal
                title="Bulk Create Daily Rates"
                open={bulkModalVisible}
                onCancel={() => {
                    setBulkModalVisible(false);
                    bulkForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={bulkForm}
                    onFinish={handleBulkCreate}
                    layout="vertical"
                >
                    <Form.Item
                        label="Date Range"
                        name="dateRange"
                        rules={[{ required: true, message: 'Please select date range!' }]}
                    >
                        <RangePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label={`Price (${ratePlan?.currency})`}
                        name="price"
                        rules={[
                            { required: true, message: 'Please enter price!' },
                            { type: 'number', min: 0.01, message: 'Price must be greater than 0!' }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            addonAfter={ratePlan?.currency}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="Available Rooms"
                        name="availableRooms"
                        tooltip="Leave empty for unlimited availability"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Optional - unlimited if empty"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Stop Sell"
                        name="stopSell"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Create Rates
                            </Button>
                            <Button onClick={() => {
                                setBulkModalVisible(false);
                                bulkForm.resetFields();
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
