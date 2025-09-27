"use client";

import { Edit } from "@refinedev/antd";
import { Form, Input, Select, message, Row, Col, Card } from "antd";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    getMockRoom, 
    updateMockRoom, 
    getMockProperties,
    getMockRoomTypes,
    type Room
} from "../../../../../data/mockInventory";

const { TextArea } = Input;

export default function RoomEdit() {
    const params = useParams();
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const room = getMockRoom(id || '');
    const properties = getMockProperties();
    const allRoomTypes = getMockRoomTypes();

    // Filter room types by selected property
    const availableRoomTypes = selectedProperty 
        ? allRoomTypes.filter(rt => rt.propertyId === selectedProperty)
        : allRoomTypes;

    useEffect(() => {
        if (room) {
            form.setFieldsValue({
                number: room.number,
                propertyId: room.propertyId,
                roomTypeId: room.roomTypeId,
                floor: room.floor,
                operationalStatus: room.operationalStatus,
                housekeepingStatus: room.housekeepingStatus,
                notes: room.notes || '',
            });
            setSelectedProperty(room.propertyId);
        }
    }, [room, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            const updatedRoom: Room = {
                ...room!,
                ...values,
            };

            if (updateMockRoom(id!, updatedRoom)) {
                message.success('Room updated successfully!');
                router.push('/inventory-management/rooms');
            } else {
                message.error('Error updating room!');
            }
        } catch (error) {
            message.error('Error updating room!');
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyChange = (propertyId: string) => {
        setSelectedProperty(propertyId);
        form.setFieldsValue({ roomTypeId: undefined });
    };

    if (!room) {
        return (
            <Edit>
                <div>Room not found</div>
            </Edit>
        );
    }

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
                                    disabled={!selectedProperty}
                                    notFoundContent={!selectedProperty ? "Please select a property first" : "No room types available"}
                                >
                                    {availableRoomTypes.map(roomType => (
                                        <Select.Option key={roomType.id} value={roomType.id}>
                                            {roomType.name} - {(roomType.basePrice || 0).toLocaleString()} VNĐ
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Floor"
                                name="floor"
                                rules={[{ required: true, message: 'Floor is required!' }]}
                            >
                                <Select placeholder="Select floor">
                                    {Array.from({ length: 20 }, (_, i) => i + 1).map(floor => (
                                        <Select.Option key={floor} value={floor}>
                                            Floor {floor}
                                        </Select.Option>
                                    ))}
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
                                    <Select.Option value="occupied">Occupied</Select.Option>
                                    <Select.Option value="out-of-order">Out of Order</Select.Option>
                                    <Select.Option value="maintenance">Under Maintenance</Select.Option>
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
                                    <Select.Option value="cleaning">Being Cleaned</Select.Option>
                                    <Select.Option value="inspected">Inspected</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Notes"
                                name="notes"
                            >
                                <TextArea 
                                    rows={4} 
                                    placeholder="Any special notes about this room..." 
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
}
