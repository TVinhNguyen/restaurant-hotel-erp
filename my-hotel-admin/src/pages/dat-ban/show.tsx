import { Show, DateField } from "@refinedev/antd";
import { useShow, useCustomMutation, useInvalidate, useNavigation } from "@refinedev/core";
import { Typography, Descriptions, Tag, Button, Space, Modal, message, Card, Timeline, Divider, Select, Spin } from "antd";
import { 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    UserOutlined, 
    CheckOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    ShopOutlined,
    TableOutlined
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;

interface BookingData {
    id: string;
    restaurantId: string;
    restaurant?: { id: string; name: string; location?: string };
    guest?: { fullName: string; phone?: string; email?: string };
    contactName?: string;
    contactPhone?: string;
    bookingDate: string;
    bookingTime: string;
    pax: number;
    durationMinutes?: number;
    status: "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show";
    assignedTable?: { tableNumber: string; capacity: number };
    specialRequests?: string;
    notes?: string;
    createdAt?: string;
}

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    pending: { color: "orange", label: "Chờ xác nhận", icon: <ExclamationCircleOutlined /> },
    confirmed: { color: "blue", label: "Đã xác nhận", icon: <CheckCircleOutlined /> },
    seated: { color: "green", label: "Đang phục vụ", icon: <UserOutlined /> },
    completed: { color: "default", label: "Hoàn thành", icon: <CheckOutlined /> },
    cancelled: { color: "red", label: "Đã hủy", icon: <CloseCircleOutlined /> },
    no_show: { color: "volcano", label: "Không đến", icon: <CloseCircleOutlined /> },
};

