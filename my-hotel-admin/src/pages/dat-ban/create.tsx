import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, TimePicker, InputNumber } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

export const DatBanCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "restaurants/bookings",
    });

    const { selectProps: restaurantSelectProps } = useSelect({
        resource: "restaurants",
        optionLabel: "name",
        optionValue: "id",
    });

    const { selectProps: guestSelectProps } = useSelect({
        resource: "guests",
        optionLabel: "fullName",
        optionValue: "id",
    });

    return (
        <Create
            title="Tạo đặt bàn mới"
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form 
                {...formProps} 
                layout="vertical"
                onFinish={(values: { bookingDate?: string; bookingTime?: string; [key: string]: unknown }) => {
                    // Format date and time before submission
                    const formattedValues = {
                        ...values,
                        bookingDate: values.bookingDate ? dayjs(values.bookingDate).format('YYYY-MM-DD') : undefined,
                        bookingTime: values.bookingTime ? dayjs(values.bookingTime).format('HH:mm') : undefined,
                    };
                    return formProps.onFinish?.(formattedValues);
                }}
            >
                <Form.Item
                    label="Nhà hàng"
                    name="restaurantId"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn nhà hàng",
                        },
                    ]}
                >
                    <Select {...restaurantSelectProps} placeholder="Chọn nhà hàng" />
                </Form.Item>

                <Form.Item
                    label="Khách hàng"
                    name="guestId"
                >
                    <Select 
                        {...guestSelectProps} 
                        placeholder="Chọn khách hàng (tùy chọn)"
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    label="Tên người đặt"
                    name="contactName"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên người đặt",
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên người đặt" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="contactPhone"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                        },
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại liên hệ" />
                </Form.Item>

                <Form.Item
                    label="Ngày đặt"
                    name="bookingDate"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn ngày đặt",
                        },
                    ]}
                >
                    <DatePicker 
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày đặt"
                    />
                </Form.Item>

                <Form.Item
                    label="Giờ đặt"
                    name="bookingTime"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn giờ đặt",
                        },
                    ]}
                >
                    <TimePicker 
                        style={{ width: "100%" }}
                        format="HH:mm"
                        placeholder="Chọn giờ đặt"
                    />
                </Form.Item>

                <Form.Item
                    label="Số người"
                    name="pax"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số người",
                        },
                    ]}
                >
                    <InputNumber 
                        min={1}
                        max={50}
                        style={{ width: "100%" }}
                        placeholder="Nhập số người"
                    />
                </Form.Item>

                <Form.Item
                    label="Thời gian dự kiến (phút)"
                    name="durationMinutes"
                >
                    <InputNumber 
                        min={30}
                        max={300}
                        step={30}
                        style={{ width: "100%" }}
                        placeholder="Ví dụ: 90"
                    />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    initialValue="pending"
                >
                    <Select
                        options={[
                            { label: "Chờ xác nhận", value: "pending" },
                            { label: "Đã xác nhận", value: "confirmed" },
                            { label: "Đã ngồi", value: "seated" },
                            { label: "Hoàn thành", value: "completed" },
                            { label: "Đã hủy", value: "cancelled" },
                            { label: "Không đến", value: "no_show" },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Yêu cầu đặc biệt"
                    name="specialRequests"
                >
                    <TextArea
                        rows={3}
                        placeholder="Nhập các yêu cầu đặc biệt (nếu có)"
                    />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="notes"
                >
                    <TextArea
                        rows={3}
                        placeholder="Nhập ghi chú"
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};
