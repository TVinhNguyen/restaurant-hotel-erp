import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { useParams } from "react-router";

export const LoaiPhongEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { formProps, saveButtonProps, query } = useForm({
        resource: "room-types",
        action: "edit",
        id: id,
        redirect: "list",
    });

    const roomTypeData = query?.data?.data as any;
    const isLoading = query?.isLoading;

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
            </div>
        );
    }

    const bedTypeOptions = [
        { value: "1 Giường Đôi", label: "1 Giường Đôi (King)" },
        { value: "2 Giường Đơn", label: "2 Giường Đơn (Twin)" },
        { value: "1 Giường Đôi + 1 Giường Đơn", label: "1 Giường Đôi + 1 Giường Đơn" },
        { value: "2 Giường Đôi", label: "2 Giường Đôi" },
        { value: "Giường Queen", label: "Giường Queen" },
        { value: "Giường King", label: "Giường King" },
    ];

    return (
        <Edit
            title={`Chỉnh sửa: ${roomTypeData?.name || "Loại phòng"}`}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={(values) => {
                    // Convert basePrice to number before submit
                    const submitValues = {
                        ...values,
                        basePrice: Number(values.basePrice),
                    };
                    return formProps.onFinish?.(submitValues);
                }}
            >
                <Form.Item
                    label="Tên loại phòng"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                    <Input placeholder="VD: Superior, Deluxe, Suite..." />
                </Form.Item>

                <Form.Item
                    label="Giá phòng (VNĐ/đêm)"
                    name="basePrice"
                    rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                    getValueFromEvent={(e) => {
                        const value = e?.target?.value ?? e;
                        return typeof value === "string" ? parseFloat(value) : value;
                    }}
                    getValueProps={(value) => ({
                        value: typeof value === "string" ? parseFloat(value) : value,
                    })}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        step={100000}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                        placeholder="VD: 1,500,000"
                    />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} placeholder="Mô tả về loại phòng..." />
                </Form.Item>

                <Form.Item
                    label="Số người lớn tối đa"
                    name="maxAdults"
                    rules={[{ required: true, message: "Vui lòng nhập số" }]}
                >
                    <InputNumber min={1} max={10} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Số trẻ em tối đa"
                    name="maxChildren"
                    rules={[{ required: true, message: "Vui lòng nhập số" }]}
                >
                    <InputNumber min={0} max={5} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Loại giường" name="bedType">
                    <Select
                        options={bedTypeOptions}
                        placeholder="Chọn loại giường"
                        allowClear
                    />
                </Form.Item>

                <Form.Item name="propertyId" hidden>
                    <Input />
                </Form.Item>
            </Form>
        </Edit>
    );
};
