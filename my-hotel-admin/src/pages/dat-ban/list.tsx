import { List, useTable, DateField } from "@refinedev/antd";
import { Table, Tag, Space, Button, Tooltip, Card, Row, Col, Statistic, App, Input } from "antd";
import { 
    EyeOutlined, 
    EditOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
    CheckOutlined,
    TeamOutlined,
    SearchOutlined
} from "@ant-design/icons";
import { useNavigation, useCan, useInvalidate } from "@refinedev/core";
import { useState, useMemo } from "react";
import { TOKEN_KEY } from "../../authProvider";

interface BookingRecord {
    id: string;
    restaurantId: string;
    restaurant?: { name: string };
    guest?: { name: string; phone?: string };
    contactName?: string;
    contactPhone?: string;
    bookingDate: string;
    bookingTime: string;
    pax: number;
    status: "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show";
    assignedTable?: { tableNumber: string };
}

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    pending: { color: "orange", label: "Chờ xác nhận", icon: <ExclamationCircleOutlined /> },
    confirmed: { color: "blue", label: "Đã xác nhận", icon: <CheckCircleOutlined /> },
    seated: { color: "green", label: "Đang phục vụ", icon: <UserOutlined /> },
    completed: { color: "default", label: "Hoàn thành", icon: <CheckOutlined /> },
    cancelled: { color: "red", label: "Đã hủy", icon: <CloseCircleOutlined /> },
    no_show: { color: "volcano", label: "Không đến", icon: <CloseCircleOutlined /> },
};

