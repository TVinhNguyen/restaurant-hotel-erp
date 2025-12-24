import { Edit, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, TimePicker, InputNumber, Spin, Row, Col, Card, App } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TOKEN_KEY } from "../../authProvider";

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
    const { message } = App.useApp();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const { selectProps: restaurantSelectProps } = useSelect({
        resource: "restaurants",
        optionLabel: "name",
        optionValue: "id",
    });

    const { selectProps: guestSelectProps } = useSelect({
        resource: "guests",
        optionLabel: "name",
        optionValue: "id",
    });

    // Fetch guest details when selected
    const handleGuestChange = async (value: string | undefined) => {
        form.setFieldValue('guestId', value);
        if (value) {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await fetch(`${API_URL}/guests/${value}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const guest = await response.json();
                    form.setFieldsValue({
                        contactName: guest.name || '',
                        contactPhone: guest.phone || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching guest:', error);
            }
        }
    };

    // Fetch booking data
    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;
            
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await fetch(`${API_URL}/restaurants/bookings/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Set form values including restaurantId
                    form.setFieldsValue({
                        restaurantId: data.restaurantId,
                        guestId: data.guestId,
                        contactName: data.contactName || data.guest?.name || '',
                        contactPhone: data.contactPhone || data.guest?.phone || '',
                        bookingDate: data.bookingDate ? dayjs(data.bookingDate) : undefined,
                        bookingTime: data.bookingTime ? dayjs(data.bookingTime, "HH:mm") : undefined,
                        pax: data.pax,
                        durationMinutes: data.durationMinutes,
                        status: data.status,
                        specialRequests: data.specialRequests,
                        notes: data.notes,
                    });
                } else {
                    message.error("Không thể tải dữ liệu đặt bàn");
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
                message.error("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id, API_URL, form, message]);

    const handleFinish = async (values: Record<string, unknown>) => {
        setSaving(true);
        
        // Include all fields that the backend accepts
        const formattedValues = {
            restaurantId: values.restaurantId,
            guestId: values.guestId,
            bookingDate: values.bookingDate
                ? dayjs(values.bookingDate as string).format("YYYY-MM-DD")
                : undefined,
            bookingTime: values.bookingTime
                ? dayjs(values.bookingTime as string).format("HH:mm")
                : undefined,
            pax: values.pax,
            durationMinutes: values.durationMinutes,
            status: values.status,
            contactName: values.contactName,
            contactPhone: values.contactPhone,
            specialRequests: values.specialRequests,
            notes: values.notes,
        };

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await fetch(`${API_URL}/restaurants/bookings/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedValues),
            });

            if (response.ok) {
                message.success("Cập nhật đặt bàn thành công!");
                navigate(`/dat-ban/chi-tiet/${id}`);
            } else {
                const error = await response.json();
                throw new Error(error.message || "Không thể cập nhật");
            }
        } catch (error) {
            const err = error as Error;
            message.error(`Lỗi: ${err?.message || "Không thể cập nhật"}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
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
            saveButtonProps={{ 
                loading: saving,
                onClick: () => form.submit(),
            }}
            breadcrumb={false}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
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
                        <Card title="Thông tin khách hàng" size="small" style={{ marginBottom: 16 }}>
                            <Form.Item label="Khách hàng" name="guestId">
                                <Select 
                                    {...guestSelectProps} 
                                    placeholder="Chọn khách hàng (nếu có)" 
                                    allowClear
                                    onChange={(value) => handleGuestChange(String(value || ''))}
                                />
                            </Form.Item>

                            <Form.Item label="Tên liên hệ" name="contactName">
                                <Input placeholder="Nhập tên người liên hệ" />
                            </Form.Item>

                            <Form.Item label="Số điện thoại" name="contactPhone">
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Card>

                        <Card title="Ghi chú" size="small">
                            <Form.Item label="Yêu cầu đặc biệt" name="specialRequests">
                                <TextArea rows={3} placeholder="Nhập yêu cầu đặc biệt" />
                            </Form.Item>

                            <Form.Item label="Ghi chú" name="notes">
                                <TextArea rows={3} placeholder="Nhập ghi chú" />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};
