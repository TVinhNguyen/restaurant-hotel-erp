"use client";

import { Edit } from "@refinedev/antd";
import { Form, Input, Select, message } from "antd";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    getMockAmenity, 
    updateMockAmenity,
    type Amenity
} from "../../../../../data/mockInventory";

const { TextArea } = Input;

export default function AmenityEdit() {
    const params = useParams();
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [amenityData, setAmenityData] = useState<Amenity | null>(null);
    
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        // Fetch amenity from API
        const fetchAmenity = async () => {
            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
            try {
                const response = await fetch(`${API_ENDPOINT}/amenities/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAmenityData(data);
                    
                    form.setFieldsValue({
                        name: data.name,
                        category: data.category,
                        description: data.description,
                    });
                } else {
                    message.error('Failed to fetch amenity data');
                }
            } catch (error) {
                console.error('Error fetching amenity:', error);
                message.error('Error loading amenity data');
            }
        };

        if (id) {
            fetchAmenity();
        }
    }, [id, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const updateData = {
                name: values.name,
                category: values.category,
                description: values.description,
            };

            const response = await fetch(`${API_ENDPOINT}/amenities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const updatedAmenity = await response.json();
                console.log('Updated amenity from API:', updatedAmenity);

                // Update mock data
                updateMockAmenity(id!, updatedAmenity);

                message.success('Amenity updated successfully!');
                router.push('/inventory-management/amenities');
            } else {
                const errorData = await response.json();
                console.error('Update amenity API error:', errorData);
                message.error(errorData.message || 'Error updating amenity!');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            message.error('Error updating amenity!');
        } finally {
            setLoading(false);
        }
    };

    if (!amenityData) {
        return (
            <Edit isLoading={true}>
                <div>Loading amenity data...</div>
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
                <Form.Item
                    label="Amenity Name"
                    name="name"
                    rules={[{ required: true, message: 'Amenity name is required!' }]}
                >
                    <Input placeholder="e.g., Wi-Fi, Swimming Pool" />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Category is required!' }]}
                >
                    <Select placeholder="Select category">
                        <Select.Option value="room">Room Amenity</Select.Option>
                        <Select.Option value="facility">Facility</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <TextArea 
                        rows={4} 
                        placeholder="Describe the amenity..." 
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
}
