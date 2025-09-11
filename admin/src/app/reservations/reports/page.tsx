"use client";

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Table,
  Button,
  DatePicker,
  Select,
  Statistic,
  Progress,
  List,
  Tag,
  Tabs,
  Alert,
  Divider,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  RiseOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function ReservationReports() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs().subtract(30, 'days'), dayjs()]);
  const [selectedProperty, setSelectedProperty] = useState('all');

  // Mock data for reports
  const bookingPaceData = [
    { week: 'Week 1', thisYear: 45, lastYear: 38, pace: '+18%' },
    { week: 'Week 2', thisYear: 52, lastYear: 41, pace: '+27%' },
    { week: 'Week 3', thisYear: 61, lastYear: 55, pace: '+11%' },
    { week: 'Week 4', thisYear: 48, lastYear: 52, pace: '-8%' },
  ];

  const channelPerformance = [
    { channel: 'Booking.com', bookings: 156, revenue: 187200000, adr: 1200000, conversion: 12.5 },
    { channel: 'Direct Website', bookings: 134, revenue: 174200000, adr: 1300000, conversion: 18.2 },
    { channel: 'Agoda', bookings: 89, revenue: 98900000, adr: 1110000, conversion: 8.7 },
    { channel: 'Walk-in', bookings: 67, revenue: 80400000, adr: 1200000, conversion: 45.2 },
    { channel: 'Phone', bookings: 43, revenue: 55900000, adr: 1300000, conversion: 32.1 },
  ];

  const roomTypePerformance = [
    { roomType: 'Superior Room', sold: 245, revenue: 294000000, adr: 1200000, occupancy: 78 },
    { roomType: 'Deluxe Room', sold: 189, revenue: 340200000, adr: 1800000, occupancy: 85 },
    { roomType: 'Suite', sold: 67, revenue: 234500000, adr: 3500000, occupancy: 67 },
    { roomType: 'Family Room', sold: 123, revenue: 270600000, adr: 2200000, occupancy: 92 },
  ];

  const cancellationData = [
    { reason: 'Guest Request', count: 23, percentage: 45.1, avgRefund: 750000 },
    { reason: 'Payment Failed', count: 12, percentage: 23.5, avgRefund: 1200000 },
    { reason: 'Overbooking', count: 8, percentage: 15.7, avgRefund: 1500000 },
    { reason: 'No-Show', count: 5, percentage: 9.8, avgRefund: 0 },
    { reason: 'Force Majeure', count: 3, percentage: 5.9, avgRefund: 1800000 },
  ];

  const lengthOfStayAnalysis = [
    { nights: '1 night', bookings: 89, percentage: 18.2, revenue: 106800000 },
    { nights: '2 nights', bookings: 156, percentage: 31.8, revenue: 374400000 },
    { nights: '3 nights', bookings: 134, percentage: 27.3, revenue: 482400000 },
    { nights: '4-6 nights', bookings: 78, percentage: 15.9, revenue: 468000000 },
    { nights: '7+ nights', bookings: 33, percentage: 6.8, revenue: 462000000 },
  ];

  const revenueMetrics = {
    totalRevenue: 1894200000,
    roomRevenue: 1589800000,
    serviceRevenue: 304400000,
    adr: 1450000,
    revpar: 1131000,
    occupancy: 78.0,
    totalBookings: 489,
    avgLengthOfStay: 2.8,
  };

  const bookingPaceColumns = [
    { title: 'Period', dataIndex: 'week', key: 'week' },
    { title: 'This Year', dataIndex: 'thisYear', key: 'thisYear', render: (val: number) => val.toLocaleString() },
    { title: 'Last Year', dataIndex: 'lastYear', key: 'lastYear', render: (val: number) => val.toLocaleString() },
    { 
      title: 'Pace', 
      dataIndex: 'pace', 
      key: 'pace',
      render: (pace: string) => (
        <Tag color={pace.startsWith('+') ? 'green' : 'red'}>{pace}</Tag>
      )
    },
  ];

  const channelColumns = [
    { title: 'Channel', dataIndex: 'channel', key: 'channel' },
    { title: 'Bookings', dataIndex: 'bookings', key: 'bookings', render: (val: number) => val.toLocaleString() },
    { 
      title: 'Revenue (VNĐ)', 
      dataIndex: 'revenue', 
      key: 'revenue',
      render: (val: number) => val.toLocaleString()
    },
    { 
      title: 'ADR (VNĐ)', 
      dataIndex: 'adr', 
      key: 'adr',
      render: (val: number) => val.toLocaleString()
    },
    { 
      title: 'Conversion %', 
      dataIndex: 'conversion', 
      key: 'conversion',
      render: (val: number) => `${val}%`
    },
  ];

  const roomTypeColumns = [
    { title: 'Room Type', dataIndex: 'roomType', key: 'roomType' },
    { title: 'Rooms Sold', dataIndex: 'sold', key: 'sold', render: (val: number) => val.toLocaleString() },
    { 
      title: 'Revenue (VNĐ)', 
      dataIndex: 'revenue', 
      key: 'revenue',
      render: (val: number) => val.toLocaleString()
    },
    { 
      title: 'ADR (VNĐ)', 
      dataIndex: 'adr', 
      key: 'adr',
      render: (val: number) => val.toLocaleString()
    },
    { 
      title: 'Occupancy %', 
      dataIndex: 'occupancy', 
      key: 'occupancy',
      render: (val: number) => (
        <div>
          <Progress 
            percent={val} 
            size="small" 
            strokeColor={val > 80 ? '#52c41a' : val > 60 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
          />
          <Text>{val}%</Text>
        </div>
      )
    },
  ];

  const exportReport = (reportType: string) => {
    // Here you would implement actual export functionality
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>Booking Reports & Analytics</Title>
          <Text type="secondary">Comprehensive reservation performance analysis</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={() => exportReport('comprehensive')}>
              Export Report
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Space wrap>
          <div>
            <Text strong>Date Range:</Text>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates || [dayjs().subtract(30, 'days'), dayjs()])}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <Text strong>Property:</Text>
            <Select
              value={selectedProperty}
              onChange={setSelectedProperty}
              style={{ width: 150, marginLeft: 8 }}
            >
              <Select.Option value="all">All Properties</Select.Option>
              <Select.Option value="main">Main Hotel</Select.Option>
              <Select.Option value="resort">Beach Resort</Select.Option>
            </Select>
          </div>
        </Space>
      </Card>

      {/* Key Metrics Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={revenueMetrics.totalRevenue}
              prefix={<DollarOutlined />}
              formatter={value => `${Number(value).toLocaleString()} VNĐ`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="ADR (Average Daily Rate)"
              value={revenueMetrics.adr}
              prefix={<HomeOutlined />}
              formatter={value => `${Number(value).toLocaleString()} VNĐ`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="RevPAR"
              value={revenueMetrics.revpar}
              prefix={<RiseOutlined />}
              formatter={value => `${Number(value).toLocaleString()} VNĐ`}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Occupancy Rate"
              value={revenueMetrics.occupancy}
              suffix="%"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Detailed Reports Tabs */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Booking Pace & Pick-up" key="1" icon={<LineChartOutlined />}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Booking Pace Analysis" extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => exportReport('booking-pace')}>Export</Button>}>
                <Alert
                  message="Booking Pace Insight"
                  description="Comparing current booking performance against the same period last year to identify trends and opportunities."
                  type="info"
                  style={{ marginBottom: 16 }}
                />
                <Table
                  dataSource={bookingPaceData}
                  columns={bookingPaceColumns}
                  pagination={false}
                  size="middle"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Channel Performance" key="2" icon={<BarChartOutlined />}>
          <Card title="Booking Channel Analysis" extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => exportReport('channel-performance')}>Export</Button>}>
            <Alert
              message="Channel Optimization"
              description="Monitor each booking channel's performance to optimize distribution strategy and commission costs."
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Table
              dataSource={channelPerformance}
              columns={channelColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="Room Type Analysis" key="3" icon={<HomeOutlined />}>
          <Card title="Room Type Performance" extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => exportReport('room-performance')}>Export</Button>}>
            <Table
              dataSource={roomTypePerformance}
              columns={roomTypeColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="Cancellations & No-Shows" key="4" icon={<PieChartOutlined />}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Cancellation Analysis">
                <List
                  dataSource={cancellationData}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space>
                            {item.reason}
                            <Tag color="orange">{item.count} cases</Tag>
                            <Tag color="blue">{item.percentage}%</Tag>
                          </Space>
                        }
                        description={`Average refund: ${item.avgRefund.toLocaleString()} VNĐ`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Impact Summary">
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Total Cancellations:</Text>
                  <br />
                  <Text style={{ fontSize: '24px', color: '#ff4d4f' }}>
                    {cancellationData.reduce((sum, item) => sum + item.count, 0)}
                  </Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Cancellation Rate:</Text>
                  <br />
                  <Text style={{ fontSize: '24px', color: '#faad14' }}>
                    {((cancellationData.reduce((sum, item) => sum + item.count, 0) / revenueMetrics.totalBookings) * 100).toFixed(1)}%
                  </Text>
                </div>
                <div>
                  <Text strong>Revenue Impact:</Text>
                  <br />
                  <Text style={{ fontSize: '24px', color: '#ff4d4f' }}>
                    {(cancellationData.reduce((sum, item) => sum + (item.count * item.avgRefund), 0)).toLocaleString()} VNĐ
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Length of Stay" key="5" icon={<CalendarOutlined />}>
          <Card title="Length of Stay Analysis" extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => exportReport('length-of-stay')}>Export</Button>}>
            <Alert
              message="Stay Duration Insights"
              description={`Average length of stay: ${revenueMetrics.avgLengthOfStay} nights. Longer stays typically indicate higher guest satisfaction and loyalty.`}
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Table
              dataSource={lengthOfStayAnalysis}
              columns={[
                { title: 'Length of Stay', dataIndex: 'nights', key: 'nights' },
                { title: 'Bookings', dataIndex: 'bookings', key: 'bookings', render: (val: number) => val.toLocaleString() },
                { 
                  title: 'Percentage', 
                  dataIndex: 'percentage', 
                  key: 'percentage',
                  render: (val: number) => (
                    <div>
                      <Progress percent={val} size="small" showInfo={false} />
                      <Text>{val}%</Text>
                    </div>
                  )
                },
                { 
                  title: 'Revenue (VNĐ)', 
                  dataIndex: 'revenue', 
                  key: 'revenue',
                  render: (val: number) => val.toLocaleString()
                },
              ]}
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="Revenue Breakdown" key="6" icon={<DollarOutlined />}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Revenue Sources">
                <div style={{ marginBottom: 16 }}>
                  <Text>Room Revenue</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Progress 
                      percent={Math.round((revenueMetrics.roomRevenue / revenueMetrics.totalRevenue) * 100)} 
                      strokeColor="#1890ff"
                      showInfo={false}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <Text strong>{revenueMetrics.roomRevenue.toLocaleString()} VNĐ</Text>
                  </div>
                </div>
                <div>
                  <Text>Service Revenue</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Progress 
                      percent={Math.round((revenueMetrics.serviceRevenue / revenueMetrics.totalRevenue) * 100)} 
                      strokeColor="#52c41a"
                      showInfo={false}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <Text strong>{revenueMetrics.serviceRevenue.toLocaleString()} VNĐ</Text>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Key Performance Indicators">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <Text strong>Total Bookings:</Text>
                    <br />
                    <Text style={{ fontSize: '20px' }}>{revenueMetrics.totalBookings}</Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div>
                    <Text strong>Average Booking Value:</Text>
                    <br />
                    <Text style={{ fontSize: '20px' }}>
                      {Math.round(revenueMetrics.totalRevenue / revenueMetrics.totalBookings).toLocaleString()} VNĐ
                    </Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div>
                    <Text strong>Service Revenue per Booking:</Text>
                    <br />
                    <Text style={{ fontSize: '20px' }}>
                      {Math.round(revenueMetrics.serviceRevenue / revenueMetrics.totalBookings).toLocaleString()} VNĐ
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}
