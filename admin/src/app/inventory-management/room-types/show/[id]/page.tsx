"use client";

import { Show, TextField, TagField } from "@refinedev/antd";
import { Typography, Row, Col, Card, Tag, List, Divider, Descriptions } from "antd";
import { useParams } from "next/navigation";
import { 
    getMockRoomType, 
    getMockProperty,
    getMockAmenities,
    getMockRooms
} from "../../../../../data/mockInventory";

const { Title, Text } = Typography;

export default function RoomTypeShow() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const roomType = getMockRoomType(id || '');
    const property = roomType ? getMockProperty(roomType.propertyId) : null;
    const allAmenities = getMockAmenities();
    const allRooms = getMockRooms();
    
    // Get amenities for this room type
    const roomTypeAmenities = roomType ? allAmenities.filter(amenity => 
        (roomType.amenityIds || roomType.amenities || []).includes(amenity.id)
    ) : [];
    
    // Get rooms of this type
    const roomsOfThisType = roomType ? allRooms.filter(room => 
        room.roomTypeId === roomType.id
    ) : [];

    if (!roomType) {
        return (
            <Show>
                <Title level={3}>Room type not found</Title>
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
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(roomType.status || 'active')}>
                                    {(roomType.status || 'active').charAt(0).toUpperCase() + (roomType.status || 'active').slice(1)}
                                </Tag>
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
                            <Descriptions.Item label="Capacity">
                                <TextField value={`${roomType.capacity} guests`} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Bed Configuration">
                                <TextField value={roomType.bedConfiguration} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Size">
                                <TextField value={roomType.size ? `${roomType.size} m²` : 'Not specified'} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card title={`Amenities (${roomTypeAmenities.length})`} size="small">
                        {roomTypeAmenities.length > 0 ? (
                            <List
                                size="small"
                                dataSource={roomTypeAmenities}
                                renderItem={(amenity) => (
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
