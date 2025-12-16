import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, InputNumber } from "antd";
import dayjs from "dayjs";

export const DatPhongEdit: React.FC = () => {
    const { formProps, saveButtonProps, query: queryResult } = useForm({
        resource: "reservations",
    });

    const { selectProps: guestSelectProps } = useSelect({
        resource: "guests",
        optionLabel: "fullName",
        optionValue: "id",
        defaultValue: queryResult?.data?.data?.guestId,
    });

    const { selectProps: roomTypeSelectProps } = useSelect({
        resource: "room-types",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: queryResult?.data?.data?.roomTypeId,
    });

    const { selectProps: roomSelectProps } = useSelect({
        resource: "rooms",
        optionLabel: "roomNumber",
        optionValue: "id",
        defaultValue: queryResult?.data?.data?.roomId,
    });

    const statusOptions = [
        { label: "Chờ xác nhận", value: "pending" },
        { label: "Đã xác nhận", value: "confirmed" },
        { label: "Đã check-in", value: "checked_in" },
        { label: "Đã check-out", value: "checked_out" },
        { label: "Đã hủy", value: "cancelled" },
    ];

    return (
        <Edit
            title="Chỉnh sửa đặt phòng"
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Mã đặt phòng"
                    name="confirmationCode"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Khách hàng"
                    name="guestId"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn khách hàng",
                        },
                    ]}
                >
                    <Select
                        {...guestSelectProps}
                        placeholder="Chọn khách hàng"
                        showSearch
                    />
                </Form.Item>

                <Form.Item
                    label="Loại phòng"
                    name="roomTypeId"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn loại phòng",
                        },
                    ]}
                >
                    <Select {...roomTypeSelectProps} placeholder="Chọn loại phòng" />
                </Form.Item>

                <Form.Item
                    label="Phòng"
                    name="roomId"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn phòng",
                        },
                    ]}
                >
                    <Select {...roomSelectProps} placeholder="Chọn phòng" />
                </Form.Item>

                <Form.Item
                    label="Ngày check-in"
                    name="checkInDate"
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn ngày check-in",
                        },
                    ]}
                >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    label="Ngày check-out"
                    name="checkOutDate"
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn ngày check-out",
                        },
                    ]}
                >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn trạng thái",
                        },
                    ]}
                >
                    <Select options={statusOptions} placeholder="Chọn trạng thái" />
                </Form.Item>

                <Form.Item
                    label="Số người lớn"
                    name="numberOfAdults"
                >
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Số trẻ em"
                    name="numberOfChildren"
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Ghi chú đặc biệt"
                    name="specialRequests"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Edit>
    );
};