export const DatBanShow: React.FC = () => {
    const { query: queryResult } = useShow<BookingData>({
        resource: "restaurants/bookings",
    });
    const { edit } = useNavigation();
    const invalidate = useInvalidate();
    const { mutate: customMutate } = useCustomMutation();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [seatModalVisible, setSeatModalVisible] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [availableTables, setAvailableTables] = useState<Array<{ id: string; tableNumber: string; capacity: number }>>([]);
    const [loadingTables, setLoadingTables] = useState(false);

    const { data, isLoading } = queryResult;
    const record = data?.data;
    
    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch available tables when modal opens
    const fetchAvailableTables = async () => {
        if (!record) return;
        setLoadingTables(true);
        try {
            const response = await fetch(
                `${API_URL}/restaurants/tables?restaurantId=${record.restaurant?.id || record.restaurantId}&status=available`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );
            const data = await response.json();
            setAvailableTables(data.tables || data || []);
        } catch (error) {
            console.error("Error fetching tables:", error);
            message.error("Không thể tải danh sách bàn");
        } finally {
            setLoadingTables(false);
        }
    };

    const handleOpenSeatModal = () => {
        setSeatModalVisible(true);
        fetchAvailableTables();
    };

    const handleSeatConfirm = async () => {
        if (!selectedTableId) {
            message.warning("Vui lòng chọn bàn");
            return;
        }
        
        setActionLoading("seat");
        try {
            await customMutate({
                url: `${API_URL}/restaurants/bookings/${record?.id}/seat`,
                method: "post",
                values: { tableId: selectedTableId },
            }, {
                onSuccess: () => {
                    message.success("Xác nhận khách đã đến thành công!");
                    invalidate({ resource: "restaurants/bookings", invalidates: ["detail", "list"] });
                    setSeatModalVisible(false);
                    setSelectedTableId(null);
                },
                onError: (error) => {
                    message.error(`Lỗi: ${error?.message || "Không thể thực hiện"}`);
                },
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleAction = async (action: "confirm" | "cancel" | "complete" | "no_show") => {
        if (!record?.id) return;
        
        setActionLoading(action);

        const actionLabels: Record<string, string> = {
            confirm: "Xác nhận",
            cancel: "Hủy",
            complete: "Hoàn thành",
            no_show: "Đánh dấu không đến",
        };

        try {
            await customMutate({
                url: `${API_URL}/restaurants/bookings/${record.id}/${action}`,
                method: "post",
                values: {},
            }, {
                onSuccess: () => {
                    message.success(`${actionLabels[action]} thành công!`);
                    invalidate({ resource: "restaurants/bookings", invalidates: ["detail", "list"] });
                },
                onError: (error) => {
                    message.error(`Lỗi: ${error?.message || "Không thể thực hiện"}`);
                },
            });
        } finally {
            setActionLoading(null);
        }
    };

    const showConfirmModal = (action: "confirm" | "cancel" | "complete" | "no_show") => {
        const titles: Record<string, string> = {
            confirm: "Xác nhận đặt bàn này?",
            cancel: "Hủy đặt bàn này?",
            complete: "Đánh dấu hoàn thành?",
            no_show: "Đánh dấu khách không đến?",
        };

        Modal.confirm({
            title: titles[action],
            icon: action === "cancel" || action === "no_show" ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
            okText: "Đồng ý",
            cancelText: "Hủy",
            okButtonProps: { danger: action === "cancel" || action === "no_show" },
            onOk: () => handleAction(action),
        });
    };

    const renderActionButtons = () => {
        if (!record) return null;
        const { status, id } = record;
        const isLoading = (action: string) => actionLoading === action;

        return (
            <Space wrap>
                {status !== "completed" && status !== "cancelled" && (
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => edit("dat-ban", id)}
                    >
                        Chỉnh sửa
                    </Button>
                )}

                {status === "pending" && (
                    <>
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            loading={isLoading("confirm")}
                            onClick={() => showConfirmModal("confirm")}
                        >
                            Xác nhận đặt bàn
                        </Button>
                        <Button
                            danger
                            icon={<CloseCircleOutlined />}
                            loading={isLoading("cancel")}
                            onClick={() => showConfirmModal("cancel")}
                        >
                            Hủy đặt bàn
                        </Button>
                    </>
                )}

                {status === "confirmed" && (
                    <>
                        <Button
                            type="primary"
                            style={{ background: "#52c41a" }}
                            icon={<TableOutlined />}
                            loading={isLoading("seat")}
                            onClick={handleOpenSeatModal}
                        >
                            Khách đã đến - Chọn bàn
                        </Button>
                        <Button
                            danger
                            icon={<CloseCircleOutlined />}
                            loading={isLoading("no_show")}
                            onClick={() => showConfirmModal("no_show")}
                        >
                            Khách không đến
                        </Button>
                    </>
                )}

                {status === "seated" && (
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={isLoading("complete")}
                        onClick={() => showConfirmModal("complete")}
                    >
                        Hoàn thành phục vụ
                    </Button>
                )}
            </Space>
        );
    };

    const config = record?.status ? statusConfig[record.status] : null;

    return (
        <Show 
            isLoading={isLoading} 
            title="Chi tiết đặt bàn"
            headerButtons={renderActionButtons}
        >
            {/* Status Banner */}
            {record && config && (
                <Card 
                    style={{ 
                        marginBottom: 24, 
                        background: `linear-gradient(135deg, ${config.color === "orange" ? "#fff7e6" : config.color === "blue" ? "#e6f7ff" : config.color === "green" ? "#f6ffed" : config.color === "red" || config.color === "volcano" ? "#fff1f0" : "#fafafa"} 0%, #fff 100%)`,
                        border: `1px solid ${config.color === "orange" ? "#ffc069" : config.color === "blue" ? "#91d5ff" : config.color === "green" ? "#95de64" : config.color === "red" || config.color === "volcano" ? "#ffa39e" : "#d9d9d9"}`
                    }}
                >
                    <Space align="center" size="large">
                        <Tag color={config.color} icon={config.icon} style={{ fontSize: 16, padding: "8px 16px" }}>
                            {config.label}
                        </Tag>
                        <div>
                            <Text strong style={{ fontSize: 18 }}>
                                {record.guest?.fullName || record.contactName}
                            </Text>
                            <Text type="secondary" style={{ marginLeft: 16 }}>
                                <TeamOutlined /> {record.pax} người • <ClockCircleOutlined /> {record.bookingTime}
                            </Text>
                        </div>
                    </Space>
                </Card>
            )}

            {/* Booking Info */}
            <Title level={5}><ShopOutlined /> Thông tin đặt bàn</Title>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Nhà hàng" span={2}>
                    <Text strong>{record?.restaurant?.name}</Text>
                    {record?.restaurant?.location && (
                        <Text type="secondary"> - {record.restaurant.location}</Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                    <DateField value={record?.bookingDate} format="DD/MM/YYYY" />
                </Descriptions.Item>
                <Descriptions.Item label="Giờ đặt">
                    <Text strong>{record?.bookingTime}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Số người">
                    <Tag color="blue" icon={<TeamOutlined />}>{record?.pax} người</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian dự kiến">
                    {record?.durationMinutes ? `${record.durationMinutes} phút` : "90 phút"}
                </Descriptions.Item>
                {record?.assignedTable && (
                    <Descriptions.Item label="Bàn được gán" span={2}>
                        <Tag color="green">
                            Bàn số {record.assignedTable.tableNumber} - {record.assignedTable.capacity} chỗ
                        </Tag>
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Contact Info */}
            <Title level={5}><UserOutlined /> Thông tin liên hệ</Title>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Tên khách hàng">
                    <Text strong>{record?.guest?.fullName || record?.contactName || "N/A"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {(record?.contactPhone || record?.guest?.phone) && (
                        <Space>
                            <PhoneOutlined />
                            <a href={`tel:${record.contactPhone || record.guest?.phone}`}>
                                {record.contactPhone || record.guest?.phone}
                            </a>
                        </Space>
                    )}
                </Descriptions.Item>
                {record?.guest?.email && (
                    <Descriptions.Item label="Email" span={2}>
                        <Space>
                            <MailOutlined />
                            <a href={`mailto:${record.guest.email}`}>{record.guest.email}</a>
                        </Space>
                    </Descriptions.Item>
                )}
            </Descriptions>

            {/* Notes */}
            {(record?.notes || record?.specialRequests) && (
                <>
                    <Title level={5}>📝 Ghi chú</Title>
                    <Descriptions bordered column={1}>
                        {record?.specialRequests && (
                            <Descriptions.Item label="Yêu cầu đặc biệt">
                                {record.specialRequests}
                            </Descriptions.Item>
                        )}
                        {record?.notes && (
                            <Descriptions.Item label="Ghi chú">
                                {record.notes}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </>
            )}

            {/* Workflow Guide */}
            <Divider />
            <Title level={5}>📋 Quy trình xử lý đặt bàn</Title>
            <Timeline
                items={[
                    {
                        color: record?.status === "pending" ? "blue" : "green",
                        children: "Chờ xác nhận - Khách đặt bàn, chờ nhân viên xác nhận",
                    },
                    {
                        color: record?.status === "confirmed" ? "blue" : (record?.status === "pending" ? "gray" : "green"),
                        children: "Đã xác nhận - Nhân viên đã xác nhận đặt bàn",
                    },
                    {
                        color: record?.status === "seated" ? "blue" : (["pending", "confirmed"].includes(record?.status || "") ? "gray" : "green"),
                        children: "Đang phục vụ - Khách đã đến và đang dùng bữa",
                    },
                    {
                        color: record?.status === "completed" ? "green" : "gray",
                        children: "Hoàn thành - Khách đã dùng xong và thanh toán",
                    },
                ]}
            />

            {/* Seat Modal - Table Selection */}
            <Modal
                title={
                    <Space>
                        <TableOutlined />
                        <span>Chọn bàn cho khách</span>
                    </Space>
                }
                open={seatModalVisible}
                onOk={handleSeatConfirm}
                onCancel={() => {
                    setSeatModalVisible(false);
                    setSelectedTableId(null);
                }}
                confirmLoading={actionLoading === "seat"}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <div style={{ marginBottom: 16 }}>
                    <Text>
                        Đặt bàn cho <Text strong>{record?.guest?.fullName || record?.contactName}</Text> - {record?.pax} người
                    </Text>
                </div>
                
                {loadingTables ? (
                    <div style={{ textAlign: "center", padding: 20 }}>
                        <Spin tip="Đang tải danh sách bàn..." />
                    </div>
                ) : availableTables.length > 0 ? (
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn bàn trống"
                        value={selectedTableId}
                        onChange={setSelectedTableId}
                        options={availableTables.map(table => ({
                            value: table.id,
                            label: `Bàn ${table.tableNumber} - Sức chứa: ${table.capacity} người`,
                        }))}
                    />
                ) : (
                    <div style={{ textAlign: "center", padding: 20, color: "#999" }}>
                        <Text type="secondary">Không có bàn trống. Vui lòng kiểm tra lại.</Text>
                    </div>
                )}
            </Modal>
        </Show>
    );
};
