"use client";

import { Show, TextField } from "@refinedev/antd";
import { Typography, Row, Col, Card, Tag, Descriptions, List } from "antd";
import { useParams } from "next/navigation";
import { 
    getMockRoom, 
    getMockProperty,
    getMockRoomType,
    getMockAmenities
} from "../../../../../data/mockInventory";

const { Title, Text } = Typography;

export default function RoomShow() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const room = getMockRoom(id || '');
    const property = room ? getMockProperty(room.propertyId) : null;
    const roomType = room ? getMockRoomType(room.roomTypeId) : null;
    const allAmenities = getMockAmenities();
    
    // Get amenities for this room type
    const roomAmenities = roomType ? allAmenities.filter(amenity => 
        (roomType.amenityIds || roomType.amenities || []).includes(amenity.id)
    ) : [];

    if (!room) {
        return (
            <Show>
                <Title level={3}>Room not found</Title>
            </Show>
        );
    }

    const getOperationalStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'green';
            case 'occupied': return 'blue';
            case 'out-of-order': return 'red';
            case 'maintenance': return 'orange';
            default: return 'default';
        }
    };

    const getHousekeepingStatusColor = (status: string) => {
        switch (status) {
            case 'clean': return 'green';
            case 'dirty': return 'red';
            case 'cleaning': return 'orange';
            case 'inspected': return 'blue';
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
                            <Descriptions.Item label="Room Number">
                                <Text strong style={{ fontSize: '16px' }}>{room.number}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Property">
                                <TextField value={property?.name || 'Unknown'} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Room Type">
                                <TextField value={roomType?.name || 'Unknown'} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Floor">
                                <TextField value={`Floor ${room.floor}`} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Status Information" size="small">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Operational Status">
                                <Tag color={getOperationalStatusColor(room.operationalStatus)}>
                                    {room.operationalStatus.charAt(0).toUpperCase() + room.operationalStatus.slice(1).replace('-', ' ')}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Housekeeping Status">
                                <Tag color={getHousekeepingStatusColor(room.housekeepingStatus)}>
                                    {room.housekeepingStatus.charAt(0).toUpperCase() + room.housekeepingStatus.slice(1)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Notes">
                                <TextField value={room.notes || 'No notes'} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            {roomType && (
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} md={12}>
                        <Card title="Room Type Details" size="small">
                            <Descriptions column={1} size="small">                            <Descriptions.Item label="Base Price">
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
                                <Descriptions.Item label="Description">
                                    <TextField value={roomType.description || 'No description'} />
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title={`Available Amenities (${roomAmenities.length})`} size="small">
                            {roomAmenities.length > 0 ? (
                                <List
                                    size="small"
                                    dataSource={roomAmenities}
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
                                <Text type="secondary">No amenities available</Text>
                            )}
                        </Card>
                    </Col>
                </Row>
            )}
        </Show>
    );
}
