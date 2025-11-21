"use client";

import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag } from "antd";
import { useState, useEffect } from "react";
import { 
    getMockRooms, 
    deleteMockRoom, 
    getMockProperties,
    getMockRoomTypes,
    type Room 
} from "../../../data/mockInventory";
import { PlusOutlined, SearchOutlined, HomeOutlined, ToolOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Search } = Input;

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [searchText, setSearchText] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('');
    const [roomTypeFilter, setRoomTypeFilter] = useState('all');
    const [operationalStatusFilter, setOperationalStatusFilter] = useState('all');
    const [housekeepingStatusFilter, setHousekeepingStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const properties = getMockProperties();
    const roomTypes = getMockRoomTypes();

    useEffect(() => {
        // Get selected property from localStorage
        const selectedPropertyId = localStorage.getItem('selectedPropertyId');
        if (selectedPropertyId) {
            setPropertyFilter(selectedPropertyId);
            fetchRooms(selectedPropertyId);
        }
    }, []);

    const fetchRooms = async (propertyId: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        setLoading(true);
        
        try {
            const response = await fetch(
                `${API_ENDPOINT}/rooms?propertyId=${propertyId}&limit=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const roomsData = result.data.map((r: any) => ({
                    id: r.id,
                    propertyId: r.propertyId,
                    propertyName: r.property?.name || '',
                    roomTypeId: r.roomTypeId,
                    roomTypeName: r.roomType?.name || '',
                    number: r.number,
                    floor: r.floor,
                    viewType: r.viewType,
                    operationalStatus: r.operationalStatus,
                    housekeepingStatus: r.housekeepingStatus,
                    housekeeperNotes: r.housekeeperNotes,
                }));
                setRooms(roomsData);
                setFilteredRooms(roomsData);
            } else {
                message.error('Error loading rooms');
                // Fallback to mock data
                const mockData = getMockRooms().filter(r => r.propertyId === propertyId);
                setRooms(mockData);
                setFilteredRooms(mockData);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            message.error('Error loading rooms');
            // Fallback to mock data
            const mockData = getMockRooms().filter(r => r.propertyId === propertyId);
            setRooms(mockData);
            setFilteredRooms(mockData);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/rooms/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                message.success('Room deleted successfully!');
                // Remove from local state
                const updatedRooms = rooms.filter(r => r.id !== id);
                setRooms(updatedRooms);
                setFilteredRooms(updatedRooms);
                
                // Also update mock data
                deleteMockRoom(id);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error deleting room!');
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            message.error('Error deleting room!');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        filterRooms(value, propertyFilter, roomTypeFilter, operationalStatusFilter, housekeepingStatusFilter);
    };

    const handlePropertyFilter = (value: string) => {
        setPropertyFilter(value);
        filterRooms(searchText, value, roomTypeFilter, operationalStatusFilter, housekeepingStatusFilter);
    };

    const handleRoomTypeFilter = (value: string) => {
        setRoomTypeFilter(value);
        filterRooms(searchText, propertyFilter, value, operationalStatusFilter, housekeepingStatusFilter);
    };

    const handleOperationalStatusFilter = (value: string) => {
        setOperationalStatusFilter(value);
        filterRooms(searchText, propertyFilter, roomTypeFilter, value, housekeepingStatusFilter);
    };

    const handleHousekeepingStatusFilter = (value: string) => {
        setHousekeepingStatusFilter(value);
        filterRooms(searchText, propertyFilter, roomTypeFilter, operationalStatusFilter, value);
    };

    const filterRooms = (search: string, property: string, roomType: string, operationalStatus: string, housekeepingStatus: string) => {
        let filtered = rooms;

        if (search) {
            filtered = filtered.filter(room =>
                room.number.toLowerCase().includes(search.toLowerCase()) ||
                (room.floor || '').toLowerCase().includes(search.toLowerCase()) ||
                (room.viewType || '').toLowerCase().includes(search.toLowerCase()) ||
                (room.propertyName || '').toLowerCase().includes(search.toLowerCase()) ||
                (room.roomTypeName || '').toLowerCase().includes(search.toLowerCase())
            );
        }

        if (property !== 'all') {
            filtered = filtered.filter(room => room.propertyId === property);
        }

        if (roomType !== 'all') {
            filtered = filtered.filter(room => room.roomTypeId === roomType);
        }

        if (operationalStatus !== 'all') {
            filtered = filtered.filter(room => room.operationalStatus === operationalStatus);
        }

        if (housekeepingStatus !== 'all') {
            filtered = filtered.filter(room => room.housekeepingStatus === housekeepingStatus);
        }

        setFilteredRooms(filtered);
    };

    const getOperationalStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'green';
            case 'out_of_service': return 'red';
            default: return 'default';
        }
    };

    const getHousekeepingStatusColor = (status: string) => {
        switch (status) {
            case 'clean': return 'green';
            case 'dirty': return 'red';
            case 'inspected': return 'blue';
            default: return 'default';
        }
    };

    const tableProps = {
        dataSource: filteredRooms,
        loading,
        pagination: {
            pageSize: 10,
            total: filteredRooms.length,
            showSizeChanger: true,
            showQuickJumper: true,
        },
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <HomeOutlined style={{ marginRight: '8px' }} />
                        Rooms Management
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/inventory-management/rooms/create')}
                    >
                        Add Room
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <Search
                            placeholder="Search rooms..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            placeholder="Property"
                            style={{ width: '100%' }}
                            value={propertyFilter}
                            onChange={handlePropertyFilter}
                        >
                            <Select.Option value="all">All Properties</Select.Option>
                            {properties.map(property => (
                                <Select.Option key={property.id} value={property.id}>
                                    {property.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            placeholder="Room Type"
                            style={{ width: '100%' }}
                            value={roomTypeFilter}
                            onChange={handleRoomTypeFilter}
                        >
                            <Select.Option value="all">All Room Types</Select.Option>
                            {roomTypes.map(roomType => (
                                <Select.Option key={roomType.id} value={roomType.id}>
                                    {roomType.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            placeholder="Operational"
                            style={{ width: '100%' }}
                            value={operationalStatusFilter}
                            onChange={handleOperationalStatusFilter}
                        >
                            <Select.Option value="all">All Status</Select.Option>
                            <Select.Option value="available">Available</Select.Option>
                            <Select.Option value="out_of_service">Out of Service</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            placeholder="Housekeeping"
                            style={{ width: '100%' }}
                            value={housekeepingStatusFilter}
                            onChange={handleHousekeepingStatusFilter}
                        >
                            <Select.Option value="all">All Status</Select.Option>
                            <Select.Option value="clean">Clean</Select.Option>
                            <Select.Option value="dirty">Dirty</Select.Option>
                            <Select.Option value="inspected">Inspected</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={2}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#666' }}>
                                {filteredRooms.length}/{rooms.length}
                            </span>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Rooms Table */}
            <Card>
                <List>
                    <Table {...tableProps} rowKey="id" scroll={{ x: 1000 }}>
                        <Table.Column
                            dataIndex="number"
                            title="Room Number"
                            width={100}
                            sorter={(a: Room, b: Room) => a.number.localeCompare(b.number)}
                            render={(number: string, record: Room) => (
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>Room {number}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>Floor {record.floor || 'N/A'}</div>
                                </div>
                            )}
                        />
                        <Table.Column
                            dataIndex="propertyName"
                            title="Property"
                            sorter={(a: Room, b: Room) => (a.propertyName || '').localeCompare(b.propertyName || '')}
                            responsive={['md']}
                        />
                        <Table.Column
                            dataIndex="roomTypeName"
                            title="Room Type"
                            sorter={(a: Room, b: Room) => (a.roomTypeName || '').localeCompare(b.roomTypeName || '')}
                        />
                        <Table.Column
                            dataIndex="viewType"
                            title="View Type"
                            responsive={['lg']}
                        />
                        <Table.Column
                            dataIndex="operationalStatus"
                            title="Operational Status"
                            render={(status: string) => (
                                <Tag color={getOperationalStatusColor(status)}>
                                    {status === 'available' ? 'Available' : 'Out of Service'}
                                </Tag>
                            )}
                            filters={[
                                { text: 'Available', value: 'available' },
                                { text: 'Out of Service', value: 'out_of_service' },
                            ]}
                            onFilter={(value: any, record: Room) => record.operationalStatus === value}
                        />
                        <Table.Column
                            dataIndex="housekeepingStatus"
                            title="Housekeeping Status"
                            render={(status: string) => (
                                <Tag color={getHousekeepingStatusColor(status)}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Tag>
                            )}
                            filters={[
                                { text: 'Clean', value: 'clean' },
                                { text: 'Dirty', value: 'dirty' },
                                { text: 'Inspected', value: 'inspected' },
                            ]}
                            onFilter={(value: any, record: Room) => record.housekeepingStatus === value}
                        />
                        <Table.Column
                            dataIndex="housekeeperNotes"
                            title="Notes"
                            responsive={['lg']}
                            render={(notes: string) => (
                                <div style={{ maxWidth: '150px' }}>
                                    {notes ? (
                                        <span style={{ fontSize: '12px' }}>
                                            {notes.length > 30 ? `${notes.substring(0, 30)}...` : notes}
                                        </span>
                                    ) : '-'}
                                </div>
                            )}
                        />
                        <Table.Column
                            title="Actions"
                            dataIndex="actions"
                            fixed="right"
                            width={160}
                            render={(_, record: BaseRecord) => (
                                <Space direction="vertical" size="small">
                                    <Space size="small">
                                        <ShowButton hideText size="small" recordItemId={record.id} />
                                        <EditButton hideText size="small" recordItemId={record.id} />
                                        <DeleteButton
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                            onSuccess={() => handleDelete(String(record.id))}
                                        />
                                    </Space>
                                    <Button
                                        size="small"
                                        type="link"
                                        icon={<ToolOutlined />}
                                        onClick={() => router.push(`/inventory-management/rooms/${record.id}/maintenance`)}
                                        style={{ padding: '0', height: 'auto' }}
                                    >
                                        Maintenance
                                    </Button>
                                </Space>
                            )}
                        />
                    </Table>
                </List>
            </Card>
        </div>
    );
}
