import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

const { TextArea } = Input;

export const NhaHangEdit: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "restaurants",
    });

    return (
        <Edit
            title="Chỉnh sửa thông tin nhà hàng"
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form {...formProps} layout="vertical">
                    {/* Hidden propertyId */}
                    <Form.Item name="propertyId" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên nhà hàng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên nhà hàng",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên nhà hàng" />
                    </Form.Item>

                    <Form.Item
                        label="Loại món ăn"
                        name="cuisineType"
                    >
                        <Select
                            placeholder="Chọn loại món ăn"
                            options={[
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
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Vị trí"
                        name="location"
                    >
                        <Input placeholder="Ví dụ: Tầng 1, Tòa nhà A" />
                    </Form.Item>

                    <Form.Item
                        label="Giờ mở cửa"
                        name="openingHours"
                    >
                        <Input placeholder="Ví dụ: 7:00 - 22:00" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Nhập mô tả về nhà hàng"
                        />
                    </Form.Item>
                </Form>
            </Edit>
        );
};