export const DatBanList: React.FC = () => {
    const { modal, message } = App.useApp();
    
    const { tableProps, tableQuery } = useTable<BookingRecord>({
        resource: "restaurants/bookings",
        syncWithLocation: true,
    });

    const { show, edit, create } = useNavigation();
    const invalidate = useInvalidate();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    
    const { data: canEdit } = useCan({ resource: "dat-ban", action: "edit" });
    const { data: canCreate } = useCan({ resource: "dat-ban", action: "create" });
    
    const API_URL = import.meta.env.VITE_API_URL;
    
    // Search state
    const [searchText, setSearchText] = useState("");

    // Calculate stats from data
    const bookings = tableQuery.data?.data || [];
    const pendingCount = bookings.filter((b: BookingRecord) => b.status === "pending").length;
    const confirmedCount = bookings.filter((b: BookingRecord) => b.status === "confirmed").length;
    const seatedCount = bookings.filter((b: BookingRecord) => b.status === "seated").length;

    // Filter bookings by search text (name or phone)
    const filteredBookings = useMemo(() => {
        if (!searchText.trim()) return bookings;
        const search = searchText.toLowerCase().trim();
        return bookings.filter((b: BookingRecord) => {
            const guestName = (b.guest?.name || b.contactName || "").toLowerCase();
            const guestPhone = (b.contactPhone || b.guest?.phone || "").toLowerCase();
            return guestName.includes(search) || guestPhone.includes(search);
        });
    }, [bookings, searchText]);

    const handleAction = async (
        bookingId: string, 
        action: "confirm" | "cancel" | "complete"
    ) => {
        setActionLoading(`${bookingId}-${action}`);

        const actionLabels: Record<string, string> = {
            confirm: "Xác nhận",
            cancel: "Hủy",
            complete: "Hoàn thành",
        };

        try {
            const response = await fetch(`${API_URL}/restaurants/bookings/${bookingId}/${action}`, {
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
            invalidate({ resource: "restaurants/bookings", invalidates: ["list"] });
        } catch (error) {
            const err = error as Error;
            message.error(`Lỗi: ${err?.message || "Không thể thực hiện"}`);
        } finally {
            setActionLoading(null);
        }
    };

    const showConfirmModal = (bookingId: string, action: "confirm" | "cancel" | "complete") => {
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
            onOk: () => handleAction(bookingId, action),
        });
    };

    const renderActions = (record: BookingRecord) => {
        const { id, status } = record;
        const isLoading = (action: string) => actionLoading === `${id}-${action}`;

        return (
            <Space size="small" wrap>
                <Tooltip title="Xem chi tiết">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => show("dat-ban", id)}
                    />
                </Tooltip>

                {canEdit?.can && status !== "completed" && status !== "cancelled" && (
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => edit("dat-ban", id)}
                        />
                    </Tooltip>
                )}

                {status === "pending" && (
                    <>
                        <Tooltip title="Xác nhận đặt bàn">
                            <Button
                                size="small"
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                loading={isLoading("confirm")}
                                onClick={() => showConfirmModal(id, "confirm")}
                            >
                                Xác nhận
                            </Button>
                        </Tooltip>
                        <Tooltip title="Hủy đặt bàn">
                            <Button
                                size="small"
                                danger
                                icon={<CloseCircleOutlined />}
                                loading={isLoading("cancel")}
                                onClick={() => showConfirmModal(id, "cancel")}
                            >
                                Hủy
                            </Button>
                        </Tooltip>
                    </>
                )}

                {(status === "confirmed" || status === "seated") && (
                    <Tooltip title="Hoàn thành phục vụ">
                        <Button
                            size="small"
                            type="primary"
                            icon={<CheckOutlined />}
                            loading={isLoading("complete")}
                            onClick={() => showConfirmModal(id, "complete")}
                        >
                            Hoàn thành
                        </Button>
                    </Tooltip>
                )}
            </Space>
        );
    };

    return (
        <List
            title="Quản lý đặt bàn"
            canCreate={canCreate?.can}
            createButtonProps={{
                children: "Tạo đặt bàn mới",
                icon: <TeamOutlined />,
                onClick: () => create("dat-ban"),
            }}
        >
            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderLeft: "4px solid #faad14" }}>
                        <Statistic
                            title="Chờ xác nhận"
                            value={pendingCount}
                            valueStyle={{ color: "#faad14" }}
                            prefix={<ExclamationCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderLeft: "4px solid #1890ff" }}>
                        <Statistic
                            title="Đã xác nhận"
                            value={confirmedCount}
                            valueStyle={{ color: "#1890ff" }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderLeft: "4px solid #52c41a" }}>
                        <Statistic
                            title="Đang phục vụ"
                            value={seatedCount}
                            valueStyle={{ color: "#52c41a" }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search Input */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    style={{ maxWidth: 400 }}
                />
            </Card>

            <Table {...tableProps} dataSource={filteredBookings} rowKey="id" scroll={{ x: 1200 }}>
                <Table.Column
                    title="Nhà hàng"
                    dataIndex={["restaurant", "name"]}
                    key="restaurant"
                    render={(value: string) => value || "N/A"}
                />
                <Table.Column
                    title="Khách hàng"
                    key="guest"
                    render={(_: unknown, record: BookingRecord) => (
                        <Space direction="vertical" size={0}>
                            <span style={{ fontWeight: 500 }}>{record.guest?.name || record.contactName || "N/A"}</span>
                            <small style={{ color: "#666" }}>
                                📞 {record.contactPhone || record.guest?.phone || "N/A"}
                            </small>
                        </Space>
                    )}
                />
                <Table.Column
                    title="Ngày đặt"
                    dataIndex="bookingDate"
                    key="bookingDate"
                    render={(value: string) => <DateField value={value} format="DD/MM/YYYY" />}
                    sorter
                />
                <Table.Column
                    title="Giờ đặt"
                    dataIndex="bookingTime"
                    key="bookingTime"
                />
                <Table.Column
                    title="Số người"
                    dataIndex="pax"
                    key="pax"
                    render={(value: number) => (
                        <Tag color="blue" icon={<TeamOutlined />}>{value}</Tag>
                    )}
                />
                <Table.Column
                    title="Bàn"
                    key="table"
                    render={(_: unknown, record: BookingRecord) => (
                        record.assignedTable ? (
                            <Tag color="green">Bàn {record.assignedTable.tableNumber}</Tag>
                        ) : (
                            <Tag color="default">Chưa gán</Tag>
                        )
                    )}
                />
                <Table.Column
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(value: string) => {
                        const config = statusConfig[value] || { color: "default", label: value, icon: null };
                        return (
                            <Tag color={config.color} icon={config.icon}>
                                {config.label}
                            </Tag>
                        );
                    }}
                    filters={Object.entries(statusConfig).map(([value, config]) => ({
                        text: config.label,
                        value,
                    }))}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    width={250}
                    fixed="right"
                    render={(_: unknown, record: BookingRecord) => renderActions(record)}
                />
            </Table>
        </List>
    );
};
