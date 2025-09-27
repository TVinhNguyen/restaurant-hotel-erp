"use client";

import { Create } from "@refinedev/antd";
import { Form, Input, Select, Card, Row, Col, message } from "antd";
import { useRouter } from "next/navigation";
import { 
    getMockProperties,
    getMockRoomTypes,
    addMockRoom 
} from "../../../../data/mockInventory";

const { TextArea } = Input;

export default function CreateRoom() {
    const [form] = Form.useForm();
    const router = useRouter();

    const properties = getMockProperties();
    const roomTypes = getMockRoomTypes();

    const handleFinish = (values: any) => {
        try {
            const property = properties.find(p => p.id === values.propertyId);
            const roomType = roomTypes.find(rt => rt.id === values.roomTypeId);
            
            const newRoom = {
                propertyId: values.propertyId,
                propertyName: property?.name || '',
                roomTypeId: values.roomTypeId,
                roomTypeName: roomType?.name || '',
                number: values.number,
                floor: values.floor,
                viewType: values.viewType,
                operationalStatus: values.operationalStatus || 'available',
                housekeepingStatus: values.housekeepingStatus || 'clean',
                housekeeperNotes: values.housekeeperNotes || ''
            };

            addMockRoom(newRoom);
            message.success('Room created successfully!');
            router.push('/inventory-management/rooms');
        } catch (error) {
            message.error('Error creating room!');
        }
    };

    const getFilteredRoomTypes = (propertyId: string) => {
        return roomTypes.filter(rt => rt.propertyId === propertyId);
    };

    return (
        <Create 
            title="Create Room"
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
                                <Select 
                                    placeholder="Select property"
                                    onChange={() => form.setFieldsValue({ roomTypeId: undefined })}
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
