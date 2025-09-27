"use client";

import { Create } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Transfer, Card, Row, Col, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

    const properties = getMockProperties();
    const amenities = getMockAmenities();

    const amenityTransferData = amenities.map(amenity => ({
        key: amenity.id,
        title: amenity.name,
        description: amenity.description || '',
        category: amenity.category
    }));

    const handleFinish = (values: any) => {
        try {
            const propertyName = properties.find(p => p.id === values.propertyId)?.name || '';
            
            const newRoomType = {
                propertyId: values.propertyId,
                propertyName,
                name: values.name,
                description: values.description || '',
                maxAdults: values.maxAdults,
                maxChildren: values.maxChildren,
                basePrice: values.basePrice,
                bedType: values.bedType,
                amenities: targetKeys,
                photos: [],
                totalRooms: 0
            };

            addMockRoomType(newRoomType);
            message.success('Room type created successfully!');
            router.push('/inventory-management/room-types');
        } catch (error) {
            message.error('Error creating room type!');
        }
    };

    const handleTransferChange = (newTargetKeys: React.Key[]) => {
        setTargetKeys(newTargetKeys as string[]);
    };

    return (
        <Create 
            title="Create Room Type"
            saveButtonProps={{
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
                                <Select placeholder="Select property">
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
