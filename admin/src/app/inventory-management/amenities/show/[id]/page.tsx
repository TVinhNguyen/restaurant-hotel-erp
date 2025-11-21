"use client";

import { Show, TextField } from "@refinedev/antd";
import { Typography, Row, Col, Card, Tag, Descriptions, List } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
    getMockAmenity, 
    getMockRoomTypes
} from "../../../../../data/mockInventory";

const { Title, Text } = Typography;

export default function AmenityShow() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const [amenity, setAmenity] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAmenity = async () => {
            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
            setLoading(true);
            
            try {
                const response = await fetch(`${API_ENDPOINT}/amenities/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAmenity(data);
                }
            } catch (error) {
                console.error('Error fetching amenity:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAmenity();
        }
    }, [id]);
    
    // Get room types that use this amenity
    const roomTypesUsingAmenity = amenity && amenity.roomTypeAmenities 
        ? amenity.roomTypeAmenities.map((rta: any) => rta.roomType).filter(Boolean)
        : [];

    if (loading || !amenity) {
        return (
            <Show isLoading={loading}>
                <Title level={3}>Loading amenity...</Title>
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
                            
                            <Descriptions.Item label="Name">
                                <Text strong style={{ fontSize: '16px' }}>{amenity.name}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Category">
                                <Tag color={getCategoryColor(amenity.category)}>
                                    {amenity.category === 'room' ? 'Room Amenity' : 'Facility'}
                                </Tag>
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
                                renderItem={(roomType: any) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={roomType.name}
                                            description={
                                                <div>
                                                    <div>Property: {roomType.property?.name || 'Unknown'}</div>
                                                    <div style={{ marginTop: 4 }}>
                                                        <Tag color="blue">Room Type</Tag>
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

            {roomTypesUsingAmenity.length > 0 && (
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Card title="Usage Statistics" size="small">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                            {roomTypesUsingAmenity.length}
                                        </div>
                                        <div style={{ color: '#666' }}>Room Types Using This Amenity</div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                            {amenity.category === 'room' ? 'Room Amenity' : 'Facility Amenity'}
                                        </div>
                                        <div style={{ color: '#666' }}>Category</div>
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
