"use client";

import { Create } from "@refinedev/antd";
import { Form, Input, Select, Card, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMockAmenity } from "../../../../data/mockInventory";

const { TextArea } = Input;

export default function CreateAmenity() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFinish = async (values: any) => {
        setLoading(true);
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const amenityData = {
                name: values.name,
                category: values.category,
            };

            const response = await fetch(`${API_ENDPOINT}/amenities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(amenityData)
            });

            if (response.ok) {
                const createdAmenity = await response.json();
                console.log('Created amenity from API:', createdAmenity);

                // Update mock data for UI
                addMockAmenity(createdAmenity);

                message.success('Amenity created successfully!');
                router.push('/inventory-management/amenities');
            } else {
                const errorData = await response.json();
                console.error('Create amenity API error:', errorData);
                message.error(errorData.message || 'Error creating amenity!');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            message.error('Error creating amenity!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Create 
            title="Create Amenity"
            saveButtonProps={{
                loading,
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

                    
                </Form>
            </Card>
        </Create>
    );
}
