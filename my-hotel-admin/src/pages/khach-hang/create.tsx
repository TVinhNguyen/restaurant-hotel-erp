import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const KhachHangCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "guests",
    });

    const submitForm = (values: any) => {
        console.log("Form Values:", values);
    }

    return (
        <Create
            title="Thêm khách hàng mới"
            // saveButtonProps={saveButtonProps}
            saveButtonProps={{
                onClick: () => {
                    submitForm(formProps);
                },
            }}
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
                    <Input placeholder="Nhập họ và tên đầy đủ" />
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
                    <Input placeholder="example@email.com" />
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
                    <Input placeholder="0912345678" />
                </Form.Item>

                <Form.Item
                    label="Hạng thành viên"
                    name="loyaltyTier"
                >
                    <Select placeholder="Chọn hạng thành viên">
                        <Select.Option value="Bronze">Khách thành viên hạng đồng</Select.Option>
                        <Select.Option value="Silver">Khách thành viên hạng bạc</Select.Option>
                        <Select.Option value="Gold">Khách thành viên hạng vàng</Select.Option>
                        <Select.Option value="Platinum">Khách thành viên hạng bạch kim</Select.Option>
                    </Select>
                </Form.Item>

                {/* <Form.Item
                    label="Quốc tịch"
                    name="nationality"
                >
                    <Input placeholder="Việt Nam" />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                >
                    <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
                </Form.Item>

                <Form.Item
                    label="Số CMND/CCCD"
                    name="identificationNumber"
                >
                    <Input placeholder="Số CMND/CCCD" />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="notes"
                >
                    <Input.TextArea rows={3} placeholder="Ghi chú thêm về khách hàng" />
                </Form.Item> */}
            </Form>
        </Create>
    );
};
