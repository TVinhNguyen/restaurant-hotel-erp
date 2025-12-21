import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { useEffect } from "react";

const { TextArea } = Input;

export const NhaHangCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "restaurants",
    });

    useEffect(() => {
        const fetchPropertyId = async () => {
            const userStr = localStorage.getItem("refine-user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const token = localStorage.getItem("refine-auth");
                const API_URL = import.meta.env.VITE_API_URL;
                try {
                    const response = await fetch(
                        `${API_URL}/employees/get-employee-by-user-id/${user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        const employeeRoleDataResponse = await fetch(
                            `${API_URL}/employee-roles?employeeId=${data.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (employeeRoleDataResponse.ok) {
                            const employeeRoleData = await employeeRoleDataResponse.json();
                            const propertyIdFromApi = employeeRoleData[0]?.propertyId;
                            formProps.form?.setFieldsValue({
                                propertyId: propertyIdFromApi,
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error fetching propertyId:", error);
                }
            }
        };
        fetchPropertyId();
    }, [formProps.form]);

    return (
        <Create
            title="Thêm nhà hàng mới"
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
                        rules={[
                            {
                                required: false,
                            },
                        ]}
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
            </Create>
        );
};
