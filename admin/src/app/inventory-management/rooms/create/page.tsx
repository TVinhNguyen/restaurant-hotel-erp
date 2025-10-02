"use client";

import { Create } from "@refinedev/antd";
import { Form, Input, Select, Card, Row, Col, message } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    getMockProperties,
    getMockRoomTypes,
    addMockRoom 
} from "../../../../data/mockInventory";

const { TextArea } = Input;

export default function CreateRoom() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [propertyId, setPropertyId] = useState('');
    const router = useRouter();

    const properties = getMockProperties();
    const roomTypes = getMockRoomTypes();

    useEffect(() => {
        // Get selected property from localStorage
        const selectedPropertyId = localStorage.getItem('selectedPropertyId');
        if (selectedPropertyId) {
            setPropertyId(selectedPropertyId);
            form.setFieldsValue({ propertyId: selectedPropertyId });
        }
    }, [form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const roomData = {
                propertyId: values.propertyId,
                roomTypeId: values.roomTypeId,
                number: values.number,
                floor: values.floor,
                viewType: values.viewType || null,
                operationalStatus: values.operationalStatus || 'available',
                housekeepingStatus: values.housekeepingStatus || 'clean',
                housekeeperNotes: values.housekeeperNotes || null
            };

            const response = await fetch(`${API_ENDPOINT}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(roomData)
            });

            if (response.ok) {
                const createdRoom = await response.json();
                console.log('Created room from API:', createdRoom);

                // Update mock data for UI
                const property = properties.find(p => p.id === values.propertyId);
                const roomType = roomTypes.find(rt => rt.id === values.roomTypeId);
                addMockRoom({
                    ...createdRoom,
                    propertyName: property?.name || '',
                    roomTypeName: roomType?.name || '',
                });

                message.success('Room created successfully!');
                router.push('/inventory-management/rooms');
            } else {
                const errorData = await response.json();
                console.error('Create room API error:', errorData);
                message.error(errorData.message || 'Error creating room!');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            message.error('Error creating room!');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredRoomTypes = (propertyId: string) => {
        return roomTypes.filter(rt => rt.propertyId === propertyId);
    };

    return (
        <Create 
            title="Create Room"
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
                                <Select 
                                    placeholder="Select property"
                                    onChange={() => form.setFieldsValue({ roomTypeId: undefined })}
                                    disabled
                                >
                                    {properties.map(property => (
                                        <Select.Option key={property.id} value={property.id}>
                                            {property.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Room Type"
                                name="roomTypeId"
                                dependencies={['propertyId']}
                                rules={[{ required: true, message: 'Please select a room type!' }]}
                            >
                                <Select placeholder="Select room type">
                                    {form.getFieldValue('propertyId') && 
                                        getFilteredRoomTypes(form.getFieldValue('propertyId')).map(roomType => (
                                            <Select.Option key={roomType.id} value={roomType.id}>
                                                {roomType.name}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Room Number"
                                name="number"
                                rules={[{ required: true, message: 'Please enter room number!' }]}
                            >
                                <Input placeholder="e.g. 101" />
                            </Form.Item>

                            <Form.Item
                                label="Floor"
                                name="floor"
                                rules={[{ required: true, message: 'Please enter floor!' }]}
                            >
                                <Input placeholder="e.g. 1" />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Room Details" style={{ height: '100%' }}>
                            <Form.Item
                                label="View Type"
                                name="viewType"
                                rules={[{ required: true, message: 'Please select view type!' }]}
                            >
                                <Select placeholder="Select view type">
                                    <Select.Option value="City View">City View</Select.Option>
                                    <Select.Option value="Garden View">Garden View</Select.Option>
                                    <Select.Option value="Ocean View">Ocean View</Select.Option>
                                    <Select.Option value="Pool View">Pool View</Select.Option>
                                    <Select.Option value="Mountain View">Mountain View</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Operational Status"
                                name="operationalStatus"
                                initialValue="available"
                            >
                                <Select>
                                    <Select.Option value="available">Available</Select.Option>
                                    <Select.Option value="out_of_service">Out of Service</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Housekeeping Status"
                                name="housekeepingStatus"
                                initialValue="clean"
                            >
                                <Select>
                                    <Select.Option value="clean">Clean</Select.Option>
                                    <Select.Option value="dirty">Dirty</Select.Option>
                                    <Select.Option value="inspected">Inspected</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Housekeeper Notes"
                                name="housekeeperNotes"
                            >
                                <TextArea rows={3} placeholder="Any special notes..." />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
}
