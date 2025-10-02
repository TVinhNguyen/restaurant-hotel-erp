"use client";

import { Show, TextField, TagField } from "@refinedev/antd";
import { Typography, Row, Col, Card, Tag, List, Divider, Descriptions } from "antd";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
    getMockProperty,
    getMockRooms
} from "../../../../../data/mockInventory";

const { Title, Text } = Typography;

export default function RoomTypeShow() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const [roomType, setRoomType] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const allRooms = getMockRooms();
    
    useEffect(() => {
        const fetchRoomType = async () => {
            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
            setLoading(true);
            
            try {
                const response = await fetch(`${API_ENDPOINT}/room-types/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoomType({
                        id: data.id,
                        propertyId: data.property_id,
                        name: data.name,
                        description: data.description,
                        maxAdults: data.max_adults,
                        maxChildren: data.max_children,
                        basePrice: data.base_price,
                        bedType: data.bed_type,
                        amenities: data.amenities || [],
                        photos: data.photos || [],
                        totalRooms: data.total_rooms || 0,
                        rooms: data.rooms || [],
                    });
                }
            } catch (error) {
                console.error('Error fetching room type:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoomType();
        }
    }, [id]);

    const property = roomType ? getMockProperty(roomType.propertyId) : null;
    const roomsOfThisType = roomType ? allRooms.filter(room => 
        room.roomTypeId === roomType.id
    ) : [];

    if (loading || !roomType) {
        return (
            <Show isLoading={loading}>
                <Title level={3}>Loading room type...</Title>
            </Show>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'inactive': return 'red';
            case 'maintenance': return 'orange';
            default: return 'default';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'room': return 'blue';
            case 'facility': return 'green';
            default: return 'default';
        }
    };

    return (
        <Show>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Basic Information" size="small">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="ID">
                                <TextField value={roomType.id} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Name">
                                <TextField value={roomType.name} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Property">
                                <TextField value={property?.name || 'Unknown'} />
                            </Descriptions.Item>

                            <Descriptions.Item label="Description">
                                <TextField value={roomType.description || 'No description'} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Room Details" size="small">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Base Price">
                                <Text strong>{(roomType.basePrice || 0).toLocaleString()} VNĐ</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Max Adults">
                                <TextField value={roomType.maxAdults} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Max Children">
                                <TextField value={roomType.maxChildren} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Bed Type">
                                <TextField value={roomType.bedType} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Rooms">
                                <Tag color="blue">{roomType.totalRooms}</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card title={`Amenities (${roomType.amenities.length})`} size="small">
                        {roomType.amenities.length > 0 ? (
                            <List
                                size="small"
                                dataSource={roomType.amenities}
                                renderItem={(amenity: any) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <div>
                                                    {amenity.name}
                                                    <Tag 
                                                        color={getCategoryColor(amenity.category)}
                                                        style={{ marginLeft: 8 }}
                                                    >
                                                        {amenity.category === 'room' ? 'Room' : 'Facility'}
                                                    </Tag>
                                                </div>
                                            }
                                            description={amenity.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">No amenities assigned</Text>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title={`Rooms (${roomsOfThisType.length})`} size="small">
                        {roomsOfThisType.length > 0 ? (
                            <List
                                size="small"
                                dataSource={roomsOfThisType}
                                renderItem={(room) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={`Room ${room.number}`}
                                            description={
                                                <div>
                                                    <div>Floor {room.floor}</div>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Tag color="blue">
                                                            {room.operationalStatus}
                                                        </Tag>
                                                        <Tag color="orange">
                                                            {room.housekeepingStatus}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">No rooms of this type</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </Show>
    );
}
