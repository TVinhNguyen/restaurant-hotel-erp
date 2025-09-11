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
  InputNumber,
  Switch,
  Tag,
  Modal,
  Form,
  Select,
  Input,
  Divider,
  Statistic,
  List,
  Calendar,
  Badge,
  Tooltip,
  Tabs,
  Alert,
} from 'antd';
import {
  DollarOutlined,
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  WarningOutlined,
  CalendarOutlined,
  HomeOutlined,
  PercentageOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function AvailabilityPricing() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [form] = Form.useForm();

  // Mock calendar data for room availability
  const calendarData = {
    '2025-09-05': {
      available: 35,
      total: 50,
      occupancy: 70,
      averageRate: 1350000,
      stopSell: false,
    },
    '2025-09-06': {
      available: 28,
      total: 50,
      occupancy: 85,
      averageRate: 1500000,
      stopSell: false,
    },
    '2025-09-07': {
      available: 12,
      total: 50,
      occupancy: 95,
      averageRate: 1800000,
      stopSell: false,
    },
    '2025-09-08': {
      available: 0,
      total: 50,
      occupancy: 100,
      averageRate: 2000000,
      stopSell: true,
    },
  };

  const getCalendarData = (value: dayjs.Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    return calendarData[dateStr as keyof typeof calendarData] || {
      available: Math.floor(Math.random() * 50),
      total: 50,
      occupancy: Math.floor(Math.random() * 100),
      averageRate: 1200000 + Math.floor(Math.random() * 800000),
      stopSell: Math.random() > 0.9,
    };
  };

  const dateCellRender = (value: dayjs.Dayjs) => {
    const data = getCalendarData(value);
    const occupancyColor = data.occupancy > 90 ? 'red' : data.occupancy > 70 ? 'orange' : 'green';
    
    return (
      <div style={{ fontSize: '12px', padding: '2px' }}>
        <div>
          <Badge 
            color={occupancyColor} 
            text={`${data.available}/${data.total}`}
          />
        </div>
        <div style={{ marginTop: '2px' }}>
          <span style={{ color: '#666' }}>
            {(data.averageRate / 1000000).toFixed(1)}M VNĐ
          </span>
        </div>
        {data.stopSell && (
          <div>
            <Tag color="red" style={{ fontSize: '10px', padding: '0 4px' }}>
              STOP
            </Tag>
          </div>
        )}
      </div>
    );
  };

  // Mock data for room availability and pricing
  const roomTypes = [
    {
      id: '1',
      name: 'Superior Room',
      totalRooms: 20,
      availableRooms: 15,
      basePrice: 1200000,
      currentPrice: 1350000,
      occupancyRate: 75,
      stopSell: false,
    },
    {
      id: '2',
      name: 'Deluxe Room',
      totalRooms: 15,
      availableRooms: 8,
      basePrice: 1800000,
      currentPrice: 2000000,
      occupancyRate: 87,
      stopSell: false,
    },
    {
      id: '3',
      name: 'Suite',
      totalRooms: 5,
      availableRooms: 2,
      basePrice: 3500000,
      currentPrice: 3800000,
      occupancyRate: 60,
      stopSell: false,
    },
    {
      id: '4',
      name: 'Family Room',
      totalRooms: 10,
      availableRooms: 0,
      basePrice: 2200000,
      currentPrice: 2400000,
      occupancyRate: 100,
      stopSell: true,
    },
  ];

  const ratePlans = [
    { id: '1', name: 'Best Available Rate', discount: 0, cancellationPolicy: 'Free cancellation 24h' },
    { id: '2', name: 'Early Bird', discount: 15, cancellationPolicy: 'Non-refundable' },
    { id: '3', name: 'Member Rate', discount: 10, cancellationPolicy: 'Free cancellation 48h' },
    { id: '4', name: 'Last Minute', discount: 20, cancellationPolicy: 'Same day booking only' },
  ];

  const promotions = [
    { id: '1', name: 'Summer Special', discount: '20%', validUntil: '2025-09-30', applicable: 'All room types' },
    { id: '2', name: 'Weekend Package', discount: '15%', validUntil: '2025-12-31', applicable: 'Suite only' },
    { id: '3', name: 'Long Stay Discount', discount: '25%', validUntil: '2025-10-15', applicable: 'Min 7 nights' },
  ];

  const columns = [
    {
      title: 'Room Type',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Availability',
      key: 'availability',
      render: (record: any) => (
        <Space>
          <Text>{record.availableRooms}/{record.totalRooms}</Text>
          {record.availableRooms === 0 && <Tag color="red">Sold Out</Tag>}
          {record.stopSell && <Tag color="orange">Stop Sell</Tag>}
        </Space>
      ),
    },
    {
      title: 'Occupancy Rate',
      dataIndex: 'occupancyRate',
      key: 'occupancyRate',
      render: (rate: number) => (
        <Text style={{ color: rate > 90 ? '#ff4d4f' : rate > 70 ? '#faad14' : '#52c41a' }}>
          {rate}%
        </Text>
      ),
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number, record: any) => (
        <Space>
          <Text strong style={{ color: price > record.basePrice ? '#ff4d4f' : '#52c41a' }}>
            {price.toLocaleString()} VNĐ
          </Text>
          {price !== record.basePrice && (
            <Tag color={price > record.basePrice ? 'red' : 'green'}>
              {price > record.basePrice ? '+' : ''}{Math.round((price - record.basePrice) / record.basePrice * 100)}%
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)}>
            Edit Price
          </Button>
          <Button 
            size="small" 
            icon={record.stopSell ? <CheckOutlined /> : <StopOutlined />}
            type={record.stopSell ? "primary" : "default"}
            danger={!record.stopSell}
          >
            {record.stopSell ? 'Enable' : 'Stop Sell'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Availability & Pricing</Title>
      
      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Rooms"
              value={roomTypes.reduce((sum, rt) => sum + rt.totalRooms, 0)}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Available Rooms"
              value={roomTypes.reduce((sum, rt) => sum + rt.availableRooms, 0)}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Occupancy"
              value={Math.round(roomTypes.reduce((sum, rt) => sum + rt.occupancyRate, 0) / roomTypes.length)}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Room Rate"
              value={Math.round(roomTypes.reduce((sum, rt) => sum + rt.currentPrice, 0) / roomTypes.length)}
              prefix={<DollarOutlined />}
              formatter={value => `${Number(value).toLocaleString()} VNĐ`}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Date Selector and View Toggle */}
      <Card style={{ marginBottom: '16px' }}>
        <Space wrap>
          <div>
            <Text strong>Date:</Text>
            <DatePicker 
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || dayjs())}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <Text strong>View Range:</Text>
            <RangePicker defaultValue={[dayjs(), dayjs().add(7, 'day')]} style={{ marginLeft: 8 }} />
          </div>
          <Divider type="vertical" />
          <div>
            <Text strong>View Mode:</Text>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 120, marginLeft: 8 }}
            >
              <Select.Option value="table">Table View</Select.Option>
              <Select.Option value="calendar">Calendar View</Select.Option>
            </Select>
          </div>
          <Button type="primary" icon={<SearchOutlined />}>
            Search Availability
          </Button>
        </Space>
      </Card>

      {/* Table or Calendar View */}
      {viewMode === 'calendar' ? (
        <Card title="Room Availability Calendar" style={{ marginBottom: '24px' }}>
          <Alert
            message="Calendar View"
            description="Green: Low occupancy, Orange: Medium occupancy, Red: High occupancy/Sold out. Numbers show available/total rooms."
            type="info"
            style={{ marginBottom: 16 }}
          />
          <Calendar
            dateCellRender={dateCellRender}
            onSelect={(date) => setSelectedDate(date)}
            value={selectedDate}
          />
        </Card>
      ) : (
        <Card title="Room Types - Availability & Pricing" style={{ marginBottom: '24px' }}>
          <Table
            dataSource={roomTypes}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>
      )}

      <Row gutter={[16, 16]}>
        {/* Rate Plans */}
        <Col xs={24} lg={12}>
          <Card title="Rate Plans" style={{ height: '400px' }}>
            <List
              dataSource={ratePlans}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="edit" size="small" icon={<EditOutlined />}>Edit</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {item.name}
                        {item.discount > 0 && <Tag color="green">-{item.discount}%</Tag>}
                      </Space>
                    }
                    description={item.cancellationPolicy}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Active Promotions */}
        <Col xs={24} lg={12}>
          <Card title="Active Promotions" style={{ height: '400px' }}>
            <List
              dataSource={promotions}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="edit" size="small" icon={<EditOutlined />}>Edit</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {item.name}
                        <Tag color="red">{item.discount}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>Valid until: {item.validUntil}</div>
                        <Text type="secondary">{item.applicable}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Price Edit Modal */}
      <Modal
        title="Edit Room Price"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Date Range" name="dateRange">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Room Type" name="roomType">
            <Select placeholder="Select room type">
              {roomTypes.map(rt => (
                <Select.Option key={rt.id} value={rt.id}>{rt.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="New Price (VNĐ)" name="price">
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item label="Stop Sell" name="stopSell" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Price
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
