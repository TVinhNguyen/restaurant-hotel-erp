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
    
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const amenity = getMockAmenity(id || '');

    useEffect(() => {
        if (amenity) {
            form.setFieldsValue({
                name: amenity.name,
                category: amenity.category,
                description: amenity.description,
            });
        }
    }, [amenity, form]);

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            const updatedAmenity: Amenity = {
                ...amenity!,
                ...values,
            };

            if (updateMockAmenity(id!, updatedAmenity)) {
                message.success('Amenity updated successfully!');
                router.push('/inventory-management/amenities');
            } else {
                message.error('Error updating amenity!');
            }
        } catch (error) {
            message.error('Error updating amenity!');
        } finally {
            setLoading(false);
        }
    };

    if (!amenity) {
        return (
            <Edit>
                <div>Amenity not found</div>
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
