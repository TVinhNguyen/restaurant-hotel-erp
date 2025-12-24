import { Show, DateField } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Typography, Descriptions, Tag, Button, Space, Card, Timeline, Divider, Spin, App } from "antd";
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
    ShopOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { TOKEN_KEY } from "../../authProvider";

const { Title, Text } = Typography;

interface BookingData {
    id: string;
    restaurantId: string;
    restaurant?: { id: string; name: string; location?: string };
    guest?: { name: string; phone?: string; email?: string };
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
    const { modal, message } = App.useApp();
    const { id } = useParams<{ id: string }>();
    const { edit } = useNavigation();
    
    const [record, setRecord] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

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
                    setRecord(data);
                } else {
                    message.error("Không thể tải dữ liệu đặt bàn");
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
                message.error("Lỗi khi tải dữ liệu");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooking();
    }, [id, API_URL, message]);

    const handleAction = async (action: "confirm" | "cancel" | "complete") => {
        if (!record?.id) return;
        
        setActionLoading(action);

        const actionLabels: Record<string, string> = {
            confirm: "Xác nhận",
            cancel: "Hủy",
            complete: "Hoàn thành",
        };

        try {
            const response = await fetch(`${API_URL}/restaurants/bookings/${record.id}/${action}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Không thể thực hiện");
            }
            
            message.success(`${actionLabels[action]} thành công!`);
            // Reload data
            const updatedResponse = await fetch(`${API_URL}/restaurants/bookings/${record.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                    'Content-Type': 'application/json',
                },
            });
            if (updatedResponse.ok) {
                setRecord(await updatedResponse.json());
            }
        } catch (error) {
            const err = error as Error;
            message.error(`Lỗi: ${err?.message || "Không thể thực hiện"}`);
        } finally {
            setActionLoading(null);
        }
    };

    const showConfirmModal = (action: "confirm" | "cancel" | "complete") => {
        const titles: Record<string, string> = {
            confirm: "Xác nhận đặt bàn này?",
            cancel: "Hủy đặt bàn này?",
            complete: "Đánh dấu hoàn thành?",
        };

        modal.confirm({
            title: titles[action],
            icon: action === "cancel" ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
            okText: "Đồng ý",
            cancelText: "Hủy",
            okButtonProps: { danger: action === "cancel" },
            onOk: () => handleAction(action),
        });
    };

    const renderActionButtons = () => {
        if (!record) return null;
        const { status, id: recordId } = record;
        const isLoadingAction = (action: string) => actionLoading === action;

        return (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {status !== "completed" && status !== "cancelled" && (
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => edit("dat-ban", recordId)}
                    >
                        Chỉnh sửa
                    </Button>
                )}

                {status === "pending" && (
                    <>
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            loading={isLoadingAction("confirm")}
                            onClick={() => showConfirmModal("confirm")}
                        >
                            Xác nhận
                        </Button>
                        <Button
                            danger
                            icon={<CloseCircleOutlined />}
                            loading={isLoadingAction("cancel")}
                            onClick={() => showConfirmModal("cancel")}
                        >
                            Hủy
                        </Button>
                    </>
                )}

                {(status === "confirmed" || status === "seated") && (
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={isLoadingAction("complete")}
                        onClick={() => showConfirmModal("complete")}
                    >
                        Hoàn thành
                    </Button>
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <Show title="Chi tiết đặt bàn">
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            </Show>
        );
    }

    const config = record?.status ? statusConfig[record.status] : null;

    return (
        <Show 
            isLoading={false} 
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
                                {record.guest?.name || record.contactName}
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
                    <Text strong>{record?.guest?.name || record?.contactName || "Chưa có"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {(record?.contactPhone || record?.guest?.phone) && (
                        <Space>
                            <PhoneOutlined />
                            <a href={`tel:${record?.contactPhone || record?.guest?.phone}`}>
                                {record?.contactPhone || record?.guest?.phone}
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
        </Show>
    );
};
