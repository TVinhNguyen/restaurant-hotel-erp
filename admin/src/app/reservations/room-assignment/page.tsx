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
  Select,
  List,
  Badge,
  Tooltip,
  Divider,
  Statistic,
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  SwapOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function RoomAssignment() {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  // Mock data for unassigned reservations
  const unassignedReservations = [
    {
      id: '1',
      confirmationCode: 'BK001234',
      guestName: 'Nguyen Van A',
      roomType: 'Superior',
      checkIn: '2025-08-29',
      checkOut: '2025-08-31',
      nights: 2,
      guests: 2,
      status: 'confirmed',
      channel: 'website',
      priority: 'normal',
    },
    {
      id: '2',
      confirmationCode: 'BK001235',
      guestName: 'Tran Thi B',
      roomType: 'Deluxe',
      checkIn: '2025-08-29',
      checkOut: '2025-09-02',
      nights: 4,
      guests: 2,
      status: 'confirmed',
      channel: 'ota',
      priority: 'vip',
    },
    {
      id: '3',
      confirmationCode: 'BK001236',
      guestName: 'Le Van C',
      roomType: 'Suite',
      checkIn: '2025-08-30',
      checkOut: '2025-09-01',
      nights: 2,
      guests: 4,
      status: 'confirmed',
      channel: 'phone',
      priority: 'high',
    },
  ];

  // Mock data for rooms
  const availableRooms = [
    {
      id: '101',
      number: '101',
      type: 'Superior',
      floor: 1,
      status: 'clean',
      housekeepingStatus: 'inspected',
      features: ['City View', 'WiFi', 'AC'],
      lastGuest: null,
    },
    {
      id: '102',
      number: '102',
      type: 'Superior',
      floor: 1,
      status: 'clean',
      housekeepingStatus: 'clean',
      features: ['Garden View', 'WiFi', 'AC'],
      lastGuest: 'Checked out 2 hours ago',
    },
    {
      id: '201',
      number: '201',
      type: 'Deluxe',
      floor: 2,
      status: 'clean',
      housekeepingStatus: 'inspected',
      features: ['Ocean View', 'Balcony', 'WiFi', 'AC'],
      lastGuest: null,
    },
    {
      id: '301',
      number: '301',
      type: 'Suite',
      floor: 3,
      status: 'clean',
      housekeepingStatus: 'inspected',
      features: ['Ocean View', 'Balcony', 'Living Room', 'Kitchenette'],
      lastGuest: null,
    },
  ];

  // Mock data for assigned rooms
  const assignedRooms = [
    {
      reservationId: '4',
      confirmationCode: 'BK001237',
      guestName: 'Pham Van D',
      roomNumber: '203',
      roomType: 'Deluxe',
      checkIn: '2025-08-28',
      checkOut: '2025-08-30',
      status: 'checked_in',
      assignedAt: '2025-08-28 09:30',
      assignedBy: 'Reception Staff',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'green';
      case 'dirty': return 'orange';
      case 'maintenance': return 'red';
      default: return 'default';
    }
  };

  const getHousekeepingColor = (status: string) => {
    switch (status) {
      case 'inspected': return 'green';
      case 'clean': return 'blue';
      case 'dirty': return 'orange';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'vip': return 'gold';
      case 'high': return 'red';
      case 'normal': return 'default';
      default: return 'default';
    }
  };

  const handleAssignRoom = (reservation: any) => {
    setSelectedReservation(reservation);
    setIsAssignModalOpen(true);
  };

  const unassignedColumns = [
    {
      title: 'Confirmation',
      dataIndex: 'confirmationCode',
      key: 'confirmationCode',
      render: (code: string, record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{code}</Text>
          <Badge color={getPriorityColor(record.priority)} text={record.priority.toUpperCase()} />
        </Space>
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
      title: 'Stay Period',
      key: 'period',
      render: (record: any) => (
        <div>
          <div>{record.checkIn} → {record.checkOut}</div>
          <Text type="secondary">{record.nights} nights • {record.guests} guests</Text>
        </div>
      ),
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: string) => <Tag>{channel.toUpperCase()}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<HomeOutlined />}
            onClick={() => handleAssignRoom(record)}
          >
            Assign Room
          </Button>
          <Button size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  const assignedColumns = [
    { title: 'Confirmation', dataIndex: 'confirmationCode', key: 'confirmationCode' },
    { title: 'Guest', dataIndex: 'guestName', key: 'guestName' },
    { title: 'Room', dataIndex: 'roomNumber', key: 'roomNumber', render: (num: string) => <Text strong>Room {num}</Text> },
    { title: 'Type', dataIndex: 'roomType', key: 'roomType' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'checked_in' ? 'green' : 'blue'}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Assigned',
      key: 'assigned',
      render: (record: any) => (
        <div>
          <div>{record.assignedAt}</div>
          <Text type="secondary">by {record.assignedBy}</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<SwapOutlined />}>
            Reassign
          </Button>
          <Button size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Room Assignment</Title>
      
      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Unassigned"
              value={unassignedReservations.length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Available Rooms"
              value={availableRooms.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Assigned"
              value={assignedRooms.length}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="High Priority"
              value={unassignedReservations.filter(r => r.priority !== 'normal').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Unassigned Reservations */}
      <Card title="Reservations Awaiting Room Assignment" style={{ marginBottom: '24px' }}>
        <Table
          dataSource={unassignedReservations}
          columns={unassignedColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      {/* Currently Assigned */}
      <Card title="Currently Assigned Rooms">
        <Table
          dataSource={assignedRooms}
          columns={assignedColumns}
          rowKey="reservationId"
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      {/* Room Assignment Modal */}
      <Modal
        title={`Assign Room for ${selectedReservation?.confirmationCode}`}
        open={isAssignModalOpen}
        onCancel={() => setIsAssignModalOpen(false)}
        width={800}
        footer={null}
      >
        {selectedReservation && (
          <>
            <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#f0f2f5' }}>
              <Space direction="vertical" size="small">
                <Text><strong>Guest:</strong> {selectedReservation.guestName}</Text>
                <Text><strong>Room Type:</strong> {selectedReservation.roomType}</Text>
                <Text><strong>Period:</strong> {selectedReservation.checkIn} → {selectedReservation.checkOut}</Text>
                <Text><strong>Guests:</strong> {selectedReservation.guests} people</Text>
              </Space>
            </Card>
            
            <Title level={4}>Available Rooms - {selectedReservation.roomType}</Title>
            <List
              dataSource={availableRooms.filter(room => room.type === selectedReservation.roomType)}
              renderItem={(room) => (
                <List.Item
                  actions={[
                    <Button 
                      key="assign" 
                      type="primary" 
                      icon={<HomeOutlined />}
                      onClick={() => {
                        // Handle room assignment logic
                        setIsAssignModalOpen(false);
                      }}
                    >
                      Assign Room {room.number}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>Room {room.number}</Text>
                        <Tag color={getStatusColor(room.status)}>{room.status}</Tag>
                        <Tag color={getHousekeepingColor(room.housekeepingStatus)}>
                          {room.housekeepingStatus}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>Floor {room.floor} • {room.features.join(', ')}</div>
                        {room.lastGuest && <Text type="secondary">{room.lastGuest}</Text>}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

            {/* Override Assignment Options */}
            <Divider />
            <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
              <Space direction="vertical">
                <Text strong style={{ color: '#fa8c16' }}>
                  <WarningOutlined /> Override Options
                </Text>
                <Text type="secondary">
                  Allow assignment to rooms that may not be in perfect condition
                </Text>
                <Space>
                  <Button size="small" onClick={() => setIsAssignModalOpen(false)}>
                    Assign to Clean Room
                  </Button>
                  <Button size="small" type="dashed">
                    Assign to Maintenance Room
                  </Button>
                </Space>
              </Space>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
}
