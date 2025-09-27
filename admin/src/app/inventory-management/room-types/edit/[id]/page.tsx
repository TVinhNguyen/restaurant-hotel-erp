"use client";

import { Edit } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Transfer, message, Row, Col, Card } from "antd";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    getMockRoomType, 
    updateMockRoomType, 
    getMockProperties,
    getMockAmenities,
    type RoomType,
    type Amenity
} from "../../../../../data/mockInventory";

const { TextArea } = Input;

export default function RoomTypeEdit() {
    const params = useParams();
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const roomType = getMockRoomType(id || '');
    const properties = getMockProperties();
    const amenities = getMockAmenities();

    useEffect(() => {
        if (roomType) {
            form.setFieldsValue({
                name: roomType.name,
                propertyId: roomType.propertyId,
                description: roomType.description,
                basePrice: roomType.basePrice,
                capacity: roomType.capacity || 2,
                bedConfiguration: roomType.bedConfiguration || roomType.bedType,
                size: roomType.size || 25,
                status: roomType.status || 'active',
            });
            setSelectedAmenities(roomType.amenityIds || roomType.amenities || []);
        }
    }, [roomType, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            const updatedRoomType: RoomType = {
                ...roomType!,
                ...values,
                amenityIds: selectedAmenities,
            };

            if (updateMockRoomType(id!, updatedRoomType)) {
                message.success('Room type updated successfully!');
                router.push('/inventory-management/room-types');
            } else {
                message.error('Error updating room type!');
            }
        } catch (error) {
            message.error('Error updating room type!');
        } finally {
            setLoading(false);
        }
    };

    if (!roomType) {
        return (
            <Edit>
                <div>Room type not found</div>
            </Edit>
        );
    }

    // Transform amenities for Transfer component
    const amenityOptions = amenities.map(amenity => ({
        key: amenity.id,
        title: amenity.name,
        description: amenity.description || '',
        category: amenity.category,
    }));

    return (
        <Edit
            isLoading={loading}
            saveButtonProps={{
                loading,
                onClick: () => form.submit(),
            }}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Basic Information" size="small">
                            <Form.Item
                                label="Room Type Name"
                                name="name"
                                rules={[{ required: true, message: 'Room type name is required!' }]}
                            >
                                <Input placeholder="e.g., Deluxe Suite" />
                            </Form.Item>

                            <Form.Item
                                label="Property"
                                name="propertyId"
                                rules={[{ required: true, message: 'Property is required!' }]}
                            >
                                <Select placeholder="Select property">
                                    {properties.map(property => (
                                        <Select.Option key={property.id} value={property.id}>
                                            {property.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <TextArea 
                                    rows={4} 
                                    placeholder="Describe the room type features..." 
                                />
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="active">Active</Select.Option>
                                    <Select.Option value="inactive">Inactive</Select.Option>
                                    <Select.Option value="maintenance">Maintenance</Select.Option>
                                </Select>
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Room Details" size="small">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Base Price (VNĐ)"
                                        name="basePrice"
                                        rules={[{ required: true, message: 'Base price is required!' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={0}
                                            step={50000}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Capacity (guests)"
                                        name="capacity"
                                        rules={[{ required: true, message: 'Capacity is required!' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={1}
                                            max={10}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Bed Configuration"
                                name="bedConfiguration"
                                rules={[{ required: true, message: 'Bed configuration is required!' }]}
                            >
                                <Select placeholder="Select bed configuration">
                                    <Select.Option value="1 King">1 King Bed</Select.Option>
                                    <Select.Option value="2 Singles">2 Single Beds</Select.Option>
                                    <Select.Option value="1 Queen">1 Queen Bed</Select.Option>
                                    <Select.Option value="2 Queens">2 Queen Beds</Select.Option>
                                    <Select.Option value="1 King + 1 Sofa">1 King + 1 Sofa Bed</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Size (m²)"
                                name="size"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={10}
                                    max={200}
                                    placeholder="Room size in square meters"
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <Card title="Amenities" size="small" style={{ marginTop: 16 }}>
                    <Transfer
                        dataSource={amenityOptions}
                        showSearch
                        filterOption={(search, item) =>
                            item.title!.toLowerCase().includes(search.toLowerCase()) ||
                            item.description!.toLowerCase().includes(search.toLowerCase())
                        }
                        targetKeys={selectedAmenities}
                        onChange={(targetKeys) => setSelectedAmenities(targetKeys as string[])}
                        render={(item) => (
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                {item.description && (
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {item.description}
                                    </div>
                                )}
                                <div style={{ fontSize: '11px', color: '#999' }}>
                                    {item.category === 'room' ? 'Room Amenity' : 'Facility'}
                                </div>
                            </div>
                        )}
                        titles={['Available Amenities', 'Selected Amenities']}
                        style={{ marginBottom: 16 }}
                    />
                </Card>
            </Form>
        </Edit>
    );
}
