"use client";

import { Show, TextField } from "@refinedev/antd";
import { Typography, Row, Col, Card, Tag, Descriptions, List } from "antd";
import { useState, useEffect } from "react";
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
    
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
            setLoading(true);
            
            try {
                const response = await fetch(`${API_ENDPOINT}/rooms/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoom(data);
                }
            } catch (error) {
                console.error('Error fetching room:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoom();
        }
    }, [id]);

    if (loading || !room) {
        return (
            <Show isLoading={loading}>
                <Title level={3}>Loading room...</Title>
            </Show>
        );
    }

    const property = room.property;
    const roomType = room.roomType;
    const roomAmenities = roomType?.roomTypeAmenities?.map((rta: any) => rta.amenity) || [];

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
                                <TextField value={room.floor} />
                            </Descriptions.Item>
                            <Descriptions.Item label="View Type">
                                <TextField value={room.viewType || 'Not specified'} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Status Information" size="small">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Operational Status">
                                <Tag color={getOperationalStatusColor(room.operationalStatus)}>
                                    {room.operationalStatus === 'out_of_service' ? 'Out of Service' : 'Available'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Housekeeping Status">
                                <Tag color={getHousekeepingStatusColor(room.housekeepingStatus)}>
                                    {room.housekeepingStatus.charAt(0).toUpperCase() + room.housekeepingStatus.slice(1)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Housekeeper Notes">
                                <TextField value={room.housekeeperNotes || 'No notes'} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            {roomType && (
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} md={12}>
                        <Card title="Room Type Details" size="small">
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Base Price">
                                    <Text strong>{(roomType.base_price || roomType.basePrice || 0).toLocaleString()} VNĐ</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Max Adults">
                                    <TextField value={roomType.max_adults || roomType.maxAdults || 0} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Max Children">
                                    <TextField value={roomType.max_children || roomType.maxChildren || 0} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Bed Type">
                                    <TextField value={roomType.bed_type || roomType.bedType || 'Not specified'} />
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
                                <Text type="secondary">No amenities available</Text>
                            )}
                        </Card>
                    </Col>
                </Row>
            )}
        </Show>
    );
}
