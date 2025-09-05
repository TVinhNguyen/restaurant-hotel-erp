"use client";

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Tag,
  Select,
  DatePicker,
  Input,
  Dropdown,
  MenuProps,
  Table,
} from 'antd';
import {
  CalendarOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function BookingPipeline() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filters, setFilters] = useState<{
    status?: string;
    channel?: string;
    dateRange?: any;
    search?: string;
  }>({});

  // Mock data for reservations
  const mockReservations = [
    {
      id: '1',
      confirmationCode: 'BK001234',
      guestName: 'Nguyen Van A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      roomType: 'Superior',
      checkIn: '2025-08-29',
      checkOut: '2025-08-31',
      nights: 2,
      guests: 2,
      totalAmount: 2500000,
      status: 'pending',
      channel: 'website',
      createdAt: '2025-08-28 10:30',
    },
    {
      id: '2',
      confirmationCode: 'BK001235',
      guestName: 'Tran Thi B',
      phone: '0987654321',
      email: 'tranthib@email.com',
      roomType: 'Deluxe',
      checkIn: '2025-08-29',
      checkOut: '2025-09-02',
      nights: 4,
      guests: 2,
      totalAmount: 5200000,
      status: 'confirmed',
      channel: 'ota',
      createdAt: '2025-08-27 14:15',
    },
    {
      id: '3',
      confirmationCode: 'BK001236',
      guestName: 'Le Van C',
      phone: '0912345678',
      email: 'levanc@email.com',
      roomType: 'Suite',
      checkIn: '2025-08-28',
      checkOut: '2025-08-30',
      nights: 2,
      guests: 4,
      totalAmount: 4800000,
      status: 'checked_in',
      channel: 'phone',
      createdAt: '2025-08-25 16:45',
    },
  ];

  const statusColumns = {
    pending: { title: 'Pending Confirmation', color: '#fa8c16', items: mockReservations.filter(r => r.status === 'pending') },
    confirmed: { title: 'Confirmed', color: '#1890ff', items: mockReservations.filter(r => r.status === 'confirmed') },
    assigned: { title: 'Room Assigned', color: '#722ed1', items: [] },
    checked_in: { title: 'Checked In', color: '#52c41a', items: mockReservations.filter(r => r.status === 'checked_in') },
    checked_out: { title: 'Checked Out', color: '#8c8c8c', items: [] },
    cancelled: { title: 'Cancelled/No-show', color: '#ff4d4f', items: [] },
  };

  const statusColors = {
    pending: "orange",
    confirmed: "blue",
    assigned: "purple",
    checked_in: "green",
    checked_out: "gray",
    cancelled: "red",
    no_show: "volcano",
  };

  const channelLabels = {
    ota: "OTA",
    website: "Website",
    walkin: "Walk-in",
    phone: "Phone",
  };

  const handleCardClick = (reservation: any) => {
    router.push(`/reservations/show/${reservation.id}`);
  };

  const actionItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'View Details',
      icon: <EyeOutlined />,
    },
    {
      key: '2',
      label: 'Edit Reservation',
      icon: <EditOutlined />,
    },
    {
      key: '3',
      label: 'Assign Room',
      icon: <CalendarOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: 'Cancel',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const ReservationCard = ({ reservation }: { reservation: any }) => (
    <Card
      size="small"
      style={{ 
        marginBottom: '8px', 
        cursor: 'pointer',
        border: '1px solid #d9d9d9',
        borderRadius: '6px'
      }}
      onClick={() => handleCardClick(reservation)}
      bodyStyle={{ padding: '12px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <Text strong>{reservation.confirmationCode}</Text>
            <Tag color={statusColors[reservation.status as keyof typeof statusColors]} style={{ marginLeft: '8px' }}>
              {reservation.status.replace('_', ' ')}
            </Tag>
          </div>
          <Text style={{ fontSize: '14px', fontWeight: 500 }}>{reservation.guestName}</Text>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            <div>{reservation.roomType} • {reservation.guests} guests</div>
            <div>{reservation.checkIn} → {reservation.checkOut}</div>
            <div>{reservation.nights} nights • {reservation.totalAmount.toLocaleString()} VNĐ</div>
          </div>
          <Tag color="default" style={{ marginTop: '4px' }}>
            {channelLabels[reservation.channel as keyof typeof channelLabels]}
          </Tag>
        </div>
        <Dropdown menu={{ items: actionItems }} placement="bottomRight">
          <Button type="text" size="small" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      </div>
    </Card>
  );

  const KanbanView = () => (
    <Row gutter={16}>
      {Object.entries(statusColumns).map(([status, column]) => (
        <Col xs={24} sm={12} lg={4} key={status}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>{column.title}</Text>
                <Tag color={column.color}>{column.items.length}</Tag>
              </div>
            }
            style={{ 
              height: '600px',
              marginBottom: '16px'
            }}
            bodyStyle={{ 
              padding: '8px',
              height: 'calc(100% - 50px)',
              overflowY: 'auto'
            }}
          >
            {column.items.map((reservation: any) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </Card>
        </Col>
      ))}
    </Row>
  );

  const ListView = () => {
    const columns = [
      {
        title: 'Confirmation Code',
        dataIndex: 'confirmationCode',
        key: 'confirmationCode',
        render: (text: string, record: any) => (
          <Button type="link" onClick={() => handleCardClick(record)}>
            {text}
          </Button>
        ),
      },
      {
        title: 'Guest',
        dataIndex: 'guestName',
        key: 'guestName',
      },
      {
        title: 'Room Type',
        dataIndex: 'roomType',
        key: 'roomType',
      },
      {
        title: 'Check-in',
        dataIndex: 'checkIn',
        key: 'checkIn',
      },
      {
        title: 'Check-out',
        dataIndex: 'checkOut',
        key: 'checkOut',
      },
      {
        title: 'Guests',
        dataIndex: 'guests',
        key: 'guests',
      },
      {
        title: 'Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (amount: number) => `${amount.toLocaleString()} VNĐ`,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {status.replace('_', ' ')}
          </Tag>
        ),
      },
      {
        title: 'Channel',
        dataIndex: 'channel',
        key: 'channel',
        render: (channel: string) => (
          <Tag color="default">
            {channelLabels[channel as keyof typeof channelLabels]}
          </Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: any) => (
          <Dropdown menu={{ items: actionItems }} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    ];

    return (
      <Card>
        <Table
          dataSource={mockReservations}
          columns={columns}
          rowKey="id"
          pagination={{
            total: mockReservations.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>Booking Pipeline</Title>
          <Text type="secondary">Track and manage reservations through all stages</Text>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/reservations/new')}>
              New Booking
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '16px' }}>
        <Space wrap>
          <Input
            placeholder="Search by confirmation code, guest name..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "assigned", label: "Room Assigned" },
              { value: "checked_in", label: "Checked In" },
              { value: "checked_out", label: "Checked Out" },
              { value: "cancelled", label: "Cancelled" },
              { value: "no_show", label: "No Show" },
            ]}
          />
          <Select
            placeholder="Filter by Channel"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, channel: value })}
            options={[
              { value: "ota", label: "OTA" },
              { value: "website", label: "Website" },
              { value: "walkin", label: "Walk-in" },
              { value: "phone", label: "Phone" },
            ]}
          />
          <RangePicker
            placeholder={["Check-in", "Check-out"]}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            style={{ width: 240 }}
          />
          <Select
            value={viewMode}
            onChange={setViewMode}
            style={{ width: 120 }}
            options={[
              { value: "kanban", label: "Kanban" },
              { value: "list", label: "List" },
            ]}
          />
        </Space>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'kanban' && <KanbanView />}
      {viewMode === 'list' && <ListView />}
    </div>
  );
}
