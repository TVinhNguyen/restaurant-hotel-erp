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
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  List,
  Statistic,
  DatePicker,
  Divider,
  Avatar,
} from 'antd';
import {
  CustomerServiceOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ReservationServices() {
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [form] = Form.useForm();

  // Mock data for available services
  const availableServices = [
    {
      id: '1',
      name: 'Spa & Wellness',
      category: 'Wellness',
      description: 'Relaxing spa treatments and wellness services',
      basePrice: 500000,
      duration: 90,
      available: true,
    },
    {
      id: '2',
      name: 'Laundry Service',
      category: 'Housekeeping',
      description: 'Professional laundry and dry cleaning',
      basePrice: 50000,
      duration: 240,
      available: true,
    },
    {
      id: '3',
      name: 'Airport Transfer',
      category: 'Transportation',
      description: 'Private car to/from airport',
      basePrice: 200000,
      duration: 60,
      available: true,
    },
    {
      id: '4',
      name: 'Restaurant Reservation',
      category: 'Dining',
      description: 'Book table at hotel restaurant',
      basePrice: 0,
      duration: 0,
      available: true,
    },
    {
      id: '5',
      name: 'Room Service',
      category: 'F&B',
      description: '24/7 room service delivery',
      basePrice: 25000,
      duration: 30,
      available: true,
    },
  ];

  // Mock data for reservation services
  const reservationServices = [
    {
      id: '1',
      reservationCode: 'BK001234',
      guestName: 'Nguyen Van A',
      roomNumber: '205',
      serviceName: 'Spa & Wellness',
      category: 'Wellness',
      quantity: 2,
      unitPrice: 500000,
      totalAmount: 1000000,
      serviceDate: '2025-08-29',
      status: 'confirmed',
      addedDate: '2025-08-28',
      notes: 'Couple massage requested',
    },
    {
      id: '2',
      reservationCode: 'BK001235',
      guestName: 'Tran Thi B',
      roomNumber: '301',
      serviceName: 'Airport Transfer',
      category: 'Transportation',
      quantity: 1,
      unitPrice: 200000,
      totalAmount: 200000,
      serviceDate: '2025-09-01',
      status: 'pending',
      addedDate: '2025-08-27',
      notes: 'Pick up at 10:00 AM',
    },
    {
      id: '3',
      reservationCode: 'BK001236',
      guestName: 'Le Van C',
      roomNumber: '102',
      serviceName: 'Laundry Service',
      category: 'Housekeeping',
      quantity: 3,
      unitPrice: 50000,
      totalAmount: 150000,
      serviceDate: '2025-08-28',
      status: 'completed',
      addedDate: '2025-08-27',
      notes: 'Express service',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'blue';
      case 'pending': return 'orange';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Wellness': return '🧘';
      case 'Housekeeping': return '🧺';
      case 'Transportation': return '🚗';
      case 'Dining': return '🍽️';
      case 'F&B': return '🛎️';
      default: return '⭐';
    }
  };

  const handleAddService = (reservation?: any) => {
    setSelectedReservation(reservation);
    setAddServiceModalOpen(true);
  };

  const serviceColumns = [
    {
      title: 'Service',
      key: 'service',
      render: (record: any) => (
        <Space>
          <span style={{ fontSize: '20px' }}>{getCategoryIcon(record.category)}</span>
          <Space direction="vertical" size="small">
            <Text strong>{record.serviceName}</Text>
            <Text type="secondary">{record.category}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Reservation',
      key: 'reservation',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.reservationCode}</Text>
          <Text>{record.guestName}</Text>
          <Text type="secondary">Room {record.roomNumber}</Text>
        </Space>
      ),
    },
    {
      title: 'Quantity & Price',
      key: 'pricing',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text>Qty: {record.quantity}</Text>
          <Text>Unit: {record.unitPrice.toLocaleString()} VNĐ</Text>
          <Text strong>Total: {record.totalAmount.toLocaleString()} VNĐ</Text>
        </Space>
      ),
    },
    {
      title: 'Service Date',
      dataIndex: 'serviceDate',
      key: 'serviceDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>
            Edit
          </Button>
          {record.status === 'pending' && (
            <Button size="small" type="primary" icon={<CheckOutlined />}>
              Confirm
            </Button>
          )}
          <Button size="small" danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>Reservation Services</Title>
          <Text type="secondary">Manage additional services for guest reservations</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddService()}>
            Add Service
          </Button>
        </Col>
      </Row>
      
      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Total Services"
              value={reservationServices.length}
              prefix={<CustomerServiceOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Today's Revenue"
              value="1.35M"
              suffix="VNĐ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Pending Services"
              value={reservationServices.filter(s => s.status === 'pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Available Services"
              value={availableServices.filter(s => s.available).length}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Service Requests Table */}
        <Col xs={24} lg={16}>
          <Card title="Active Service Requests">
            <Table
              dataSource={reservationServices}
              columns={serviceColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </Col>

        {/* Available Services */}
        <Col xs={24} lg={8}>
          <Card title="Available Services" extra={<Button size="small" icon={<SettingOutlined />}>Manage</Button>}>
            <List
              dataSource={availableServices}
              renderItem={(service) => (
                <List.Item
                  actions={[
                    <Button 
                      key="add" 
                      size="small" 
                      type="link" 
                      icon={<PlusOutlined />}
                      onClick={() => handleAddService()}
                    >
                      Add
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<span style={{ fontSize: '24px' }}>{getCategoryIcon(service.category)}</span>}
                    title={service.name}
                    description={
                      <div>
                        <div>{service.description}</div>
                        <Text strong style={{ color: '#1890ff' }}>
                          {service.basePrice > 0 ? `${service.basePrice.toLocaleString()} VNĐ` : 'Free'}
                        </Text>
                        {service.duration > 0 && (
                          <Text type="secondary" style={{ marginLeft: '8px' }}>
                            • {service.duration} min
                          </Text>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Add Service Modal */}
      <Modal
        title="Add Service to Reservation"
        open={addServiceModalOpen}
        onCancel={() => setAddServiceModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Reservation" name="reservation" rules={[{ required: true }]}>
            <Select 
              placeholder="Select reservation"
              showSearch
              optionFilterProp="children"
            >
              <Select.Option value="BK001234">BK001234 - Nguyen Van A (Room 205)</Select.Option>
              <Select.Option value="BK001235">BK001235 - Tran Thi B (Room 301)</Select.Option>
              <Select.Option value="BK001236">BK001236 - Le Van C (Room 102)</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Service" name="service" rules={[{ required: true }]}>
            <Select 
              placeholder="Select service"
              onChange={(value) => {
                const service = availableServices.find(s => s.id === value);
                if (service) {
                  form.setFieldsValue({ unitPrice: service.basePrice });
                }
              }}
            >
              {availableServices.map(service => (
                <Select.Option key={service.id} value={service.id}>
                  <Space>
                    <span>{getCategoryIcon(service.category)}</span>
                    {service.name} - {service.basePrice > 0 ? `${service.basePrice.toLocaleString()} VNĐ` : 'Free'}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]} initialValue={1}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Unit Price (VNĐ)" name="unitPrice" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="Service Date" name="serviceDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="Special Notes" name="notes">
            <Input.TextArea rows={3} placeholder="Any special requests or notes..." />
          </Form.Item>
          
          <Divider />
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Add Service
              </Button>
              <Button onClick={() => setAddServiceModalOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Service Details Modal */}
      <Modal
        title="Service Details"
        open={serviceModalOpen}
        onCancel={() => setServiceModalOpen(false)}
        footer={null}
        width={500}
      >
        {/* Service details content will go here */}
      </Modal>
    </div>
  );
}
