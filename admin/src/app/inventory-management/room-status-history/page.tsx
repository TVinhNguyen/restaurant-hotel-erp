"use client";

import { List, Table, Card, Row, Col, Tag, Typography, Select, DatePicker, Space, Button, message, Spin } from "antd";
import { HistoryOutlined, UserOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface RoomStatusHistoryRecord {
    id: string;
    roomId: string;
    statusType: 'operational' | 'housekeeping';
    status: string;
    changedAt: string;
    changedBy: string | null;
    notes: string | null;
    room?: {
        id: string;
        number: string;
        property?: {
            name: string;
        };
    };
    changedByEmployee?: {
        fullName: string;
    };
}

interface Room {
    id: string;
    number: string;
    propertyId: string;
    property?: {
        id: string;
        name: string;
    };
}

interface Property {
    id: string;
    name: string;
}

export default function RoomStatusHistoryPage() {
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [dateRange, setDateRange] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<RoomStatusHistoryRecord[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);

    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

    // Fetch data from API
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            // Fetch room status history
            const historyResponse = await fetch(`${API_ENDPOINT}/rooms/status-history?limit=1000`, { headers });
            if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                setHistory(historyData.data || []);
            }

            // Fetch rooms
            const roomsResponse = await fetch(`${API_ENDPOINT}/rooms?limit=1000`, { headers });
            if (roomsResponse.ok) {
                const roomsData = await roomsResponse.json();
                setRooms(roomsData.data || []);
            }

            // Fetch properties
            const propertiesResponse = await fetch(`${API_ENDPOINT}/properties`, { headers });
            if (propertiesResponse.ok) {
                const propertiesData = await propertiesResponse.json();
                setProperties(propertiesData.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to load status history');
        } finally {
            setLoading(false);
        }
    };

    // Filter history based on selections
    const filteredHistory = history.filter(record => {
        if (selectedRoom && record.roomId !== selectedRoom) return false;
        if (selectedProperty) {
            const room = rooms.find(r => r.id === record.roomId);
            if (!room || room.property?.id !== selectedProperty) return false;
        }
        if (dateRange && dateRange.length === 2) {
            const recordDate = dayjs(record.changedAt);
            const [start, end] = dateRange;
            if (recordDate.isBefore(start) || recordDate.isAfter(end)) return false;
        }
        return true;
    });

    const getStatusColor = (statusType: string, status: string) => {
        if (statusType === 'operational') {
            return status === 'available' ? 'green' : 'red';
        } else {
            switch (status) {
                case 'clean': return 'green';
                case 'dirty': return 'red';
                case 'inspected': return 'blue';
                default: return 'default';
            }
        }
    };

    const columns = [
        {
            title: 'Room',
            dataIndex: 'roomId',
            key: 'roomId',
            render: (roomId: string, record: RoomStatusHistoryRecord) => {
                const propertyName = record.room?.property?.name || 'Unknown Property';
                const roomNumber = record.room?.number || 'Unknown Room';
                return `${propertyName} - Room ${roomNumber}`;
            },
        },
        {
            title: 'Status Type',
            dataIndex: 'statusType',
            key: 'statusType',
            render: (statusType: string) => (
                <Tag color={statusType === 'operational' ? 'blue' : 'orange'}>
                    {statusType === 'operational' ? 'Operational' : 'Housekeeping'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => (
                <Tag color={getStatusColor(record.statusType, status)}>
                    {status.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Changed At',
            dataIndex: 'changedAt',
            key: 'changedAt',
            render: (date: string) => (
                <Space>
                    <ClockCircleOutlined />
                    {dayjs(date).format('DD/MM/YYYY HH:mm:ss')}
                </Space>
            ),
        },
        {
            title: 'Changed By',
            dataIndex: 'changedBy',
            key: 'changedBy',
            render: (changedBy: string | null, record: RoomStatusHistoryRecord) => {
                const name = record.changedByEmployee?.fullName;
                return name ? (
                    <Space>
                        <UserOutlined />
                        {name}
                    </Space>
                ) : <Text type="secondary">System</Text>;
            },
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes: string) => notes ? (
                <Space>
                    <FileTextOutlined />
                    {notes}
                </Space>
            ) : <Text type="secondary">-</Text>,
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <HistoryOutlined style={{ marginRight: '8px' }} />
                        Room Status History
                    </Title>
                    <Text type="secondary">Track room status changes and maintenance history</Text>
                </Col>
                <Col>
                    <Button onClick={fetchData} loading={loading}>
                        Refresh
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Property"
                            allowClear
                            value={selectedProperty || undefined}
                            onChange={setSelectedProperty}
                        >
                            {properties.map(property => (
                                <Select.Option key={property.id} value={property.id}>
                                    {property.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Room"
                            allowClear
                            value={selectedRoom || undefined}
                            onChange={setSelectedRoom}
                        >
                            {rooms
                                .filter(room => !selectedProperty || room.property?.id === selectedProperty)
                                .map(room => (
                                    <Select.Option key={room.id} value={room.id}>
                                        Room {room.number} ({room.property?.name || 'N/A'})
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={8}>
                        <RangePicker
                            style={{ width: '100%' }}
                            placeholder={['Start Date', 'End Date']}
                            value={dateRange}
                            onChange={setDateRange}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={4}>
                        <Button 
                            onClick={() => {
                                setSelectedRoom('');
                                setSelectedProperty('');
                                setDateRange(null);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <HistoryOutlined style={{ color: '#1890ff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{filteredHistory.length}</div>
                                <div style={{ color: '#666' }}>Total Records</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <UserOutlined style={{ color: '#52c41a' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                    {filteredHistory.filter(h => h.statusType === 'operational').length}
                                </div>
                                <div style={{ color: '#666' }}>Operational Changes</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <ClockCircleOutlined style={{ color: '#faad14' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                    {filteredHistory.filter(h => h.statusType === 'housekeeping').length}
                                </div>
                                <div style={{ color: '#666' }}>Housekeeping Changes</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Space>
                            <FileTextOutlined style={{ color: '#722ed1' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                    {filteredHistory.filter(h => h.notes).length}
                                </div>
                                <div style={{ color: '#666' }}>With Notes</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* History Table */}
            <Card title="Status Change History">
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={filteredHistory}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} of ${total} records`,
                        }}
                        scroll={{ x: 1000 }}
                    />
                </Spin>
            </Card>
        </div>
    );
}
