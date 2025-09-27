"use client";

import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag } from "antd";
import { useState } from "react";
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
    const [rooms, setRooms] = useState<Room[]>(getMockRooms());
    const [filteredRooms, setFilteredRooms] = useState<Room[]>(getMockRooms());
    const [searchText, setSearchText] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('all');
    const [roomTypeFilter, setRoomTypeFilter] = useState('all');
    const [operationalStatusFilter, setOperationalStatusFilter] = useState('all');
    const [housekeepingStatusFilter, setHousekeepingStatusFilter] = useState('all');
    const router = useRouter();

    const properties = getMockProperties();
    const roomTypes = getMockRoomTypes();

    const handleDelete = (id: string) => {
        if (deleteMockRoom(id)) {
            const updatedRooms = getMockRooms();
            setRooms(updatedRooms);
            setFilteredRooms(updatedRooms);
            message.success('Room deleted successfully!');
        } else {
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
