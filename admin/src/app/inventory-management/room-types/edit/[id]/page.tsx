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
    const [roomTypeData, setRoomTypeData] = useState<RoomType | null>(null);
    
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const properties = getMockProperties();
    const amenities = getMockAmenities();

    useEffect(() => {
        // Fetch room type from API
        const fetchRoomType = async () => {
            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
            try {
                const response = await fetch(`${API_ENDPOINT}/room-types/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoomTypeData(data);
                    
                    form.setFieldsValue({
                        name: data.name,
                        propertyId: data.property_id,
                        description: data.description,
                        basePrice: data.base_price,
                        maxAdults: data.max_adults,
                        maxChildren: data.max_children,
                        bedType: data.bed_type,
                        capacity: data.max_adults + data.max_children,
                        bedConfiguration: data.bed_type,
                        size: data.size || 25,
                        status: data.status || 'active',
                    });

                    // Set selected amenities
                    const amenityIds = data.amenities?.map((a: any) => a.id) || [];
                    setSelectedAmenities(amenityIds);
                } else {
                    message.error('Failed to fetch room type data');
                }
            } catch (error) {
                console.error('Error fetching room type:', error);
                message.error('Error loading room type data');
            }
        };

        if (id) {
            fetchRoomType();
        }
    }, [id, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            // Step 1: Update room type basic info
            const updateData = {
                name: values.name,
                description: values.description,
                base_price: values.basePrice,
                max_adults: values.maxAdults,
                max_children: values.maxChildren,
                bed_type: values.bedType || values.bedConfiguration,
            };

            const updateResponse = await fetch(`${API_ENDPOINT}/room-types/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updateData)
            });

            if (updateResponse.ok) {
                const updatedRoomType = await updateResponse.json();
                console.log('Updated room type from API:', updatedRoomType);

                // Step 2: Update amenities
                // Get current amenities from API
                const currentAmenitiesResponse = await fetch(
                    `${API_ENDPOINT}/room-types/${id}/amenities`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );

                if (currentAmenitiesResponse.ok) {
                    const currentAmenities = await currentAmenitiesResponse.json();
                    const currentAmenityIds = currentAmenities.data?.map((a: any) => a.amenity_id) || [];

                    // Add new amenities
                    const amenitiesToAdd = selectedAmenities.filter(
                        id => !currentAmenityIds.includes(id)
                    );
                    
                    if (amenitiesToAdd.length > 0) {
                        await fetch(
                            `${API_ENDPOINT}/room-types/${id}/amenities/bulk`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify({ amenity_ids: amenitiesToAdd })
                            }
                        );
                    }

                    // Remove old amenities
                    const amenitiesToRemove = currentAmenityIds.filter(
                        (id: string) => !selectedAmenities.includes(id)
                    );
                    
                    for (const amenityId of amenitiesToRemove) {
                        await fetch(
                            `${API_ENDPOINT}/room-types/${id}/amenities/${amenityId}`,
                            {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                }
                            }
                        );
                    }
                }

                // Update mock data
                updateMockRoomType(id!, {
                    ...roomTypeData!,
                    ...values,
                    amenityIds: selectedAmenities,
                });

                message.success('Room type updated successfully!');
                router.push('/inventory-management/room-types');
            } else {
                const errorData = await updateResponse.json();
                console.error('Update room type API error:', errorData);
                message.error(errorData.message || 'Error updating room type!');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            message.error('Error updating room type!');
        } finally {
            setLoading(false);
        }
    };

    if (!roomTypeData) {
        return (
            <Edit isLoading={true}>
                <div>Loading room type data...</div>
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

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Max Adults"
                                        name="maxAdults"
                                        rules={[{ required: true, message: 'Max adults is required!' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={1}
                                            max={10}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Max Children"
                                        name="maxChildren"
                                        rules={[{ required: true, message: 'Max children is required!' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={0}
                                            max={10}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Bed Type"
                                name="bedType"
                                rules={[{ required: true, message: 'Bed type is required!' }]}
                            >
                                <Input placeholder="e.g., King Bed" />
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
