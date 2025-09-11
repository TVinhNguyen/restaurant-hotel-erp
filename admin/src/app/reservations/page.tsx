"use client";

import React from 'react';
import { Card, Row, Col, Button, Typography, Space, Tag, Statistic, List } from 'antd';
import {
  CalendarOutlined,
  HomeOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined,
  FileTextOutlined,
  TeamOutlined,
  CreditCardOutlined,
  BellTwoTone,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export default function ReservationHub() {
  const router = useRouter();

  // Mock data - replace with actual API calls
  const reservationStats = {
    totalReservations: 156,
    checkedIn: 42,
    checkingInToday: 18,
    checkingOutToday: 15,
    pendingConfirmation: 8,
    occupancyRate: 78,
  };

  const quickActions = [
    {
      title: 'New Booking Wizard',
      description: 'Step-by-step booking creation with availability search and rate selection',
      icon: <PlusOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      path: '/reservations/new',
      color: '#13c2c2',
      stats: 'Smart Booking Process',
    },
    {
      title: 'Booking Pipeline',
      description: 'Manage booking lifecycle from quote to check-out with Kanban board',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/reservations/booking-pipeline',
      color: '#1890ff',
      stats: `${reservationStats.totalReservations} Total Bookings`,
    },
    {
      title: 'Availability & Pricing',
      description: 'Check room availability and manage pricing rules',
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      path: '/reservations/availability-pricing',
      color: '#52c41a',
      stats: `${reservationStats.occupancyRate}% Occupancy Rate`,
    },
    {
      title: 'Room Assignment',
      description: 'Assign rooms to confirmed reservations',
      icon: <HomeOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      path: '/reservations/room-assignment',
      color: '#faad14',
      stats: `${reservationStats.checkedIn} Rooms Occupied`,
    },
    {
      title: 'Stay Operations',
      description: 'Handle check-in and check-out processes',
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/reservations/stay-operations',
      color: '#722ed1',
      stats: `${reservationStats.checkingInToday} Check-ins Today`,
    },
    {
      title: 'Payments & Folio',
      description: 'Manage payments, refunds and guest folios',
      icon: <CreditCardOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      path: '/reservations/payments-folio',
      color: '#13c2c2',
      stats: 'Payment Management',
    },
    {
      title: 'Services Management',
      description: 'Handle additional services and charges',
      icon: <CustomerServiceOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      path: '/reservations/services',
      color: '#eb2f96',
      stats: 'Add-on Services',
    },
    {
      title: 'Booking Dashboard',
      description: 'View comprehensive reservation analytics and insights',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#f759ab' }} />,
      path: '/reservations/dashboard',
      color: '#f759ab',
      stats: 'Analytics & Reports',
    },
    {
      title: 'Reports & Analytics',
      description: 'Advanced reporting and business intelligence',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      path: '/reservations/reports',
      color: '#fa8c16',
      stats: 'Business Intelligence',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'check-in',
      message: 'Room 205 - Nguyen Van A checked in successfully',
      time: '15 minutes ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'booking',
      message: 'New booking from Booking.com - Superior Room',
      time: '1 hour ago',
      status: 'info',
    },
    {
      id: '3',
      type: 'payment',
      message: 'Payment completed for reservation BK001234',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: '4',
      type: 'cancellation',
      message: 'Booking cancelled - Deluxe Room (policy applied)',
      time: '3 hours ago',
      status: 'warning',
    },
    {
      id: '5',
      type: 'service',
      message: 'Spa service added to Room 301',
      time: '4 hours ago',
      status: 'info',
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'check-in': return 'green';
      case 'booking': return 'blue';
      case 'payment': return 'gold';
      case 'cancellation': return 'orange';
      case 'service': return 'purple';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Reservation Management System</Title>
          <Paragraph style={{ margin: 0, color: '#666' }}>
            Complete booking lifecycle management from quote to check-out
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/reservations/new')}
            >
              New Booking
            </Button>
            <Button icon={<BellOutlined />}>
              Alerts {reservationStats.pendingConfirmation > 0 && 
                <span style={{ color: '#ff4d4f' }}>({reservationStats.pendingConfirmation})</span>}
            </Button>
            <Button icon={<SettingOutlined />}>Settings</Button>
          </Space>
        </Col>
      </Row>

      {/* Quick Stats */}
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
              title="Checked In"
              value={reservationStats.checkedIn}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Check-ins Today"
              value={reservationStats.checkingInToday}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Check-outs Today"
              value={reservationStats.checkingOutToday}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Grid */}
      <Title level={3} style={{ marginBottom: '16px' }}>Reservation Management</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {quickActions.map((action, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              hoverable
              onClick={() => router.push(action.path)}
              style={{
                borderLeft: `4px solid ${action.color}`,
                cursor: 'pointer',
                height: '160px',
              }}
              bodyStyle={{
                padding: '20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Space size="middle" style={{ marginBottom: '12px' }}>
                  {action.icon}
                  <Title level={4} style={{ margin: 0 }}>{action.title}</Title>
                </Space>
                <Paragraph style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  {action.description}
                </Paragraph>
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {action.stats}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activities & Today's Operations */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activities" style={{ height: '400px' }}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <Space>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: '16px'
                    }}>
                      {item.type === 'check-in' && <HomeOutlined style={{ color: '#52c41a' }} />}
                      {item.type === 'booking' && <CalendarOutlined style={{ color: '#1890ff' }} />}
                      {item.type === 'payment' && <DollarOutlined style={{ color: '#faad14' }} />}
                      {item.type === 'cancellation' && <ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
                      {item.type === 'service' && <CustomerServiceOutlined style={{ color: '#722ed1' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{item.message}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                    </div>
                    <Tag color={getActivityColor(item.type)}>{item.status}</Tag>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Today's Summary" style={{ height: '400px' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}>
                  <Statistic
                    title="Arrivals"
                    value={reservationStats.checkingInToday}
                    prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff2e6' }}>
                  <Statistic
                    title="Departures"
                    value={reservationStats.checkingOutToday}
                    prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
                    valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Pending Actions</Title>
              <List size="small">
                <List.Item>
                  <Tag color="orange">{reservationStats.pendingConfirmation}</Tag>
                  <Text>Pending Confirmations</Text>
                </List.Item>
                <List.Item>
                  <Tag color="blue">5</Tag>
                  <Text>Rooms to Assign</Text>
                </List.Item>
                <List.Item>
                  <Tag color="red">3</Tag>
                  <Text>Overdue Payments</Text>
                </List.Item>
                <List.Item>
                  <Tag color="purple">2</Tag>
                  <Text>Service Requests</Text>
                </List.Item>
              </List>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
