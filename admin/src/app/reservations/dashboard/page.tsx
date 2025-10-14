"use client";

import { Card, Row, Col, Statistic, Typography, Table, Tag, DatePicker, Space, message } from "antd";
import { useState, useEffect } from "react";
import { 
    CalendarOutlined, 
    DollarOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    RiseOutlined,
    FallOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface DashboardStats {
    totalReservations: number;
    activeReservations: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    totalRevenue: number;
    averageRate: number;
    occupancyRate: number;
    pendingPayments: number;
}

interface RecentReservation {
    id: string;
    guestName: string;
    roomTypeName: string;
    checkIn: string;
    checkOut: string;
    status: string;
    totalAmount: number;
}

const statusColors: Record<string, string> = {
    pending: 'orange',
    confirmed: 'blue',
    checked_in: 'green',
    checked_out: 'default',
    cancelled: 'red',
    no_show: 'red',
};

export default function ReservationsDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalReservations: 0,
        activeReservations: 0,
        todayCheckIns: 0,
        todayCheckOuts: 0,
        totalRevenue: 0,
        averageRate: 0,
        occupancyRate: 0,
        pendingPayments: 0,
    });
    const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => [
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange[0]?.format(), dateRange[1]?.format()]);

    const fetchDashboardData = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const selectedPropertyId = localStorage.getItem('selectedPropertyId');
        
        if (!selectedPropertyId) {
            message.warning('Please select a property first');
            setLoading(false);
            return;
        }

        setLoading(true);
        
        try {
            // Fetch reservations
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
                const reservations = result.data;

                // Calculate stats
                const today = dayjs().format('YYYY-MM-DD');
                const startDate = dateRange[0].format('YYYY-MM-DD');
                const endDate = dateRange[1].format('YYYY-MM-DD');

                const filteredReservations = reservations.filter((r: any) => {
                    const checkIn = dayjs(r.checkIn).format('YYYY-MM-DD');
                    return checkIn >= startDate && checkIn <= endDate;
                });

                const activeReservations = reservations.filter((r: any) => 
                    ['confirmed', 'checked_in'].includes(r.status)
                );

                const todayCheckIns = reservations.filter((r: any) => 
                    dayjs(r.checkIn).format('YYYY-MM-DD') === today
                );

                const todayCheckOuts = reservations.filter((r: any) => 
                    dayjs(r.checkOut).format('YYYY-MM-DD') === today
                );

                const totalRevenue = filteredReservations.reduce((sum: number, r: any) => 
                    sum + parseFloat(r.totalAmount || 0), 0
                );

                const averageRate = filteredReservations.length > 0 
                    ? totalRevenue / filteredReservations.length 
                    : 0;

                const pendingPayments = reservations.filter((r: any) => 
                    r.paymentStatus === 'unpaid' || r.paymentStatus === 'partial'
                ).reduce((sum: number, r: any) => 
                    sum + (parseFloat(r.totalAmount || 0) - parseFloat(r.amountPaid || 0)), 0
                );

                setStats({
                    totalReservations: filteredReservations.length,
                    activeReservations: activeReservations.length,
                    todayCheckIns: todayCheckIns.length,
                    todayCheckOuts: todayCheckOuts.length,
                    totalRevenue,
                    averageRate,
                    occupancyRate: 0, // Would need room count to calculate
                    pendingPayments,
                });

                // Set recent reservations
                const recent = reservations
                    .sort((a: any, b: any) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .slice(0, 10)
                    .map((r: any) => ({
                        id: r.id,
                        guestName: r.guest?.name || '',
                        roomTypeName: r.roomType?.name || '',
                        checkIn: r.checkIn,
                        checkOut: r.checkOut,
                        status: r.status,
                        totalAmount: parseFloat(r.totalAmount || 0),
                    }));

                setRecentReservations(recent);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error loading dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            message.error('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Guest Name',
            dataIndex: 'guestName',
            key: 'guestName',
        },
        {
            title: 'Room Type',
            dataIndex: 'roomTypeName',
            key: 'roomTypeName',
        },
        {
            title: 'Check-In',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Check-Out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={statusColors[status]}>
                    {status.toUpperCase().replace('_', ' ')}
                </Tag>
            ),
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `$${amount.toFixed(2)}`,
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Reservations Dashboard</Title>
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                        format="MMM DD, YYYY"
                    />
                </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Reservations"
                            value={stats.totalReservations}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Reservations"
                            value={stats.activeReservations}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Today Check-Ins"
                            value={stats.todayCheckIns}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Today Check-Outs"
                            value={stats.todayCheckOuts}
                            prefix={<FallOutlined />}
                            valueStyle={{ color: '#faad14' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalRevenue}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Average Rate"
                            value={stats.averageRate}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#1890ff' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Payments"
                            value={stats.pendingPayments}
                            prefix={<ClockCircleOutlined />}
                            precision={2}
                            valueStyle={{ color: '#ff4d4f' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Occupancy Rate"
                            value={stats.occupancyRate}
                            suffix="%"
                            prefix={<UserOutlined />}
                            precision={1}
                            valueStyle={{ color: '#722ed1' }}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Recent Reservations" bordered={false}>
                <Table
                    columns={columns}
                    dataSource={recentReservations}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
}
