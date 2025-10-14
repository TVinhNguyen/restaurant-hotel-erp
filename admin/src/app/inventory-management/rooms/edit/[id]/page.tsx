"use client";

import { Edit } from "@refinedev/antd";
import { Form, Input, Select, message, Row, Col, Card } from "antd";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    getMockRoom, 
    updateMockRoom, 
    getMockProperties,
    type Room
} from "../../../../../data/mockInventory";

const { TextArea } = Input;

interface RoomType {
    id: string;
    name: string;
    propertyId: string;
    description?: string;
    bedType?: string;
}

export default function RoomEdit() {
    const params = useParams();
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [roomData, setRoomData] = useState<any>(null);
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [roomTypesLoading, setRoomTypesLoading] = useState(false);
    
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const properties = getMockProperties();

    // Fetch room types when property is selected
    useEffect(() => {
        const fetchRoomTypes = async () => {
            if (!selectedProperty) return;

            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
            setRoomTypesLoading(true);
            
            try {
                const response = await fetch(
                    `${API_ENDPOINT}/room-types?propertyId=${selectedProperty}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    const roomTypesData = result.data.map((rt: any) => ({
                        id: rt.id,
                        name: rt.name,
                        propertyId: rt.propertyId,
                        description: rt.description || '',
                        bedType: rt.bedType,
                    }));
                    setRoomTypes(roomTypesData);
                } else {
                    message.error('Error loading room types');
                }
            } catch (error) {
                console.error('Error fetching room types:', error);
                message.error('Error loading room types');
            } finally {
                setRoomTypesLoading(false);
            }
        };

        fetchRoomTypes();
    }, [selectedProperty]);

    useEffect(() => {
        // Fetch room from API
        const fetchRoom = async () => {
            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
            setFetchLoading(true);
            
            try {
                const response = await fetch(`${API_ENDPOINT}/rooms/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoomData(data);
                    
                    form.setFieldsValue({
                        number: data.number,
                        propertyId: data.propertyId,
                        roomTypeId: data.roomTypeId,
                        floor: data.floor,
                        viewType: data.viewType,
                        operationalStatus: data.operationalStatus,
                        housekeepingStatus: data.housekeepingStatus,
                        housekeeperNotes: data.housekeeperNotes || '',
                    });
                    setSelectedProperty(data.propertyId);
                } else {
                    message.error('Failed to fetch room data');
                }
            } catch (error) {
                console.error('Error fetching room:', error);
                message.error('Error loading room data');
            } finally {
                setFetchLoading(false);
            }
        };

        if (id) {
            fetchRoom();
        }
    }, [id, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const updateData = {
                number: values.number,
                roomTypeId: values.roomTypeId,
                floor: values.floor,
                viewType: values.viewType || null,
                operationalStatus: values.operationalStatus,
                housekeepingStatus: values.housekeepingStatus,
                housekeeperNotes: values.housekeeperNotes || null,
            };

            const response = await fetch(`${API_ENDPOINT}/rooms/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const updatedRoom = await response.json();
                console.log('Updated room from API:', updatedRoom);

                // Update mock data
                updateMockRoom(id!, updatedRoom);

                message.success('Room updated successfully!');
                router.push('/inventory-management/rooms');
            } else {
                const errorData = await response.json();
                console.error('Update room API error:', errorData);
                message.error(errorData.message || 'Error updating room!');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            message.error('Error updating room!');
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyChange = (propertyId: string) => {
        setSelectedProperty(propertyId);
        form.setFieldsValue({ roomTypeId: undefined });
    };

    return (
        <Edit
            isLoading={fetchLoading || loading}
            saveButtonProps={{
                loading,
                onClick: () => form.submit(),
                disabled: fetchLoading || !roomData,
            }}
        >
            {fetchLoading ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    Loading room data...
                </div>
            ) : !roomData ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#ff4d4f' }}>
                    Failed to load room data
                </div>
            ) : (
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Basic Information" size="small">
                            <Form.Item
                                label="Room Number"
                                name="number"
                                rules={[{ required: true, message: 'Room number is required!' }]}
                            >
                                <Input placeholder="e.g., 101, A-205" />
                            </Form.Item>

                            <Form.Item
                                label="Property"
                                name="propertyId"
                                rules={[{ required: true, message: 'Property is required!' }]}
                            >
                                <Select 
                                    placeholder="Select property"
                                    onChange={handlePropertyChange}
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
                                rules={[{ required: true, message: 'Room type is required!' }]}
                            >
                                <Select 
                                    placeholder="Select room type"
                                    loading={roomTypesLoading}
                                    disabled={!selectedProperty || roomTypesLoading}
                                    notFoundContent={!selectedProperty ? "Please select a property first" : "No room types available"}
                                >
                                    {roomTypes.map((roomType: RoomType) => (
                                        <Select.Option key={roomType.id} value={roomType.id}>
                                            {roomType.name} - {roomType.bedType || 'N/A'}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Floor"
                                name="floor"
                                rules={[{ required: true, message: 'Floor is required!' }]}
                            >
                                <Input placeholder="e.g., 1, 2, Ground" />
                            </Form.Item>

                            <Form.Item
                                label="View Type"
                                name="viewType"
                            >
                                <Select placeholder="Select view type" allowClear>
                                    <Select.Option value="City View">City View</Select.Option>
                                    <Select.Option value="Ocean View">Ocean View</Select.Option>
                                    <Select.Option value="Garden View">Garden View</Select.Option>
                                    <Select.Option value="Pool View">Pool View</Select.Option>
                                    <Select.Option value="Mountain View">Mountain View</Select.Option>
                                    <Select.Option value="No View">No View</Select.Option>
                                </Select>
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Status Management" size="small">
                            <Form.Item
                                label="Operational Status"
                                name="operationalStatus"
                                rules={[{ required: true, message: 'Operational status is required!' }]}
                            >
                                <Select placeholder="Select operational status">
                                    <Select.Option value="available">Available</Select.Option>
                                    <Select.Option value="out_of_service">Out of Service</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Housekeeping Status"
                                name="housekeepingStatus"
                                rules={[{ required: true, message: 'Housekeeping status is required!' }]}
                            >
                                <Select placeholder="Select housekeeping status">
                                    <Select.Option value="clean">Clean</Select.Option>
                                    <Select.Option value="dirty">Dirty</Select.Option>
                                    <Select.Option value="inspected">Inspected</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Housekeeper Notes"
                                name="housekeeperNotes"
                            >
                                <TextArea 
                                    rows={4} 
                                    placeholder="Any special notes from housekeeping..." 
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
            )}
        </Edit>
    );
}
