"use client";

import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Tag, Typography, Calendar, Badge } from 'antd';
import {
    HomeOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    ClockCircleOutlined,
    BellOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function ReservationDashboard() {
    // Mock data - replace with actual API calls
    const reservationStats = {
        totalReservations: 156,
        checkedIn: 42,
        checkingInToday: 18,
        checkingOutToday: 15,
        pendingConfirmation: 8,
        occupancyRate: 78,
        adr: 1250000, // Average Daily Rate
        revpar: 975000, // Revenue per Available Room
    };

    const bookingChannels = [
        { channel: 'Booking.com', count: 45, percentage: 28.8 },
        { channel: 'Direct Website', count: 38, percentage: 24.4 },
        { channel: 'Walk-in', count: 35, percentage: 22.4 },
        { channel: 'Agoda', count: 25, percentage: 16.0 },
        { channel: 'Phone', count: 13, percentage: 8.3 },
    ];

    const recentActivities = [
        {
            id: '1',
            type: 'check-in',
            message: 'Room 101 - Nguyen Van A checked in',
            time: '10 minutes ago',
            status: 'success',
        },
        {
            id: '2',
            type: 'booking',
            message: 'New booking from Booking.com - Room Superior',
            time: '30 minutes ago',
            status: 'info',
        },
        {
            id: '3',
            type: 'payment',
            message: 'Payment received for Res #BK001234',
            time: '1 hour ago',
            status: 'success',
        },
        {
            id: '4',
            type: 'cancellation',
            message: 'Booking cancelled - Room Deluxe (2 nights)',
            time: '2 hours ago',
            status: 'warning',
        },
    ];

    const upcomingCheckIns = [
        { guestName: 'Tran Thi B', roomType: 'Superior', time: '14:00', confirmationCode: 'BK001235' },
        { guestName: 'Le Van C', roomType: 'Deluxe', time: '15:30', confirmationCode: 'BK001236' },
        { guestName: 'Pham Minh D', roomType: 'Suite', time: '16:00', confirmationCode: 'BK001237' },
    ];

    const upcomingCheckOuts = [
        { guestName: 'Hoang Thi E', roomNumber: '205', time: '11:00', folio: 2850000 },
        { guestName: 'Vu Van F', roomNumber: '301', time: '12:00', folio: 1950000 },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'check-in': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'booking': return <CalendarOutlined style={{ color: '#1890ff' }} />;
            case 'payment': return <DollarOutlined style={{ color: '#faad14' }} />;
            case 'cancellation': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
            default: return <BellOutlined />;
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Reservation Dashboard</Title>
            
            {/* Key Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Reservations"
                            value={reservationStats.totalReservations}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Currently Checked In"
                            value={reservationStats.checkedIn}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Occupancy Rate"
                            value={reservationStats.occupancyRate}
                            suffix="%"
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Average Daily Rate"
                            value={reservationStats.adr}
                            prefix={<DollarOutlined />}
                            formatter={value => `${Number(value).toLocaleString()} VNĐ`}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Today's Operations */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Checking In Today"
                            value={reservationStats.checkingInToday}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Checking Out Today"
                            value={reservationStats.checkingOutToday}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Pending Confirmation"
                            value={reservationStats.pendingConfirmation}
                            prefix={<ExclamationCircleOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="RevPAR"
                            value={reservationStats.revpar}
                            prefix={<DollarOutlined />}
                            formatter={value => `${Number(value).toLocaleString()} VNĐ`}
                            valueStyle={{ color: '#f759ab' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Booking Channels */}
                <Col xs={24} md={12}>
                    <Card title="Booking Channels" style={{ height: '400px' }}>
                        {bookingChannels.map((channel, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text>{channel.channel}</Text>
                                    <Text strong>{channel.count} bookings</Text>
                                </div>
                                <Progress
                                    percent={channel.percentage}
                                    strokeColor={`hsl(${index * 60}, 70%, 50%)`}
                                    format={() => `${channel.percentage}%`}
                                />
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Recent Activities */}
                <Col xs={24} md={12}>
                    <Card title="Recent Activities" style={{ height: '400px' }}>
                        <List
                            dataSource={recentActivities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={getActivityIcon(item.type)}
                                        title={item.message}
                                        description={item.time}
                                    />
                                    <Tag color={item.status}>{item.status}</Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Today's Check-ins & Check-outs */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} md={12}>
                    <Card title="Today's Check-ins" style={{ height: '300px' }}>
                        <List
                            size="small"
                            dataSource={upcomingCheckIns}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.guestName}
                                        description={`${item.roomType} - ${item.time} - ${item.confirmationCode}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Today's Check-outs" style={{ height: '300px' }}>
                        <List
                            size="small"
                            dataSource={upcomingCheckOuts}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.guestName}
                                        description={`Room ${item.roomNumber} - ${item.time}`}
                                    />
                                    <Text strong>{item.folio.toLocaleString()} VNĐ</Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
