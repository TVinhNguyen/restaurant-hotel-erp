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
  Alert,
  Divider,
  Tabs,
  DatePicker,
} from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  PrinterOutlined,
  PlusOutlined,
  UndoOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  BankOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function PaymentsFolio() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [folioModalOpen, setFolioModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('payments');
  const [form] = Form.useForm();

  // Mock data for payments
  const payments = [
    {
      id: '1',
      reservationCode: 'BK001234',
      guestName: 'Nguyen Van A',
      amount: 1500000,
      method: 'card',
      status: 'captured',
      date: '2025-08-28 14:30',
      transactionId: 'TXN001234',
      description: 'Room deposit payment',
    },
    {
      id: '2',
      reservationCode: 'BK001235',
      guestName: 'Tran Thi B',
      amount: 3600000,
      method: 'bank',
      status: 'authorized',
      date: '2025-08-27 10:15',
      transactionId: 'TXN001235',
      description: 'Full payment authorization',
    },
    {
      id: '3',
      reservationCode: 'BK001236',
      guestName: 'Le Van C',
      amount: 800000,
      method: 'cash',
      status: 'captured',
      date: '2025-08-26 16:45',
      transactionId: 'TXN001236',
      description: 'Additional service payment',
    },
  ];

  // Mock data for folios
  const folios = [
    {
      id: '1',
      reservationCode: 'BK001234',
      guestName: 'Nguyen Van A',
      roomNumber: '205',
      checkIn: '2025-08-28',
      checkOut: '2025-08-30',
      status: 'active',
      totalCharges: 2500000,
      totalPayments: 1500000,
      balance: 1000000,
      locked: false,
    },
    {
      id: '2',
      reservationCode: 'BK001235',
      guestName: 'Tran Thi B',
      roomNumber: '301',
      checkIn: '2025-08-28',
      checkOut: '2025-09-01',
      status: 'active',
      totalCharges: 7200000,
      totalPayments: 3600000,
      balance: 3600000,
      locked: false,
    },
    {
      id: '3',
      reservationCode: 'BK001237',
      guestName: 'Pham Van D',
      roomNumber: '102',
      checkIn: '2025-08-25',
      checkOut: '2025-08-28',
      status: 'checked_out',
      totalCharges: 4200000,
      totalPayments: 4200000,
      balance: 0,
      locked: true,
    },
  ];

  // Mock folio details
  const folioItems = [
    { date: '2025-08-28', description: 'Room Charge - Superior', amount: 1250000, type: 'charge' },
    { date: '2025-08-28', description: 'Card Payment', amount: -1500000, type: 'payment' },
    { date: '2025-08-29', description: 'Room Charge - Superior', amount: 1250000, type: 'charge' },
    { date: '2025-08-29', description: 'Spa Service', amount: 450000, type: 'service' },
    { date: '2025-08-29', description: 'Minibar', amount: 120000, type: 'service' },
    { date: '2025-08-29', description: 'VAT 10%', amount: 207000, type: 'tax' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'captured': return 'green';
      case 'authorized': return 'blue';
      case 'refunded': return 'orange';
      case 'voided': return 'red';
      default: return 'default';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCardOutlined />;
      case 'cash': return <DollarOutlined />;
      case 'bank': return <BankOutlined />;
      default: return <DollarOutlined />;
    }
  };

  const handleAddPayment = () => {
    setPaymentModalOpen(true);
  };

  const handleRefund = (payment: any) => {
    setSelectedRecord(payment);
    setRefundModalOpen(true);
  };

  const handleViewFolio = (folio: any) => {
    setSelectedRecord(folio);
    setFolioModalOpen(true);
  };

  const paymentColumns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (id: string) => <Text code>{id}</Text>,
    },
    {
      title: 'Reservation',
      key: 'reservation',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.reservationCode}</Text>
          <Text type="secondary">{record.guestName}</Text>
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>{amount.toLocaleString()} VNĐ</Text>,
    },
    {
      title: 'Method',
      key: 'method',
      render: (record: any) => (
        <Space>
          {getPaymentMethodIcon(record.method)}
          <Text>{record.method.toUpperCase()}</Text>
        </Space>
      ),
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<FileTextOutlined />}>
            Receipt
          </Button>
          {record.status === 'captured' && (
            <Button 
              size="small" 
              icon={<UndoOutlined />}
              onClick={() => handleRefund(record)}
            >
              Refund
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const folioColumns = [
    {
      title: 'Reservation',
      key: 'reservation',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.reservationCode}</Text>
          <Text type="secondary">{record.guestName}</Text>
        </Space>
      ),
    },
    {
      title: 'Room',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (room: string) => <Text strong>Room {room}</Text>,
    },
    {
      title: 'Stay Period',
      key: 'period',
      render: (record: any) => `${record.checkIn} → ${record.checkOut}`,
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: any) => (
        <Space>
          <Tag color={record.status === 'checked_out' ? 'green' : 'blue'}>
            {record.status.replace('_', ' ').toUpperCase()}
          </Tag>
          {record.locked && <Tag color="red">LOCKED</Tag>}
        </Space>
      ),
    },
    {
      title: 'Financial Summary',
      key: 'financial',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <Text>Charges: {record.totalCharges.toLocaleString()} VNĐ</Text>
          <Text>Payments: {record.totalPayments.toLocaleString()} VNĐ</Text>
          <Text strong style={{ color: record.balance > 0 ? '#ff4d4f' : '#52c41a' }}>
            Balance: {record.balance.toLocaleString()} VNĐ
          </Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            size="small" 
            icon={<FileTextOutlined />}
            onClick={() => handleViewFolio(record)}
          >
            View Folio
          </Button>
          <Button size="small" icon={<PrinterOutlined />}>
            Print
          </Button>
          {!record.locked && (
            <Button size="small" icon={<PlusOutlined />}>
              Add Charge
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Payments & Folio Management</Title>
      
      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Total Payments Today"
              value="5.9M"
              suffix="VNĐ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Pending Payments"
              value="8.2M"
              suffix="VNĐ"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Authorized"
              value="12.5M"
              suffix="VNĐ"
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Refunds Today"
              value="450K"
              suffix="VNĐ"
              prefix={<UndoOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tab Navigation */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPayment}>
            Add Payment
          </Button>
        }
        items={[
          {
            key: 'payments',
            label: 'Payment Transactions',
            children: (
              <Card>
                <Table
                  dataSource={payments}
                  columns={paymentColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="middle"
                />
              </Card>
            ),
          },
          {
            key: 'folios',
            label: 'Guest Folios',
            children: (
              <Card>
                <Table
                  dataSource={folios}
                  columns={folioColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="middle"
                />
              </Card>
            ),
          },
        ]}
      />

      {/* Add Payment Modal */}
      <Modal
        title="Add Payment"
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Reservation Code" name="reservationCode" rules={[{ required: true }]}>
            <Select placeholder="Select reservation">
              <Select.Option value="BK001234">BK001234 - Nguyen Van A</Select.Option>
              <Select.Option value="BK001235">BK001235 - Tran Thi B</Select.Option>
            </Select>
          </Form.Item>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Amount (VNĐ)" name="amount" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Enter amount"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Payment Method" name="method" rules={[{ required: true }]}>
                <Select placeholder="Select method">
                  <Select.Option value="cash">Cash</Select.Option>
                  <Select.Option value="card">Credit Card</Select.Option>
                  <Select.Option value="bank">Bank Transfer</Select.Option>
                  <Select.Option value="ewallet">E-Wallet</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="Description" name="description">
            <Input placeholder="Payment description" />
          </Form.Item>
          
          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={2} placeholder="Additional notes..." />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Process Payment
              </Button>
              <Button onClick={() => setPaymentModalOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Refund Modal */}
      <Modal
        title="Process Refund"
        open={refundModalOpen}
        onCancel={() => setRefundModalOpen(false)}
        footer={null}
        width={500}
      >
        {selectedRecord && (
          <>
            <Alert
              message="Refund Confirmation"
              description={`You are about to refund ${selectedRecord.amount?.toLocaleString()} VNĐ for transaction ${selectedRecord.transactionId}`}
              type="warning"
              style={{ marginBottom: '16px' }}
            />
            
            <Form layout="vertical">
              <Form.Item label="Refund Amount (VNĐ)" name="refundAmount">
                <InputNumber
                  style={{ width: '100%' }}
                  defaultValue={selectedRecord.amount}
                  max={selectedRecord.amount}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
              
              <Form.Item label="Refund Reason" name="reason" rules={[{ required: true }]}>
                <Select placeholder="Select reason">
                  <Select.Option value="cancellation">Booking Cancellation</Select.Option>
                  <Select.Option value="no_show">No Show Policy</Select.Option>
                  <Select.Option value="error">Payment Error</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="Notes" name="notes">
                <Input.TextArea rows={2} placeholder="Refund notes..." />
              </Form.Item>
              
              <Form.Item>
                <Space>
                  <Button type="primary" danger icon={<UndoOutlined />}>
                    Process Refund
                  </Button>
                  <Button onClick={() => setRefundModalOpen(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      {/* Folio Details Modal */}
      <Modal
        title={`Folio Details: ${selectedRecord?.reservationCode}`}
        open={folioModalOpen}
        onCancel={() => setFolioModalOpen(false)}
        width={800}
        footer={null}
      >
        {selectedRecord && (
          <>
            <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#f0f2f5' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text><strong>Guest:</strong> {selectedRecord.guestName}</Text>
                    <Text><strong>Room:</strong> {selectedRecord.roomNumber}</Text>
                    <Text><strong>Period:</strong> {selectedRecord.checkIn} → {selectedRecord.checkOut}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text><strong>Total Charges:</strong> {selectedRecord.totalCharges?.toLocaleString()} VNĐ</Text>
                    <Text><strong>Total Payments:</strong> {selectedRecord.totalPayments?.toLocaleString()} VNĐ</Text>
                    <Text><strong>Balance:</strong> 
                      <Text strong style={{ color: selectedRecord.balance > 0 ? '#ff4d4f' : '#52c41a', marginLeft: '8px' }}>
                        {selectedRecord.balance?.toLocaleString()} VNĐ
                      </Text>
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>
            
            <Card title="Folio Items">
              <List
                dataSource={folioItems}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <List.Item.Meta
                      title={item.description}
                      description={item.date}
                    />
                    <Text 
                      strong 
                      style={{ 
                        color: item.type === 'payment' ? '#52c41a' : '#000',
                        fontSize: '14px'
                      }}
                    >
                      {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} VNĐ
                    </Text>
                  </List.Item>
                )}
              />
            </Card>
            
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <Space>
                <Button icon={<PrinterOutlined />}>Print Folio</Button>
                <Button type="primary">Email to Guest</Button>
              </Space>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
