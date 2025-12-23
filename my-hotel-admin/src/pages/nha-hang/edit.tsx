import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";

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
    const { formProps, saveButtonProps, query } = useForm({
        resource: "restaurants",
        action: "edit",
        redirect: "show",
    });

    const [loading, setLoading] = useState(true);

    // Set form values when data is loaded
    useEffect(() => {
        if (query?.data?.data) {
            const record = query.data.data;
            formProps.form?.setFieldsValue({
                name: record.name,
                cuisineType: record.cuisineType,
                location: record.location,
                openingHours: record.openingHours,
                description: record.description,
                propertyId: record.propertyId,
            });
            setLoading(false);
        }
    }, [query?.data?.data, formProps.form]);

    if (query?.isLoading || loading) {
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
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item name="propertyId" hidden>
                    <Input />
                </Form.Item>

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
