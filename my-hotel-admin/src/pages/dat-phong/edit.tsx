import { Edit } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, InputNumber, Spin, App } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TOKEN_KEY } from "../../authProvider";
import dayjs from "dayjs";

const { TextArea } = Input;

interface GuestOption {
    id: string;
    name: string;
}

interface RoomTypeOption {
    id: string;
    name: string;
}

interface RoomOption {
    id: string;
    roomNumber: string;
}

const statusOptions = [
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đã xác nhận", value: "confirmed" },
    { label: "Đã check-in", value: "checked_in" },
    { label: "Đã check-out", value: "checked_out" },
    { label: "Đã hủy", value: "cancelled" },
];

export const DatPhongEdit: React.FC = () => {
    const { message } = App.useApp();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [guests, setGuests] = useState<GuestOption[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeOption[]>([]);
    const [rooms, setRooms] = useState<RoomOption[]>([]);

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch reservation data and options
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                // Fetch all data in parallel
                const [reservationRes, guestsRes, roomTypesRes, roomsRes] = await Promise.all([
                    fetch(`${API_URL}/reservations/${id}`, { headers }),
                    fetch(`${API_URL}/guests`, { headers }),
                    fetch(`${API_URL}/room-types`, { headers }),
                    fetch(`${API_URL}/rooms`, { headers }),
                ]);

                if (reservationRes.ok) {
                    const data = await reservationRes.json();
                    form.setFieldsValue({
                        confirmationCode: data.confirmationCode,
                        guestId: data.guest?.id || data.guestId,
                        roomTypeId: data.roomTypeId,
                        roomId: data.roomId,
                        checkIn: data.checkIn ? dayjs(data.checkIn) : undefined,
                        checkOut: data.checkOut ? dayjs(data.checkOut) : undefined,
                        status: data.status,
                        numberOfAdults: data.numberOfAdults,
                        numberOfChildren: data.numberOfChildren,
                        specialRequests: data.specialRequests,
                    });
                } else {
                    message.error("Không thể tải dữ liệu đặt phòng");
                }

                if (guestsRes.ok) {
                    const guestsData = await guestsRes.json();
                    setGuests(Array.isArray(guestsData) ? guestsData : guestsData.data || []);
                }

                if (roomTypesRes.ok) {
                    const roomTypesData = await roomTypesRes.json();
                    setRoomTypes(Array.isArray(roomTypesData) ? roomTypesData : roomTypesData.data || []);
                }

                if (roomsRes.ok) {
                    const roomsData = await roomsRes.json();
                    setRooms(Array.isArray(roomsData) ? roomsData : roomsData.data || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, API_URL, form, message]);

    const handleFinish = async (values: Record<string, unknown>) => {
        setSaving(true);

        // Format dates for API
        const payload = {
            guestId: values.guestId,
            roomTypeId: values.roomTypeId,
            roomId: values.roomId,
            checkIn: values.checkIn ? dayjs(values.checkIn as string).format('YYYY-MM-DD') : undefined,
            checkOut: values.checkOut ? dayjs(values.checkOut as string).format('YYYY-MM-DD') : undefined,
            status: values.status,
            numberOfAdults: values.numberOfAdults,
            numberOfChildren: values.numberOfChildren,
            specialRequests: values.specialRequests,
        };

        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await fetch(`${API_URL}/reservations/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success("Cập nhật đặt phòng thành công!");
                navigate(`/dat-phong/chi-tiet/${id}`);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Error updating reservation:", error);
            message.error("Lỗi khi cập nhật đặt phòng");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Edit title="Chỉnh sửa đặt phòng" breadcrumb={false}>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            </Edit>
        );
    }

    return (
        <Edit
            title="Chỉnh sửa đặt phòng"
            saveButtonProps={{
                onClick: () => form.submit(),
                loading: saving,
            }}
            breadcrumb={false}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item label="Mã đặt phòng" name="confirmationCode">
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Khách hàng"
                    name="guestId"
                    rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
                >
                    <Select
                        placeholder="Chọn khách hàng"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {guests.map((guest) => (
                            <Select.Option key={guest.id} value={guest.id}>
                                {guest.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Loại phòng"
                    name="roomTypeId"
                    rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
                >
                    <Select placeholder="Chọn loại phòng">
                        {roomTypes.map((rt) => (
                            <Select.Option key={rt.id} value={rt.id}>
                                {rt.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Phòng"
                    name="roomId"
                >
                    <Select placeholder="Chọn phòng" allowClear>
                        {rooms.map((room) => (
                            <Select.Option key={room.id} value={room.id}>
                                {room.roomNumber}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Ngày check-in"
                    name="checkIn"
                    rules={[{ required: true, message: "Vui lòng chọn ngày check-in" }]}
                >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    label="Ngày check-out"
                    name="checkOut"
                    rules={[{ required: true, message: "Vui lòng chọn ngày check-out" }]}
                >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select options={statusOptions} placeholder="Chọn trạng thái" />
                </Form.Item>

                <Form.Item label="Số người lớn" name="numberOfAdults">
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Số trẻ em" name="numberOfChildren">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Ghi chú đặc biệt" name="specialRequests">
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Edit>
    );
};
