import { List, DateField, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Card, Row, Col, Typography, App, Modal, Select } from "antd";
import { CheckCircleOutlined, UserOutlined, HomeOutlined } from "@ant-design/icons";
import { useCan } from "@refinedev/core";
import { useState } from "react";
import dayjs from "dayjs";
import { TOKEN_KEY } from "../../authProvider";

const { Text } = Typography;

interface RoomOption {
    id: string;
    number: string;
    housekeepingStatus: string;
    operationalStatus: string;
}

export const CheckInList: React.FC = () => {
    const { message } = App.useApp();
    const [checkInModalVisible, setCheckInModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
    const [actionLoading, setActionLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    // Check permissions
    const { data: canCheckIn } = useCan({
        resource: "check-in",
        action: "create",
    });

    // Fetch reservations cần check-in hôm nay
    const { tableProps, tableQuery } = useTable({
        resource: "reservations",
        syncWithLocation: true,
        filters: {
            permanent: [
                {
                    field: "checkInFrom",
                    operator: "eq",
                    value: dayjs().format("YYYY-MM-DD"),
                },
                {
                    field: "checkInTo",
                    operator: "eq",
                    value: dayjs().format("YYYY-MM-DD"),
                },
                {
                    field: "status",
                    operator: "eq",
                    value: "confirmed",
                },
                {
                    field: "includeRelations",
                    operator: "eq",
                    value: true,
                },
            ],
        },
    });

    // Fetch available rooms for check-in
    const fetchAvailableRooms = async (roomTypeId: string) => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await fetch(`${API_URL}/rooms?roomTypeId=${roomTypeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const rooms = Array.isArray(data) ? data : data.data || [];
                const available = rooms.filter((room: RoomOption) => 
                    room.operationalStatus === 'available' && 
                    room.housekeepingStatus !== 'dirty'
                );
                setAvailableRooms(available);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const handleCheckInClick = (record: any) => {
        setSelectedReservation(record);
        if (record.roomTypeId) {
            fetchAvailableRooms(record.roomTypeId);
        }
        if (record.assignedRoomId) {
            setSelectedRoomId(record.assignedRoomId);
        }
        setCheckInModalVisible(true);
    };

    const handleCheckIn = async () => {
        if (!selectedReservation) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await fetch(`${API_URL}/reservations/${selectedReservation.id}/checkin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId: selectedRoomId }),
            });

            if (response.ok) {
                message.success("Check-in thành công!");
                setCheckInModalVisible(false);
                setSelectedReservation(null);
                setSelectedRoomId(undefined);
                tableQuery.refetch();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Check-in thất bại");
            }
        } catch (error) {
            console.error("Error checking in:", error);
            message.error("Lỗi khi check-in");
        } finally {
            setActionLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        pending: "orange",
        confirmed: "blue",
        checked_in: "green",
    };

    const statusLabels: Record<string, string> = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        checked_in: "Đã check-in",
    };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <CheckCircleOutlined style={{ fontSize: 32, color: "#52c41a" }} />
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Cần check-in hôm nay</Text>
                                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                                    {(tableProps.dataSource as any)?.length || 0}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <List
                title="Danh sách khách cần Check-in hôm nay"
                canCreate={false}
            >
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        title="Mã đặt phòng"
                        dataIndex="confirmationCode"
                        key="confirmationCode"
                        render={(value) => (
                            <Text strong>{value}</Text>
                        )}
                    />
                    <Table.Column
                        title="Tên khách"
                        key="guestName"
                        render={(_, record: any) => (
                            <Space>
                                <UserOutlined />
                                <div>
                                    <div>{record.guest?.name || "N/A"}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {record.guest?.email}
                                    </Text>
                                </div>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Số điện thoại"
                        key="phone"
                        render={(_, record: any) => record.guest?.phone || "N/A"}
                    />
                    <Table.Column
                        title="Loại phòng"
                        key="roomType"
                        render={(_, record: any) => (
                            <Space direction="vertical" size={0}>
                                <Space>
                                    <HomeOutlined />
                                    <Text>{record.roomType?.name || "N/A"}</Text>
                                </Space>
                                {record.assignedRoom?.number && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Phòng số: {record.assignedRoom.number}
                                    </Text>
                                )}
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Thời gian lưu trú"
                        key="duration"
                        render={(_, record: any) => (
                            <Space direction="vertical" size={0}>
                                <Text>
                                    Check-in: <DateField value={record.checkIn} format="DD/MM/YYYY" />
                                </Text>
                                <Text>
                                    Check-out: <DateField value={record.checkOut} format="DD/MM/YYYY" />
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    ({dayjs(record.checkOut).diff(dayjs(record.checkIn), 'day')} đêm)
                                </Text>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Số khách"
                        key="guests"
                        render={(_, record: any) => (
                            <Text>
                                {record.numberOfAdults || 0} người lớn
                                {record.numberOfChildren > 0 && `, ${record.numberOfChildren} trẻ em`}
                            </Text>
                        )}
                    />
                    <Table.Column
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(status: string) => (
                            <Tag color={statusColors[status]}>
                                {statusLabels[status] || status}
                            </Tag>
                        )}
                    />
                    <Table.Column
                        title="Thao tác"
                        key="actions"
                        render={(_, record: any) => (
                            <Space>
                                {canCheckIn?.can && record.status === "confirmed" && (
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => handleCheckInClick(record)}
                                    >
                                        Check-in
                                    </Button>
                                )}
                                {record.status === "checked_in" && (
                                    <Tag color="success">Đã check-in</Tag>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </List>

            {/* Check-in Modal */}
            <Modal
                title="Check-in khách hàng"
                open={checkInModalVisible}
                onOk={handleCheckIn}
                onCancel={() => {
                    setCheckInModalVisible(false);
                    setSelectedReservation(null);
                    setSelectedRoomId(undefined);
                }}
                okText="Xác nhận Check-in"
                cancelText="Hủy"
                confirmLoading={actionLoading}
                okButtonProps={{ style: { backgroundColor: "#52c41a", borderColor: "#52c41a" } }}
            >
                {selectedReservation && (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <p><strong>Khách hàng:</strong> {selectedReservation.guest?.name}</p>
                            <p><strong>Mã đặt phòng:</strong> {selectedReservation.confirmationCode}</p>
                            <p><strong>Loại phòng:</strong> {selectedReservation.roomType?.name}</p>
                            <p><strong>Ngày check-in:</strong> {dayjs(selectedReservation.checkIn).format("DD/MM/YYYY")}</p>
                            <p><strong>Ngày check-out:</strong> {dayjs(selectedReservation.checkOut).format("DD/MM/YYYY")}</p>
                        </div>

                        <div style={{ marginBottom: 8 }}>
                            <label><strong>Chọn phòng:</strong></label>
                        </div>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Chọn phòng để gán (hoặc để trống để tự động)"
                            value={selectedRoomId}
                            onChange={setSelectedRoomId}
                            allowClear
                        >
                            {availableRooms.map((room) => (
                                <Select.Option key={room.id} value={room.id}>
                                    Phòng {room.number} ({room.housekeepingStatus === 'clean' ? 'Sạch' : room.housekeepingStatus === 'inspected' ? 'Đã kiểm tra' : room.housekeepingStatus})
                                </Select.Option>
                            ))}
                        </Select>
                        {availableRooms.length === 0 && (
                            <p style={{ color: "#faad14", marginTop: 8 }}>
                                Không có phòng trống cho loại phòng này. Hệ thống sẽ tự động tìm phòng phù hợp.
                            </p>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};
