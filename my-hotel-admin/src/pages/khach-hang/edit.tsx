import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const KhachHangEdit: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "guests",
    });

    return (
        <Edit
            title="Chỉnh sửa thông tin khách hàng"
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập họ và tên",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "Vui lòng nhập email hợp lệ",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Quốc tịch"
                    name="nationality"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    label="Số CMND/CCCD"
                    name="identificationNumber"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="notes"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Edit>
    );
};
