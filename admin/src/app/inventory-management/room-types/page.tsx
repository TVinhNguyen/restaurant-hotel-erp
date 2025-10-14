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
    getMockRoomTypes, 
    deleteMockRoomType, 
    getMockProperties,
    getMockAmenities,
    type RoomType 
} from "../../../data/mockInventory";
import { PlusOutlined, SearchOutlined, AppstoreOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Search } = Input;

export default function RoomTypesPage() {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>([]);
    const [searchText, setSearchText] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const properties = getMockProperties();
    const amenities = getMockAmenities();

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const fetchRoomTypes = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const selectedPropertyId = localStorage.getItem('selectedPropertyId');
        
        if (!selectedPropertyId) {
            message.warning('Please select a property first');
            setLoading(false);
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch(
                `${API_ENDPOINT}/room-types?propertyId=${selectedPropertyId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                const roomTypesData = data.data.map((rt: any) => ({
                    id: rt.id,
                    propertyId: rt.propertyId,
                    propertyName: rt.property?.name || 'Unknown Property',
                    name: rt.name,
                    description: rt.description,
                    maxAdults: rt.maxAdults,
                    maxChildren: rt.maxChildren,
                    basePrice: parseFloat(rt.basePrice),
                    bedType: rt.bedType,
                    amenities: rt.roomTypeAmenities?.map((rta: any) => rta.amenity?.id).filter(Boolean) || [],
                    photos: rt.photos || [],
                    totalRooms: rt.rooms?.length || 0,
                }));

                setRoomTypes(roomTypesData);
                setFilteredRoomTypes(roomTypesData);
            } else {
                const errorData = await response.json();
                console.error('Fetch room types API error:', errorData);
                message.error(errorData.message || 'Error loading room types');
            }
        } catch (error) {
            console.error('Error fetching room types:', error);
            message.error('Error loading room types');
            // Fallback to mock data
            const mockData = getMockRoomTypes();
            setRoomTypes(mockData);
            setFilteredRoomTypes(mockData);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/room-types/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                message.success('Room type deleted successfully!');
                // Remove from local state
                const updatedRoomTypes = roomTypes.filter(rt => rt.id !== id);
                setRoomTypes(updatedRoomTypes);
                setFilteredRoomTypes(updatedRoomTypes);
                
                // Also update mock data
                deleteMockRoomType(id);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error deleting room type!');
            }
        } catch (error) {
            console.error('Error deleting room type:', error);
            message.error('Error deleting room type!');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        filterRoomTypes(value, propertyFilter);
    };

    const handlePropertyFilter = (value: string) => {
        setPropertyFilter(value);
        filterRoomTypes(searchText, value);
    };

    const filterRoomTypes = (search: string, property: string) => {
        let filtered = roomTypes;

        if (search) {
            filtered = filtered.filter(roomType =>
                roomType.name.toLowerCase().includes(search.toLowerCase()) ||
                (roomType.description || '').toLowerCase().includes(search.toLowerCase()) ||
                (roomType.propertyName || '').toLowerCase().includes(search.toLowerCase()) ||
                (roomType.bedType || '').toLowerCase().includes(search.toLowerCase())
            );
        }

        if (property !== 'all') {
            filtered = filtered.filter(roomType => roomType.propertyId === property);
        }

        setFilteredRoomTypes(filtered);
    };

    const getAmenityNames = (amenityIds: string[]) => {
        return amenityIds.map(id => {
            const amenity = amenities.find(a => a.id === id);
            return amenity ? amenity.name : '';
        }).filter(name => name).join(', ');
    };

    const tableProps = {
        dataSource: filteredRoomTypes,
        loading,
        pagination: {
            pageSize: 10,
            total: filteredRoomTypes.length,
            showSizeChanger: true,
            showQuickJumper: true,
        },
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <AppstoreOutlined style={{ marginRight: '8px' }} />
                        Room Types Management
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/inventory-management/room-types/create')}
                    >
                        Add Room Type
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search room types..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={6} md={6}>
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
                    <Col xs={24} sm={24} md={10}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#666' }}>
                                Showing {filteredRoomTypes.length} of {roomTypes.length} room types
                            </span>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Room Types Table */}
            <Card>
                <List>
                    <Table {...tableProps} rowKey="id" scroll={{ x: 1000 }}>
                        
                        <Table.Column
                            dataIndex="name"
                            title="Room Type"
                            sorter={(a: RoomType, b: RoomType) => a.name.localeCompare(b.name)}
                            render={(name: string, record: RoomType) => (
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{record.description || 'No description'}</div>
                                </div>
                            )}
                        />
                        <Table.Column
                            dataIndex="propertyName"
                            title="Property"
                            sorter={(a: RoomType, b: RoomType) => (a.propertyName || '').localeCompare(b.propertyName || '')}
                            responsive={['md']}
                        />
                        <Table.Column
                            title="Capacity"
                            render={(_, record: RoomType) => (
                                <div>
                                    <div>{record.maxAdults || 0} Adults</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {record.maxChildren || 0} Children
                                    </div>
                                </div>
                            )}
                        />
                        <Table.Column
                            dataIndex="basePrice"
                            title="Base Price"
                            sorter={(a: RoomType, b: RoomType) => (a.basePrice || 0) - (b.basePrice || 0)}
                            render={(price: number) => `${price?.toLocaleString() || 0} VNĐ`}
                        />
                        <Table.Column
                            dataIndex="bedType"
                            title="Bed Type"
                            responsive={['lg']}
                        />
                        <Table.Column
                            title="Amenities"
                            dataIndex="amenities"
                            responsive={['lg']}
                            render={(amenityIds: string[]) => (
                                <div style={{ maxWidth: '200px' }}>
                                    <Tag color="blue">{amenityIds.length} amenities</Tag>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                        {getAmenityNames(amenityIds).substring(0, 50)}
                                        {getAmenityNames(amenityIds).length > 50 ? '...' : ''}
                                    </div>
                                </div>
                            )}
                        />
                        <Table.Column
                            dataIndex="totalRooms"
                            title="Total Rooms"
                            width={100}
                            sorter={(a: RoomType, b: RoomType) => (a.totalRooms || 0) - (b.totalRooms || 0)}
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
                                        icon={<EyeOutlined />}
                                        onClick={() => router.push(`/inventory-management/rooms?roomType=${record.id}`)}
                                        style={{ padding: '0', height: 'auto' }}
                                    >
                                        View Rooms
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
