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
  List,
  Statistic,
  Alert,
  Divider,
  Steps,
  Tabs,
} from 'antd';
import {
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  CreditCardOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DollarOutlined,
  FileTextOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function StayOperations() {
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('checkin');
  const [form] = Form.useForm();

  // Mock data for check-in ready reservations
  const checkInReady = [
    {
      id: '1',
      confirmationCode: 'BK001234',
      guestName: 'Nguyen Van A',
      roomNumber: '205',
      roomType: 'Superior',
      checkInDate: '2025-08-28',
      checkOutDate: '2025-08-30',
      guests: 2,
      totalAmount: 2500000,
      depositPaid: 1000000,
      balanceDue: 1500000,
      status: 'assigned',
      vipGuest: false,
      specialRequests: 'Late check-in requested',
    },
    {
      id: '2',
      confirmationCode: 'BK001235',
      guestName: 'Tran Thi B',
      roomNumber: '301',
      roomType: 'Suite',
      checkInDate: '2025-08-28',
      checkOutDate: '2025-09-01',
      guests: 4,
      totalAmount: 7200000,
      depositPaid: 3600000,
      balanceDue: 3600000,
      status: 'assigned',
      vipGuest: true,
      specialRequests: 'Extra towels, fruit basket',
    },
  ];

  // Mock data for check-out ready reservations
  const checkOutReady = [
    {
      id: '3',
      confirmationCode: 'BK001236',
      guestName: 'Le Van C',
      roomNumber: '102',
      roomType: 'Deluxe',
      checkInDate: '2025-08-26',
      checkOutDate: '2025-08-28',
      guests: 2,
      roomCharges: 3200000,
      serviceCharges: 450000,
      taxes: 365000,
      totalAmount: 4015000,
      paidAmount: 2000000,
      balanceDue: 2015000,
      status: 'checked_in',
      folioItems: [
        { date: '2025-08-26', description: 'Room Charge - Deluxe', amount: 1600000 },
        { date: '2025-08-27', description: 'Room Charge - Deluxe', amount: 1600000 },
        { date: '2025-08-27', description: 'Spa Service', amount: 300000 },
        { date: '2025-08-28', description: 'Minibar', amount: 150000 },
        { date: '2025-08-28', description: 'VAT 10%', amount: 365000 },
      ],
    },
  ];

  const handleCheckIn = (reservation: any) => {
    setSelectedReservation(reservation);
    setCheckInModalOpen(true);
  };

  const handleCheckOut = (reservation: any) => {
    setSelectedReservation(reservation);
    setCheckOutModalOpen(true);
  };

  const checkInColumns = [
    {
      title: 'Confirmation',
      dataIndex: 'confirmationCode',
      key: 'confirmationCode',
      render: (code: string, record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{code}</Text>
          {record.vipGuest && <Tag color="gold">VIP</Tag>}
        </Space>
      ),
    },
    {
      title: 'Guest',
      dataIndex: 'guestName',
      key: 'guestName',
    },
    {
      title: 'Room',
      key: 'room',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>Room {record.roomNumber}</Text>
          <Text type="secondary">{record.roomType}</Text>
        </Space>
      ),
    },
    {
      title: 'Stay Period',
      key: 'period',
      render: (record: any) => (
        <div>
          <div>{record.checkInDate} → {record.checkOutDate}</div>
          <Text type="secondary">{record.guests} guests</Text>
        </div>
      ),
    },
    {
      title: 'Payment Status',
      key: 'payment',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text>Total: {record.totalAmount.toLocaleString()} VNĐ</Text>
          <Text>Paid: {record.depositPaid.toLocaleString()} VNĐ</Text>
          <Tag color={record.balanceDue > 0 ? 'orange' : 'green'}>
            Balance: {record.balanceDue.toLocaleString()} VNĐ
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button 
          type="primary" 
          icon={<LoginOutlined />}
          onClick={() => handleCheckIn(record)}
        >
          Check In
        </Button>
      ),
    },
  ];

  const checkOutColumns = [
    {
      title: 'Confirmation',
      dataIndex: 'confirmationCode',
      key: 'confirmationCode',
    },
    {
      title: 'Guest',
      dataIndex: 'guestName',
      key: 'guestName',
    },
    {
      title: 'Room',
      key: 'room',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>Room {record.roomNumber}</Text>
          <Text type="secondary">{record.roomType}</Text>
        </Space>
      ),
    },
    {
      title: 'Folio Total',
      key: 'folio',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text>Total: {record.totalAmount.toLocaleString()} VNĐ</Text>
          <Text>Paid: {record.paidAmount.toLocaleString()} VNĐ</Text>
          <Tag color={record.balanceDue > 0 ? 'red' : 'green'}>
            Due: {record.balanceDue.toLocaleString()} VNĐ
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="primary" 
            icon={<LogoutOutlined />}
            onClick={() => handleCheckOut(record)}
          >
            Check Out
          </Button>
          <Button icon={<FileTextOutlined />}>
            View Folio
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Stay Operations</Title>
      
      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Ready for Check-in"
              value={checkInReady.length}
              prefix={<LoginOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Ready for Check-out"
              value={checkOutReady.length}
              prefix={<LogoutOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Currently In-house"
              value={45}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Pending Payments"
              value="8.5M"
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tab Navigation */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'checkin',
            label: 'Check-in Process',
            children: (
              <Card title="Reservations Ready for Check-in">
                <Table
                  dataSource={checkInReady}
                  columns={checkInColumns}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              </Card>
            ),
          },
          {
            key: 'checkout',
            label: 'Check-out Process',
            children: (
              <Card title="Guests Ready for Check-out">
                <Table
                  dataSource={checkOutReady}
                  columns={checkOutColumns}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              </Card>
            ),
          },
        ]}
      />

      {/* Check-in Modal */}
      <Modal
        title={`Check-in: ${selectedReservation?.confirmationCode}`}
        open={checkInModalOpen}
        onCancel={() => setCheckInModalOpen(false)}
        width={800}
        footer={null}
      >
        {selectedReservation && (
          <>
            <Alert
              message="Guest Information Verification"
              description="Please verify guest identity and collect required documents"
              type="info"
              style={{ marginBottom: '16px' }}
            />

            <Steps
              current={0}
              size="small"
              style={{ marginBottom: '24px' }}
              items={[
                { title: 'Verify Guest', icon: <UserOutlined /> },
                { title: 'Collect Payment', icon: <CreditCardOutlined /> },
                { title: 'Room Assignment', icon: <CheckOutlined /> },
                { title: 'Complete Check-in', icon: <LoginOutlined /> },
              ]}
            />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="Reservation Details">
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div><Text strong>Guest:</Text> {selectedReservation.guestName}</div>
                    <div><Text strong>Room:</Text> {selectedReservation.roomNumber} ({selectedReservation.roomType})</div>
                    <div><Text strong>Period:</Text> {selectedReservation.checkInDate} → {selectedReservation.checkOutDate}</div>
                    <div><Text strong>Guests:</Text> {selectedReservation.guests} people</div>
                    {selectedReservation.specialRequests && (
                      <div><Text strong>Special Requests:</Text> {selectedReservation.specialRequests}</div>
                    )}
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Payment Summary">
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div><Text>Total Amount: <Text strong>{selectedReservation.totalAmount.toLocaleString()} VNĐ</Text></Text></div>
                    <div><Text>Deposit Paid: <Text style={{ color: '#52c41a' }}>{selectedReservation.depositPaid.toLocaleString()} VNĐ</Text></Text></div>
                    <div><Text>Balance Due: <Text strong style={{ color: selectedReservation.balanceDue > 0 ? '#ff4d4f' : '#52c41a' }}>{selectedReservation.balanceDue.toLocaleString()} VNĐ</Text></Text></div>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Guest ID/Passport" name="guestId" rules={[{ required: true }]}>
                    <Input placeholder="Enter ID/Passport number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Payment Method" name="paymentMethod">
                    <Select placeholder="Select payment method">
                      <Select.Option value="cash">Cash</Select.Option>
                      <Select.Option value="card">Credit Card</Select.Option>
                      <Select.Option value="bank">Bank Transfer</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Additional Notes" name="notes">
                <Input.TextArea rows={2} placeholder="Any additional notes..." />
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <Space>
                <Button onClick={() => setCheckInModalOpen(false)}>Cancel</Button>
                <Button type="primary" icon={<LoginOutlined />}>
                  Complete Check-in
                </Button>
              </Space>
            </div>
          </>
        )}
      </Modal>

      {/* Check-out Modal */}
      <Modal
        title={`Check-out: ${selectedReservation?.confirmationCode}`}
        open={checkOutModalOpen}
        onCancel={() => setCheckOutModalOpen(false)}
        width={900}
        footer={null}
      >
        {selectedReservation && (
          <>
            <Alert
              message="Review Folio and Collect Final Payment"
              description="Please review all charges and collect any outstanding balance"
              type="warning"
              style={{ marginBottom: '16px' }}
            />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="Guest Information">
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div><Text strong>Guest:</Text> {selectedReservation.guestName}</div>
                    <div><Text strong>Room:</Text> {selectedReservation.roomNumber} ({selectedReservation.roomType})</div>
                    <div><Text strong>Stay Period:</Text> {selectedReservation.checkInDate} → {selectedReservation.checkOutDate}</div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Final Bill Summary">
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div><Text>Room Charges: {selectedReservation.roomCharges?.toLocaleString()} VNĐ</Text></div>
                    <div><Text>Service Charges: {selectedReservation.serviceCharges?.toLocaleString()} VNĐ</Text></div>
                    <div><Text>Taxes: {selectedReservation.taxes?.toLocaleString()} VNĐ</Text></div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div><Text strong>Total: {selectedReservation.totalAmount?.toLocaleString()} VNĐ</Text></div>
                    <div><Text>Paid: {selectedReservation.paidAmount?.toLocaleString()} VNĐ</Text></div>
                    <div><Text strong style={{ color: selectedReservation.balanceDue > 0 ? '#ff4d4f' : '#52c41a' }}>
                      Balance Due: {selectedReservation.balanceDue?.toLocaleString()} VNĐ
                    </Text></div>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Folio Details */}
            <Card size="small" title="Folio Details" style={{ marginTop: '16px' }}>
              <List
                size="small"
                dataSource={selectedReservation.folioItems || []}
                renderItem={(item: any) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <List.Item.Meta
                      title={item.description}
                      description={item.date}
                    />
                    <Text strong>{item.amount.toLocaleString()} VNĐ</Text>
                  </List.Item>
                )}
              />
            </Card>

            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <Space>
                <Button icon={<PrinterOutlined />}>Print Folio</Button>
                <Button onClick={() => setCheckOutModalOpen(false)}>Cancel</Button>
                <Button 
                  type="primary" 
                  icon={<LogoutOutlined />}
                  disabled={selectedReservation.balanceDue > 0}
                >
                  Complete Check-out
                </Button>
              </Space>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
