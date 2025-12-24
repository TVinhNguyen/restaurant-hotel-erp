import { Edit } from "@refinedev/antd";
import { Form, Input, Select, Spin, App } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TOKEN_KEY } from "../../authProvider";

const { TextArea } = Input;

const cuisineOptions = [
    { label: "Việt Nam", value: "Vietnamese" },
    { label: "Trung Quốc", value: "Chinese" },
    { label: "Nhật Bản", value: "Japanese" },
    { label: "Hàn Quốc", value: "Korean" },
    { label: "Thái Lan", value: "Thai" },
    { label: "Ý", value: "Italian" },
    { label: "Pháp", value: "French" },
    { label: "Hải sản", value: "Seafood" },
    { label: "BBQ", value: "BBQ" },
    { label: "Buffet", value: "Buffet" },
    { label: "Fastfood", value: "Fastfood" },
    { label: "Khác", value: "Other" },
];

export const NhaHangEdit: React.FC = () => {
    const { message } = App.useApp();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch restaurant data
    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!id) return;
            
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await fetch(`${API_URL}/restaurants/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Set form values (exclude propertyId as it's not allowed in update)
                    form.setFieldsValue({
                        name: data.name,
                        cuisineType: data.cuisineType,
                        location: data.location,
                        openingHours: data.openingHours,
                        description: data.description,
                    });
                } else {
                    message.error("Không thể tải dữ liệu nhà hàng");
                }
            } catch (error) {
                console.error("Error fetching restaurant:", error);
                message.error("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id, API_URL, form, message]);

    const handleFinish = async (values: Record<string, unknown>) => {
        setSaving(true);

        // Only send allowed fields (no propertyId)
        const allowedValues = {
            name: values.name,
            description: values.description,
            location: values.location,
            openingHours: values.openingHours,
            cuisineType: values.cuisineType,
        };

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await fetch(`${API_URL}/restaurants/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(allowedValues),
            });

            if (response.ok) {
                message.success("Cập nhật nhà hàng thành công!");
                navigate(`/nha-hang/show/${id}`);
            } else {
                const error = await response.json();
                throw new Error(error.message || "Không thể cập nhật");
            }
        } catch (error) {
            const err = error as Error;
            message.error(`Lỗi: ${err?.message || "Không thể cập nhật"}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Edit title="Chỉnh sửa thông tin nhà hàng" breadcrumb={false}>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            </Edit>
        );
    }

    return (
        <Edit
            title="Chỉnh sửa thông tin nhà hàng"
            saveButtonProps={{ 
                loading: saving,
                onClick: () => form.submit(),
            }}
            breadcrumb={false}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Tên nhà hàng"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhà hàng" }]}
                >
                    <Input placeholder="Nhập tên nhà hàng" />
                </Form.Item>

                <Form.Item label="Loại món ăn" name="cuisineType">
                    <Select
                        placeholder="Chọn loại món ăn"
                        options={cuisineOptions}
                        allowClear
                    />
                </Form.Item>

                <Form.Item label="Vị trí" name="location">
                    <Input placeholder="Ví dụ: Tầng 1, Tòa nhà A" />
                </Form.Item>

                <Form.Item label="Giờ mở cửa" name="openingHours">
                    <Input placeholder="Ví dụ: 7:00 - 22:00" />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <TextArea rows={4} placeholder="Nhập mô tả về nhà hàng" />
                </Form.Item>
            </Form>
        </Edit>
    );
};
