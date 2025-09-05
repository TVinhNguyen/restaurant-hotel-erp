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
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Modal,
  Tag,
  List,
  Divider,
  Alert,
  Descriptions,
} from 'antd';
import {
  ShopOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useShow } from "@refinedev/core";
import { ReservationBreadcrumb } from "@/components/ReservationBreadcrumb";
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function ReservationTableBooking() {
  const params = useParams();
  const router = useRouter();
  const [tableBookingModalOpen, setTableBookingModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { queryResult } = useShow({
    resource: "reservations",
    id: params.id as string,
  });

  const reservation = queryResult?.data?.data;

  // Mock data for restaurants and tables
  const restaurants = [
    {
      id: '1',
      name: 'Main Restaurant',
      cuisine: 'International',
      openTime: '06:00',
      closeTime: '22:00',
      maxCapacity: 120,
    },
    {
      id: '2',
      name: 'Rooftop Bar & Grill',
      cuisine: 'BBQ & Cocktails',
      openTime: '17:00',
      closeTime: '24:00',
      maxCapacity: 60,
    },
    {
      id: '3',
      name: 'Poolside Cafe',
      cuisine: 'Light Meals & Beverages',
      openTime: '08:00',
      closeTime: '18:00',
      maxCapacity: 40,
    },
  ];

  const tableBookings = [
    {
      id: '1',
      restaurantName: 'Main Restaurant',
      tableNumber: 'T-05',
      date: '2025-08-28',
      time: '19:00',
      pax: 2,
      duration: 120,
      status: 'confirmed',
      specialRequests: 'Window seat, vegetarian menu',
      createdAt: '2025-08-26 14:30',
    },
    {
      id: '2',
      restaurantName: 'Rooftop Bar & Grill',
      tableNumber: 'R-12',
      date: '2025-08-29',
      time: '20:30',
      pax: 4,
      duration: 180,
      status: 'pending',
      specialRequests: 'Birthday celebration, cake request',
      createdAt: '2025-08-27 16:45',
    },
  ];

  const availableTables = [
    { id: 'T-01', capacity: 2, location: 'Main Hall', available: true },
    { id: 'T-02', capacity: 4, location: 'Window Side', available: true },
    { id: 'T-03', capacity: 6, location: 'Private Corner', available: false },
    { id: 'T-04', capacity: 2, location: 'Main Hall', available: true },
    { id: 'T-05', capacity: 4, location: 'Window Side', available: false },
    { id: 'R-10', capacity: 2, location: 'Rooftop Terrace', available: true },
    { id: 'R-11', capacity: 4, location: 'Bar Counter', available: true },
    { id: 'R-12', capacity: 6, location: 'Private Section', available: false },
  ];

  const handleTableBooking = async (values: any) => {
    try {
      // Here you would make the actual API call to create the table booking
      console.log('Creating table booking:', {
        ...values,
        reservationId: params.id,
        guestName: reservation?.contact_name,
        guestPhone: reservation?.contact_phone,
      });
      
      setTableBookingModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create table booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const bookingColumns = [
    {
      title: 'Restaurant',
      dataIndex: 'restaurantName',
      key: 'restaurantName',
    },
    {
      title: 'Table',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      render: (tableNumber: string) => <Text strong>{tableNumber}</Text>,
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (record: any) => (
        <div>
          <div>{record.date}</div>
          <Text type="secondary">{record.time}</Text>
        </div>
      ),
    },
    {
      title: 'Pax',
      dataIndex: 'pax',
      key: 'pax',
      render: (pax: number) => (
        <Space>
          <UserOutlined />
          <Text>{pax}</Text>
        </Space>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} mins`,
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
          <Button size="small" icon={<DeleteOutlined />} danger>
            Cancel
          </Button>
        </Space>
      ),
    },
  ];

  if (!reservation) return <div>Loading...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <ReservationBreadcrumb
        reservationId={params.id as string}
        confirmationCode={reservation?.confirmation_code}
        currentPage="F&B Table Booking"
      />

      <Row gutter={24}>
        <Col span={16}>
          <Card 
            title="Table Bookings"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setTableBookingModalOpen(true)}
              >
                Book Table
              </Button>
            }
          >
            {tableBookings.length > 0 ? (
              <Table
                dataSource={tableBookings}
                columns={bookingColumns}
                rowKey="id"
                pagination={false}
                size="middle"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <ShopOutlined style={{ fontSize: '48px', color: '#bfbfbf' }} />
                <div style={{ marginTop: '16px' }}>
                  <Text type="secondary">No table bookings yet</Text>
                  <br />
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setTableBookingModalOpen(true)}
                    style={{ marginTop: '8px' }}
                  >
                    Book First Table
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Available Restaurants */}
          <Card title="Available Restaurants" style={{ marginTop: '16px' }}>
            <List
              dataSource={restaurants}
              renderItem={(restaurant) => (
                <List.Item
                  actions={[
                    <Button 
                      key="book" 
                      type="primary" 
                      size="small"
                      onClick={() => {
                        form.setFieldsValue({ restaurantId: restaurant.id });
                        setTableBookingModalOpen(true);
                      }}
                    >
                      Book Table
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    title={restaurant.name}
                    description={
                      <div>
                        <div><Text strong>Cuisine:</Text> {restaurant.cuisine}</div>
                        <div><Text strong>Hours:</Text> {restaurant.openTime} - {restaurant.closeTime}</div>
                        <div><Text strong>Capacity:</Text> {restaurant.maxCapacity} seats</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Guest Information */}
            <Card size="small" title="Guest Information">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">{reservation.contact_name}</Descriptions.Item>
                <Descriptions.Item label="Room">{reservation.assigned_room_number || 'Not assigned'}</Descriptions.Item>
                <Descriptions.Item label="Phone">{reservation.contact_phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{reservation.contact_email}</Descriptions.Item>
                <Descriptions.Item label="Guests">{reservation.adults} adults{reservation.children > 0 && `, ${reservation.children} children`}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Quick Stats */}
            <Card size="small" title="Booking Summary">
              <div style={{ marginBottom: 8 }}>
                <Text>Total Table Bookings:</Text>
                <br />
                <Text strong style={{ fontSize: '18px' }}>{tableBookings.length}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>Confirmed Bookings:</Text>
                <br />
                <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                  {tableBookings.filter(b => b.status === 'confirmed').length}
                </Text>
              </div>
              <div>
                <Text>Pending Bookings:</Text>
                <br />
                <Text strong style={{ fontSize: '18px', color: '#faad14' }}>
                  {tableBookings.filter(b => b.status === 'pending').length}
                </Text>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card size="small" title="Recent Activity">
              <List
                size="small"
                dataSource={tableBookings.slice(0, 3)}
                renderItem={(booking) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color={getStatusColor(booking.status)}>{booking.status}</Tag>
                          {booking.restaurantName}
                        </Space>
                      }
                      description={
                        <div>
                          <div>{booking.date} at {booking.time}</div>
                          <Text type="secondary">Table {booking.tableNumber} • {booking.pax} pax</Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Table Booking Modal */}
      <Modal
        title="Book Restaurant Table"
        open={tableBookingModalOpen}
        onCancel={() => {
          setTableBookingModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Alert
          message="Table Booking for Hotel Guest"
          description={`Booking table for ${reservation.contact_name} (Room: ${reservation.assigned_room_number || 'Not assigned'})`}
          type="info"
          style={{ marginBottom: 16 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleTableBooking}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Restaurant"
                name="restaurantId"
                rules={[{ required: true, message: 'Please select a restaurant' }]}
              >
                <Select placeholder="Select restaurant">
                  {restaurants.map(restaurant => (
                    <Select.Option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Number of Guests"
                name="pax"
                rules={[{ required: true, message: 'Please enter number of guests' }]}
                initialValue={reservation.adults + (reservation.children || 0)}
              >
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker 
                  style={{ width: '100%' }}
                  format="HH:mm"
                  minuteStep={30}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Estimated Duration"
            name="duration"
            initialValue={120}
          >
            <Select>
              <Select.Option value={60}>1 hour</Select.Option>
              <Select.Option value={90}>1.5 hours</Select.Option>
              <Select.Option value={120}>2 hours</Select.Option>
              <Select.Option value={180}>3 hours</Select.Option>
              <Select.Option value={240}>4 hours</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Special Requests"
            name="specialRequests"
          >
            <Input.TextArea 
              rows={3}
              placeholder="Dietary restrictions, seating preferences, special occasions, etc."
            />
          </Form.Item>

          <Divider />

          <div style={{ marginBottom: 16 }}>
            <Text strong>Available Tables</Text>
            <div style={{ marginTop: 8, maxHeight: 150, overflowY: 'auto' }}>
              {availableTables.filter(table => table.available).map(table => (
                <Tag 
                  key={table.id} 
                  style={{ margin: '2px', cursor: 'pointer' }}
                  color={table.available ? 'green' : 'red'}
                >
                  {table.id} ({table.capacity} pax) - {table.location}
                </Tag>
              ))}
            </div>
          </div>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setTableBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Book Table
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
