import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, TimePicker, InputNumber, Spin, Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { TextArea } = Input;

const statusOptions = [
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đã xác nhận", value: "confirmed" },
    { label: "Đang phục vụ", value: "seated" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Đã hủy", value: "cancelled" },
    { label: "Không đến", value: "no_show" },
];

export const DatBanEdit: React.FC = () => {
    const { formProps, saveButtonProps, query } = useForm({
        resource: "restaurants/bookings",
        action: "edit",
        redirect: "show",
    });

    const [loading, setLoading] = useState(true);

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

    // Set form values when data is loaded
    useEffect(() => {
        if (query?.data?.data) {
            const record = query.data.data;
            formProps.form?.setFieldsValue({
                restaurantId: record.restaurantId,
                guestId: record.guestId,
                contactName: record.contactName,
                contactPhone: record.contactPhone,
                bookingDate: record.bookingDate ? dayjs(record.bookingDate) : undefined,
                bookingTime: record.bookingTime ? dayjs(record.bookingTime, "HH:mm") : undefined,
                pax: record.pax,
                durationMinutes: record.durationMinutes,
                status: record.status,
                specialRequests: record.specialRequests,
                notes: record.notes,
            });
            setLoading(false);
        }
    }, [query?.data?.data, formProps.form]);

    const handleFinish = (values: Record<string, unknown>) => {
        const formattedValues = {
            ...values,
            bookingDate: values.bookingDate
                ? dayjs(values.bookingDate as string).format("YYYY-MM-DD")
                : undefined,
            bookingTime: values.bookingTime
                ? dayjs(values.bookingTime as string).format("HH:mm")
                : undefined,
        };
        return formProps.onFinish?.(formattedValues);
    };

    if (query?.isLoading || loading) {
        return (
            <Edit title="Chỉnh sửa đặt bàn" breadcrumb={false}>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            </Edit>
        );
    }

    return (
        <Edit
            title="Chỉnh sửa đặt bàn"
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
        >
            <Form {...formProps} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Card title="Thông tin đặt bàn" size="small" style={{ marginBottom: 16 }}>
                            <Form.Item
                                label="Nhà hàng"
                                name="restaurantId"
                                rules={[{ required: true, message: "Vui lòng chọn nhà hàng" }]}
                            >
                                <Select {...restaurantSelectProps} placeholder="Chọn nhà hàng" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày đặt"
                                        name="bookingDate"
                                        rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                                    >
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            format="DD/MM/YYYY"
                                            placeholder="Chọn ngày"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Giờ đặt"
                                        name="bookingTime"
                                        rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
                                    >
                                        <TimePicker
                                            style={{ width: "100%" }}
                                            format="HH:mm"
                                            placeholder="Chọn giờ"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Số người"
                                        name="pax"
                                        rules={[{ required: true, message: "Vui lòng nhập số người" }]}
                                    >
                                        <InputNumber min={1} max={50} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Thời gian (phút)" name="durationMinutes">
                                        <InputNumber min={30} max={300} step={30} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Trạng thái" name="status">
                                <Select options={statusOptions} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Thông tin liên hệ" size="small" style={{ marginBottom: 16 }}>
                            <Form.Item label="Khách hàng" name="guestId">
                                <Select
                                    {...guestSelectProps}
                                    placeholder="Chọn khách hàng (tùy chọn)"
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item
                                label="Tên người đặt"
                                name="contactName"
                                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                            >
                                <Input placeholder="Nhập tên người đặt" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="contactPhone"
                                rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Card>

                        <Card title="Ghi chú" size="small">
                            <Form.Item label="Yêu cầu đặc biệt" name="specialRequests">
                                <TextArea rows={2} placeholder="Yêu cầu đặc biệt" />
                            </Form.Item>

                            <Form.Item label="Ghi chú" name="notes">
                                <TextArea rows={2} placeholder="Ghi chú thêm" />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};
