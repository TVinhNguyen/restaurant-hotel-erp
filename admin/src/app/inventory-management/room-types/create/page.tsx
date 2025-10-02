"use client";

import { Create } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Transfer, Card, Row, Col, message } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
    getMockProperties,
    getMockAmenities,
    addMockRoomType 
} from "../../../../data/mockInventory";

const { TextArea } = Input;

export default function CreateRoomType() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const properties = getMockProperties();
    const amenities = getMockAmenities();

    // Get selected property from localStorage and set as default
    useEffect(() => {
        const selectedPropertyId = localStorage.getItem('selectedPropertyId');
        if (selectedPropertyId) {
            form.setFieldsValue({ propertyId: selectedPropertyId });
        }
    }, [form]);

    const amenityTransferData = amenities.map(amenity => ({
        key: amenity.id,
        title: amenity.name,
        description: amenity.description || '',
        category: amenity.category
    }));

    const handleFinish = async (values: any) => {
        setLoading(true);
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            // Step 1: Create room type
            const roomTypeData = {
                propertyId: values.propertyId,
                name: values.name,
                description: values.description || '',
                maxAdults: values.maxAdults,
                maxChildren: values.maxChildren,
                basePrice: values.basePrice,
                bedType: values.bedType,
            };

            const roomTypeResponse = await fetch(`${API_ENDPOINT}/room-types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(roomTypeData)
            });

            if (roomTypeResponse.ok) {
                const createdRoomType = await roomTypeResponse.json();
                console.log('Created room type from API:', createdRoomType);

                // Step 2: Add amenities if selected
                if (targetKeys.length > 0) {
                    const amenitiesResponse = await fetch(
                        `${API_ENDPOINT}/room-types/${createdRoomType.id}/amenities/bulk`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            },
                            body: JSON.stringify({ amenity_ids: targetKeys })
                        }
                    );

                    if (amenitiesResponse.ok) {
                        console.log('Amenities added successfully');
                    } else {
                        console.error('Failed to add amenities');
                    }
                }

                // Update mock data for UI
                const propertyName = properties.find(p => p.id === values.propertyId)?.name || '';
                addMockRoomType({
                    ...createdRoomType,
                    propertyName,
                    amenities: targetKeys,
                    photos: [],
                    totalRooms: 0
                });

                message.success('Room type created successfully!');
                router.push('/inventory-management/room-types');
            } else {
                const errorData = await roomTypeResponse.json();
                console.error('Create room type API error:', errorData);
                message.error(errorData.message || 'Error creating room type!');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            message.error('Error creating room type!');
        } finally {
            setLoading(false);
        }
    };

    const handleTransferChange = (newTargetKeys: React.Key[]) => {
        setTargetKeys(newTargetKeys as string[]);
    };

    return (
        <Create 
            title="Create Room Type"
            saveButtonProps={{
                loading,
                onClick: () => form.submit()
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Basic Information" style={{ height: '100%' }}>
                            <Form.Item
                                label="Property"
                                name="propertyId"
                                rules={[{ required: true, message: 'Please select a property!' }]}
                            >
                                <Select placeholder="Select property" disabled>
                                    {properties.map(property => (
                                        <Select.Option key={property.id} value={property.id}>
                                            {property.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Room Type Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter room type name!' }]}
                            >
                                <Input placeholder="e.g. Deluxe Room" />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <TextArea rows={3} placeholder="Room type description..." />
                            </Form.Item>

                            <Form.Item
                                label="Bed Type"
                                name="bedType"
                                rules={[{ required: true, message: 'Please enter bed type!' }]}
                            >
                                <Input placeholder="e.g. King Bed" />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Capacity & Pricing" style={{ height: '100%' }}>
                            <Form.Item
                                label="Maximum Adults"
                                name="maxAdults"
                                rules={[{ required: true, message: 'Please enter maximum adults!' }]}
                            >
                                <InputNumber min={1} max={10} style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Maximum Children"
                                name="maxChildren"
                                rules={[{ required: true, message: 'Please enter maximum children!' }]}
                            >
                                <InputNumber min={0} max={10} style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Base Price (VNĐ)"
                                name="basePrice"
                                rules={[{ required: true, message: 'Please enter base price!' }]}
                            >
                                <InputNumber
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <Card title="Amenities" style={{ marginTop: '16px' }}>
                    <Transfer
                        dataSource={amenityTransferData}
                        targetKeys={targetKeys}
                        onChange={handleTransferChange}
                        render={(item) => (
                            <div>
                                <div>{item.title}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {item.category === 'room' ? 'Room' : 'Facility'} - {item.description}
                                </div>
                            </div>
                        )}
                        titles={['Available Amenities', 'Selected Amenities']}
                        listStyle={{
                            width: '45%',
                            height: 300,
                        }}
                    />
                </Card>
            </Form>
        </Create>
    );
}
