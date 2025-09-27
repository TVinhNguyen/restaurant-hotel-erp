"use client";

import { Show, TextField } from "@refinedev/antd";
import { Typography, Row, Col, Card, Tag, Descriptions, List } from "antd";
import { useParams } from "next/navigation";
import { 
    getMockAmenity, 
    getMockRoomTypes
} from "../../../../../data/mockInventory";

const { Title, Text } = Typography;

export default function AmenityShow() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const amenity = getMockAmenity(id || '');
    const allRoomTypes = getMockRoomTypes();
    
    // Get room types that use this amenity
    const roomTypesUsingAmenity = amenity ? allRoomTypes.filter(roomType => 
        (roomType.amenityIds || roomType.amenities || []).includes(amenity.id)
    ) : [];

    if (!amenity) {
        return (
            <Show>
                <Title level={3}>Amenity not found</Title>
            </Show>
        );
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'room': return 'blue';
            case 'facility': return 'green';
            default: return 'default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'inactive': return 'red';
            case 'maintenance': return 'orange';
            default: return 'default';
        }
    };

    return (
        <Show>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Amenity Information" size="small">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="ID">
                                <TextField value={amenity.id} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Name">
                                <Text strong style={{ fontSize: '16px' }}>{amenity.name}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Category">
                                <Tag color={getCategoryColor(amenity.category)}>
                                    {amenity.category === 'room' ? 'Room Amenity' : 'Facility'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">
                                <TextField value={amenity.description || 'No description provided'} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title={`Used in Room Types (${roomTypesUsingAmenity.length})`} size="small">
                        {roomTypesUsingAmenity.length > 0 ? (
                            <List
                                size="small"
                                dataSource={roomTypesUsingAmenity}
                                renderItem={(roomType) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={roomType.name}
                                            description={
                                                <div>
                                                    <div>Base Price: {(roomType.basePrice || 0).toLocaleString()} VNĐ</div>
                                                    <div>Capacity: {roomType.capacity || (roomType.maxAdults || 0) + (roomType.maxChildren || 0)} guests</div>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Tag color={getStatusColor(roomType.status || 'active')}>
                                                            {roomType.status || 'active'}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">This amenity is not used in any room types</Text>
                        )}
                    </Card>
                </Col>
            </Row>

            {amenity.category === 'room' && (
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Card title="Usage Statistics" size="small">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={8}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                            {roomTypesUsingAmenity.length}
                                        </div>
                                        <div style={{ color: '#666' }}>Room Types</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                            {roomTypesUsingAmenity.filter(rt => rt.status === 'active').length}
                                        </div>
                                        <div style={{ color: '#666' }}>Active Room Types</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                            {Math.round((roomTypesUsingAmenity.length / allRoomTypes.length) * 100)}%
                                        </div>
                                        <div style={{ color: '#666' }}>Usage Rate</div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}
        </Show>
    );
}
