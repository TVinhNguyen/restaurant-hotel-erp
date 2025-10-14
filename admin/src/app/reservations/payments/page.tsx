"use client";

import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag, DatePicker, Statistic, Modal, Form, InputNumber } from "antd";
import { useState, useEffect } from "react";
import { 
    PlusOutlined, 
    SearchOutlined, 
    DollarOutlined,
    SyncOutlined,
    UndoOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Payment {
    id: string;
    reservationId: string;
    reservationCode: string;
    guestName: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    transactionId: string;
    paidAt: string;
    notes: string;
}

const statusColors = {
    authorized: 'orange',
    captured: 'green',
    refunded: 'purple',
    voided: 'red',
};

const methodColors = {
    cash: 'green',
    card: 'blue',
    bank: 'cyan',
    e_wallet: 'purple',
    ota_virtual: 'orange',
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
    const [loading, setLoading] = useState(true);
    const [refundModalVisible, setRefundModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [form] = Form.useForm();
    const [stats, setStats] = useState({
        total: 0,
        totalAmount: 0,
        captured: 0,
        refunded: 0,
    });
    const router = useRouter();

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [filteredPayments]);

    const fetchPayments = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const selectedPropertyId = localStorage.getItem('selectedPropertyId');
        
        if (!selectedPropertyId) {
            message.warning('Please select a property first');
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch(
                `${API_ENDPOINT}/payments?limit=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const paymentsData = result.data.map((p: any) => ({
                    id: p.id,
                    reservationId: p.reservationId,
                    reservationCode: p.reservation?.confirmationCode || '',
                    guestName: p.reservation?.guest?.name || '',
                    amount: parseFloat(p.amount),
                    currency: p.currency,
                    method: p.method,
                    status: p.status,
                    transactionId: p.transactionId,
                    paidAt: p.paidAt,
                    notes: p.notes,
                }));

                setPayments(paymentsData);
                setFilteredPayments(paymentsData);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error loading payments');
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            message.error('Error loading payments');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const total = filteredPayments.length;
        const totalAmount = filteredPayments
            .filter(p => p.status === 'captured')
            .reduce((sum, p) => sum + p.amount, 0);
        const captured = filteredPayments.filter(p => p.status === 'captured').length;
        const refunded = filteredPayments.filter(p => p.status === 'refunded').length;

        setStats({ total, totalAmount, captured, refunded });
    };

    const handleRefund = async (values: any) => {
        if (!selectedPayment) return;

        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/payments/${selectedPayment.id}/refund`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: values.amount,
                    reason: values.reason,
                }),
            });

            if (response.ok) {
                message.success('Payment refunded successfully!');
                setRefundModalVisible(false);
                setSelectedPayment(null);
                form.resetFields();
                fetchPayments();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error processing refund!');
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            message.error('Error processing refund!');
        }
    };

    const showRefundModal = (payment: Payment) => {
        setSelectedPayment(payment);
        form.setFieldsValue({ amount: payment.amount });
        setRefundModalVisible(true);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        applyFilters(value, statusFilter, methodFilter, dateRange);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        applyFilters(searchText, value, methodFilter, dateRange);
    };

    const handleMethodFilter = (value: string) => {
        setMethodFilter(value);
        applyFilters(searchText, statusFilter, value, dateRange);
    };

    const handleDateRangeChange = (dates: any) => {
        setDateRange(dates);
        applyFilters(searchText, statusFilter, methodFilter, dates);
    };

    const applyFilters = (
        search: string,
        status: string,
        method: string,
        dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]
    ) => {
        let filtered = payments;

        if (search) {
            filtered = filtered.filter(payment =>
                payment.reservationCode?.toLowerCase().includes(search.toLowerCase()) ||
                payment.guestName?.toLowerCase().includes(search.toLowerCase()) ||
                payment.transactionId?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (status !== 'all') {
            filtered = filtered.filter(payment => payment.status === status);
        }

        if (method !== 'all') {
            filtered = filtered.filter(payment => payment.method === method);
        }

        if (dates && dates[0] && dates[1]) {
            filtered = filtered.filter(payment => {
                const paidAt = dayjs(payment.paidAt);
                return paidAt.isAfter(dates[0]) && paidAt.isBefore(dates[1]);
            });
        }

        setFilteredPayments(filtered);
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'paidAt',
            key: 'paidAt',
            width: 150,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a: Payment, b: Payment) => dayjs(a.paidAt).unix() - dayjs(b.paidAt).unix(),
        },
        {
            title: 'Reservation',
            dataIndex: 'reservationCode',
            key: 'reservationCode',
            width: 150,
            render: (code: string, record: Payment) => (
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
            title: 'Amount',
            key: 'amount',
            width: 120,
            render: (record: Payment) => (
                <Text strong>
                    {record.amount.toFixed(2)} {record.currency}
                </Text>
            ),
            sorter: (a: Payment, b: Payment) => a.amount - b.amount,
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 120,
            render: (method: string) => (
                <Tag color={methodColors[method as keyof typeof methodColors]}>
                    {method?.toUpperCase().replace('_', ' ')}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={statusColors[status as keyof typeof statusColors]}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Transaction ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
            width: 150,
            render: (text: string) => text || <Text type="secondary">-</Text>,
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
            render: (text: string) => text || <Text type="secondary">-</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 150,
            render: (record: Payment) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        onClick={() => router.push(`/reservations/${record.reservationId}`)}
                    >
                        View Reservation
                    </Button>
                    {record.status === 'captured' && (
                        <Button
                            type="link"
                            danger
                            size="small"
                            icon={<UndoOutlined />}
                            onClick={() => showRefundModal(record)}
                        >
                            Refund
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Payments"
                            value={stats.total}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Amount"
                            value={stats.totalAmount}
                            precision={2}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Captured"
                            value={stats.captured}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Refunded"
                            value={stats.refunded}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            <DollarOutlined /> Payments Management
                        </Title>
                    </Col>
                    <Col>
                        <Button
                            icon={<SyncOutlined />}
                            onClick={fetchPayments}
                        >
                            Refresh
                        </Button>
                    </Col>
                </Row>

                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search by code, guest, transaction..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <RangePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            onChange={handleDateRangeChange}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={5}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Status"
                            value={statusFilter}
                            onChange={handleStatusFilter}
                        >
                            <Select.Option value="all">All Status</Select.Option>
                            <Select.Option value="authorized">Authorized</Select.Option>
                            <Select.Option value="captured">Captured</Select.Option>
                            <Select.Option value="refunded">Refunded</Select.Option>
                            <Select.Option value="voided">Voided</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={5}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Method"
                            value={methodFilter}
                            onChange={handleMethodFilter}
                        >
                            <Select.Option value="all">All Methods</Select.Option>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="card">Card</Select.Option>
                            <Select.Option value="bank">Bank</Select.Option>
                            <Select.Option value="e_wallet">E-Wallet</Select.Option>
                            <Select.Option value="ota_virtual">OTA Virtual</Select.Option>
                        </Select>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredPayments}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1400 }}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} payments`,
                    }}
                />
            </Card>

            {/* Refund Modal */}
            <Modal
                title="Process Refund"
                open={refundModalVisible}
                onCancel={() => {
                    setRefundModalVisible(false);
                    setSelectedPayment(null);
                    form.resetFields();
                }}
                footer={null}
            >
                {selectedPayment && (
                    <>
                        <Card style={{ marginBottom: 16, backgroundColor: '#f0f2f5' }}>
                            <Text>Reservation: <Text strong>{selectedPayment.reservationCode}</Text></Text>
                            <br />
                            <Text>Guest: <Text strong>{selectedPayment.guestName}</Text></Text>
                            <br />
                            <Text>Original Amount: <Text strong>{selectedPayment.amount.toFixed(2)} {selectedPayment.currency}</Text></Text>
                        </Card>

                        <Form
                            form={form}
                            onFinish={handleRefund}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Refund Amount"
                                name="amount"
                                rules={[
                                    { required: true, message: 'Please enter refund amount!' },
                                    { type: 'number', min: 0.01, message: 'Amount must be greater than 0!' },
                                    { 
                                        validator: (_, value) => {
                                            if (value && selectedPayment && value > selectedPayment.amount) {
                                                return Promise.reject('Refund amount cannot exceed payment amount!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    precision={2}
                                    addonAfter={selectedPayment.currency}
                                />
                            </Form.Item>
                            
                            <Form.Item
                                label="Reason"
                                name="reason"
                                rules={[{ required: true, message: 'Please provide a reason!' }]}
                            >
                                <TextArea rows={3} placeholder="Reason for refund..." />
                            </Form.Item>
                            
                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        danger
                                        htmlType="submit"
                                        icon={<UndoOutlined />}
                                    >
                                        Process Refund
                                    </Button>
                                    <Button onClick={() => {
                                        setRefundModalVisible(false);
                                        setSelectedPayment(null);
                                        form.resetFields();
                                    }}>
                                        Cancel
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>
        </div>
    );
}
