"use client";

import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag, DatePicker, Statistic } from "antd";
import { useState, useEffect } from "react";
import { 
    PlusOutlined, 
    SearchOutlined, 
    CalendarOutlined, 
    DollarOutlined,
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExportOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Reservation {
    id: string;
    propertyId: string;
    propertyName: string;
    guestId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomTypeId: string;
    roomTypeName: string;
    assignedRoomId: string | null;
    assignedRoomNumber: string | null;
    ratePlanId: string;
    ratePlanName: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    confirmationCode: string;
    channel: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    taxAmount: number;
    discountAmount: number;
    serviceAmount: number;
    amountPaid: number;
    currency: string;
    guestNotes: string;
    createdAt: string;
    updatedAt: string;
}

const statusColors = {
    pending: 'orange',
    confirmed: 'blue',
    checked_in: 'green',
    checked_out: 'default',
    cancelled: 'red',
    no_show: 'red',
};

const paymentStatusColors = {
    unpaid: 'red',
    partial: 'orange',
    paid: 'green',
    refunded: 'purple',
};

const channelColors = {
    ota: 'blue',
    website: 'green',
    walkin: 'orange',
    phone: 'purple',
};

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [channelFilter, setChannelFilter] = useState('all');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchReservations();
    }, []); // Only run once on mount

    const fetchReservations = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const selectedPropertyId = localStorage.getItem('selectedPropertyId');
        
        if (!selectedPropertyId) {
            message.warning('Please select a property first');
            setLoading(false);
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch(
                `${API_ENDPOINT}/reservations?propertyId=${selectedPropertyId}&limit=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const reservationsData = result.data.map((r: any) => ({
                    id: r.id,
                    propertyId: r.propertyId,
                    propertyName: r.property?.name || '',
                    guestId: r.guestId,
                    guestName: r.guest?.name || '',
                    guestEmail: r.guest?.email || '',
                    guestPhone: r.guest?.phone || '',
                    roomTypeId: r.roomTypeId,
                    roomTypeName: r.roomType?.name || '',
                    assignedRoomId: r.assignedRoomId,
                    assignedRoomNumber: r.assignedRoom?.number || null,
                    ratePlanId: r.ratePlanId,
                    ratePlanName: r.ratePlan?.name || '',
                    checkIn: r.checkIn,
                    checkOut: r.checkOut,
                    adults: r.adults,
                    children: r.children,
                    contactName: r.contactName,
                    contactEmail: r.contactEmail,
                    contactPhone: r.contactPhone,
                    confirmationCode: r.confirmationCode,
                    channel: r.channel,
                    status: r.status,
                    paymentStatus: r.paymentStatus,
                    totalAmount: parseFloat(r.totalAmount),
                    taxAmount: parseFloat(r.taxAmount),
                    discountAmount: parseFloat(r.discountAmount),
                    serviceAmount: parseFloat(r.serviceAmount),
                    amountPaid: parseFloat(r.amountPaid),
                    currency: r.currency,
                    guestNotes: r.guestNotes,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                }));

                setReservations(reservationsData);
                setFilteredReservations(reservationsData);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error loading reservations');
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            message.error('Error loading reservations');
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats directly - no useEffect needed
    const stats = {
        total: filteredReservations.length,
        pending: filteredReservations.filter(r => r.status === 'pending').length,
        confirmed: filteredReservations.filter(r => r.status === 'confirmed').length,
        checkedIn: filteredReservations.filter(r => r.status === 'checked_in').length,
        totalRevenue: filteredReservations.reduce((sum, r) => sum + r.totalAmount, 0),
        unpaidAmount: filteredReservations
            .filter(r => r.paymentStatus !== 'paid' && r.status !== 'cancelled')
            .reduce((sum, r) => sum + (r.totalAmount - r.amountPaid), 0)
    };

    const handleDelete = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                message.success('Reservation deleted successfully!');
                const updated = reservations.filter(r => r.id !== id);
                setReservations(updated);
                setFilteredReservations(updated);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error deleting reservation!');
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
            message.error('Error deleting reservation!');
        }
    };

    const handleCheckIn = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${id}/checkin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                message.success('Check-in successful!');
                fetchReservations();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error during check-in!');
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            message.error('Error during check-in!');
        }
    };

    const handleCheckOut = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${id}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                message.success('Check-out successful!');
                fetchReservations();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error during check-out!');
            }
        } catch (error) {
            console.error('Error during check-out:', error);
            message.error('Error during check-out!');
        }
    };

    const handleCancel = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                message.success('Reservation cancelled successfully!');
                fetchReservations();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error cancelling reservation!');
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            message.error('Error cancelling reservation!');
        }
    };

    // Simple handlers - just update state
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
    };

    const handlePaymentStatusFilter = (value: string) => {
        setPaymentStatusFilter(value);
    };

    const handleChannelFilter = (value: string) => {
        setChannelFilter(value);
    };

    const handleDateRangeChange = (dates: any) => {
        setDateRange(dates);
    };

    // Auto-apply filters when any dependency changes
    useEffect(() => {
        applyFilters(searchText, statusFilter, paymentStatusFilter, channelFilter, dateRange);
    }, [searchText, statusFilter, paymentStatusFilter, channelFilter, dateRange, reservations]);

    const applyFilters = (
        search: string,
        status: string,
        paymentStatus: string,
        channel: string,
        dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]
    ) => {
        let filtered = reservations;

        if (search) {
            filtered = filtered.filter(reservation =>
                reservation.confirmationCode?.toLowerCase().includes(search.toLowerCase()) ||
                reservation.guestName?.toLowerCase().includes(search.toLowerCase()) ||
                reservation.guestEmail?.toLowerCase().includes(search.toLowerCase()) ||
                reservation.guestPhone?.includes(search) ||
                reservation.contactName?.toLowerCase().includes(search.toLowerCase()) ||
                reservation.roomTypeName?.toLowerCase().includes(search.toLowerCase()) ||
                reservation.assignedRoomNumber?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (status !== 'all') {
            filtered = filtered.filter(reservation => reservation.status === status);
        }

        if (paymentStatus !== 'all') {
            filtered = filtered.filter(reservation => reservation.paymentStatus === paymentStatus);
        }

        if (channel !== 'all') {
            filtered = filtered.filter(reservation => reservation.channel === channel);
        }

        if (dates && dates[0] && dates[1]) {
            filtered = filtered.filter(reservation => {
                const checkIn = dayjs(reservation.checkIn);
                return checkIn.isAfter(dates[0]) && checkIn.isBefore(dates[1]);
            });
        }

        setFilteredReservations(filtered);
    };

    const columns = [
        {
            title: 'Confirmation Code',
            dataIndex: 'confirmationCode',
            key: 'confirmationCode',
            fixed: 'left' as const,
            width: 150,
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Guest',
            key: 'guest',
            width: 200,
            render: (record: Reservation) => (
                <div>
                    <div><Text strong>{record.guestName}</Text></div>
                    <div><Text type="secondary" style={{ fontSize: '12px' }}>{record.guestEmail}</Text></div>
                    <div><Text type="secondary" style={{ fontSize: '12px' }}>{record.guestPhone}</Text></div>
                </div>
            ),
        },
        {
            title: 'Room Type',
            dataIndex: 'roomTypeName',
            key: 'roomTypeName',
            width: 150,
        },
        {
            title: 'Assigned Room',
            dataIndex: 'assignedRoomNumber',
            key: 'assignedRoomNumber',
            width: 120,
            render: (text: string | null) => text || <Text type="secondary">Not assigned</Text>,
        },
        {
            title: 'Check-in',
            dataIndex: 'checkIn',
            key: 'checkIn',
            width: 120,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Check-out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            width: 120,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Guests',
            key: 'guests',
            width: 100,
            render: (record: Reservation) => `${record.adults}A + ${record.children}C`,
        },
        {
            title: 'Channel',
            dataIndex: 'channel',
            key: 'channel',
            width: 100,
            render: (channel: string) => (
                <Tag color={channelColors[channel as keyof typeof channelColors]}>
                    {channel?.toUpperCase()}
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
                    {status?.toUpperCase().replace('_', ' ')}
                </Tag>
            ),
        },
        {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 100,
            render: (status: string) => (
                <Tag color={paymentStatusColors[status as keyof typeof paymentStatusColors]}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Total Amount',
            key: 'totalAmount',
            width: 120,
            render: (record: Reservation) => (
                <div>
                    <div><Text strong>{record.totalAmount.toFixed(2)} {record.currency}</Text></div>
                    <div><Text type="secondary" style={{ fontSize: '12px' }}>Paid: {record.amountPaid.toFixed(2)}</Text></div>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 250,
            render: (record: Reservation) => (
                <Space size="small" direction="vertical">
                    <Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => router.push(`/reservations/${record.id}`)}
                        >
                            View
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => router.push(`/reservations/${record.id}/edit`)}
                        >
                            Edit
                        </Button>
                    </Space>
                    <Space>
                        {record.status === 'confirmed' && (
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleCheckIn(record.id)}
                            >
                                Check-in
                            </Button>
                        )}
                        {record.status === 'checked_in' && (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleCheckOut(record.id)}
                            >
                                Check-out
                            </Button>
                        )}
                        {['pending', 'confirmed'].includes(record.status) && (
                            <Button
                                danger
                                size="small"
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleCancel(record.id)}
                            >
                                Cancel
                            </Button>
                        )}
                    </Space>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Total Reservations"
                            value={stats.total}
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={stats.pending}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Confirmed"
                            value={stats.confirmed}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Checked In"
                            value={stats.checkedIn}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalRevenue}
                            precision={2}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Unpaid Amount"
                            value={stats.unpaidAmount}
                            precision={2}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            <CalendarOutlined /> Reservations Management
                        </Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => router.push('/reservations/create')}
                        >
                            New Reservation
                        </Button>
                    </Col>
                </Row>

                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12} md={6}>
                        <Search
                            placeholder="Search by code, guest, room..."
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
                    <Col xs={12} sm={8} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Status"
                            value={statusFilter}
                            onChange={handleStatusFilter}
                        >
                            <Select.Option value="all">All Status</Select.Option>
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="confirmed">Confirmed</Select.Option>
                            <Select.Option value="checked_in">Checked In</Select.Option>
                            <Select.Option value="checked_out">Checked Out</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                            <Select.Option value="no_show">No Show</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Payment Status"
                            value={paymentStatusFilter}
                            onChange={handlePaymentStatusFilter}
                        >
                            <Select.Option value="all">All Payment</Select.Option>
                            <Select.Option value="unpaid">Unpaid</Select.Option>
                            <Select.Option value="partial">Partial</Select.Option>
                            <Select.Option value="paid">Paid</Select.Option>
                            <Select.Option value="refunded">Refunded</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={8} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Channel"
                            value={channelFilter}
                            onChange={handleChannelFilter}
                        >
                            <Select.Option value="all">All Channels</Select.Option>
                            <Select.Option value="ota">OTA</Select.Option>
                            <Select.Option value="website">Website</Select.Option>
                            <Select.Option value="walkin">Walk-in</Select.Option>
                            <Select.Option value="phone">Phone</Select.Option>
                        </Select>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredReservations}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1800 }}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} reservations`,
                    }}
                />
            </Card>
        </div>
    );
}
