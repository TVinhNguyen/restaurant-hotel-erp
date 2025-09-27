"use client";

import { Create } from "@refinedev/antd";
import { Form, Input, Select, Card, message } from "antd";
import { useRouter } from "next/navigation";
import { addMockAmenity } from "../../../../data/mockInventory";

const { TextArea } = Input;

export default function CreateAmenity() {
    const [form] = Form.useForm();
    const router = useRouter();

    const handleFinish = (values: any) => {
        try {
            const newAmenity = {
                name: values.name,
                category: values.category,
                description: values.description || ''
            };

            addMockAmenity(newAmenity);
            message.success('Amenity created successfully!');
            router.push('/inventory-management/amenities');
        } catch (error) {
            message.error('Error creating amenity!');
        }
    };

    return (
        <Create 
            title="Create Amenity"
            saveButtonProps={{
                onClick: () => form.submit()
            }}
        >
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    style={{ maxWidth: '600px' }}
                >
                    <Form.Item
                        label="Amenity Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter amenity name!' }]}
                    >
                        <Input placeholder="e.g. Swimming Pool" />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select category">
                            <Select.Option value="room">Room Amenity</Select.Option>
                            <Select.Option value="facility">Facility</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description!' }]}
                    >
                        <TextArea rows={4} placeholder="Describe the amenity..." />
                    </Form.Item>
                </Form>
            </Card>
        </Create>
    );
}
