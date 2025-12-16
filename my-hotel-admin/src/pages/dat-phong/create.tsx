import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, InputNumber } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export const DatPhongCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "reservations",
    });

    const { selectProps: guestSelectProps } = useSelect({
        resource: "guests",
        optionLabel: "fullName",
        optionValue: "id",
    });

    const { selectProps: roomTypeSelectProps } = useSelect({
        resource: "room-types",
        optionLabel: "name",
        optionValue: "id",
    });

    const { selectProps: roomSelectProps } = useSelect({
        resource: "rooms",
        optionLabel: "roomNumber",
        optionValue: "id",
    });

    return (
        <Create
            title="Tạo đặt phòng mới"
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form {...formProps} layout="vertical">
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
                        filterOption={(input, option) =>
                            String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
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
                    <Select
                        {...roomTypeSelectProps}
                        placeholder="Chọn loại phòng"
                    />
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
                    <Select
                        {...roomSelectProps}
                        placeholder="Chọn phòng"
                    />
                </Form.Item>

                <Form.Item
                    label="Ngày check-in và check-out"
                    name="dateRange"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn ngày",
                        },
                    ]}
                >
                    <RangePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder={["Ngày check-in", "Ngày check-out"]}
                    />
                </Form.Item>

                <Form.Item
                    label="Số người lớn"
                    name="numberOfAdults"
                    initialValue={1}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số người lớn",
                        },
                    ]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Số trẻ em"
                    name="numberOfChildren"
                    initialValue={0}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Ghi chú đặc biệt"
                    name="specialRequests"
                >
                    <Input.TextArea rows={4} placeholder="Nhập ghi chú đặc biệt (nếu có)" />
                </Form.Item>
            </Form>
        </Create>
    );
};
