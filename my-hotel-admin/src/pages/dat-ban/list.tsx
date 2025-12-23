import { List, useTable, DateField } from "@refinedev/antd";
import { Table, Tag, Space, Button, Modal, message, Tooltip, Card, Row, Col, Statistic, Select, Spin, Typography } from "antd";
import { 
    EyeOutlined, 
    EditOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
    CheckOutlined,
    TeamOutlined,
    TableOutlined
} from "@ant-design/icons";
import { useNavigation, useCan, useCustomMutation, useInvalidate } from "@refinedev/core";
import { useState } from "react";

const { Text } = Typography;

interface BookingRecord {
    id: string;
    restaurantId: string;
    restaurant?: { name: string };
    guest?: { fullName: string; phone?: string };
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
    const { tableProps, tableQuery } = useTable<BookingRecord>({
        resource: "restaurants/bookings",
        syncWithLocation: true,
    });

    const { show, edit, create } = useNavigation();
    const invalidate = useInvalidate();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [seatModalVisible, setSeatModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [availableTables, setAvailableTables] = useState<Array<{ id: string; tableNumber: string; capacity: number }>>([]);
    const [loadingTables, setLoadingTables] = useState(false);
    
    const { data: canEdit } = useCan({ resource: "dat-ban", action: "edit" });
    const { data: canCreate } = useCan({ resource: "dat-ban", action: "create" });

    const { mutate: customMutate } = useCustomMutation();
    
    const API_URL = import.meta.env.VITE_API_URL;

    // Calculate stats from data
    const bookings = tableQuery.data?.data || [];
    const pendingCount = bookings.filter((b: BookingRecord) => b.status === "pending").length;
    const confirmedCount = bookings.filter((b: BookingRecord) => b.status === "confirmed").length;
    const seatedCount = bookings.filter((b: BookingRecord) => b.status === "seated").length;

    // Fetch available tables when modal opens
    const fetchAvailableTables = async (restaurantId: string) => {
        setLoadingTables(true);
        try {
            const response = await fetch(
                `${API_URL}/restaurants/tables?restaurantId=${restaurantId}&status=available`,
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

    const handleOpenSeatModal = (booking: BookingRecord) => {
        setSelectedBooking(booking);
        setSeatModalVisible(true);
        fetchAvailableTables(booking.restaurantId);
    };

    const handleSeatConfirm = async () => {
        if (!selectedTableId || !selectedBooking) {
            message.warning("Vui lòng chọn bàn");
            return;
        }
        
        setActionLoading(`${selectedBooking.id}-seat`);
        try {
            await customMutate({
                url: `${API_URL}/restaurants/bookings/${selectedBooking.id}/seat`,
                method: "post",
                values: { tableId: selectedTableId },
            }, {
                onSuccess: () => {
                    message.success("Xác nhận khách đã đến thành công!");
                    invalidate({ resource: "restaurants/bookings", invalidates: ["list"] });
                    setSeatModalVisible(false);
                    setSelectedTableId(null);
                    setSelectedBooking(null);
                },
                onError: (error) => {
                    message.error(`Lỗi: ${error?.message || "Không thể thực hiện"}`);
                },
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleAction = async (
        bookingId: string, 
        action: "confirm" | "cancel" | "complete" | "no_show"
    ) => {
        setActionLoading(`${bookingId}-${action}`);

        const actionLabels: Record<string, string> = {
            confirm: "Xác nhận",
            cancel: "Hủy",
            complete: "Hoàn thành",
            no_show: "Đánh dấu không đến",
        };

        try {
            await customMutate({
                url: `${API_URL}/restaurants/bookings/${bookingId}/${action}`,
                method: "post",
                values: {},
            }, {
                onSuccess: () => {
                    message.success(`${actionLabels[action]} thành công!`);
                    invalidate({ resource: "restaurants/bookings", invalidates: ["list"] });
                },
                onError: (error) => {
                    message.error(`Lỗi: ${error?.message || "Không thể thực hiện"}`);
                },
            });
        } finally {
            setActionLoading(null);
        }
    };

    const showConfirmModal = (bookingId: string, action: "confirm" | "cancel" | "complete" | "no_show") => {
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

                {status === "confirmed" && (
                    <>
                        <Tooltip title="Khách đã đến - chọn bàn">
                            <Button
                                size="small"
                                type="primary"
                                style={{ background: "#52c41a" }}
                                icon={<TableOutlined />}
                                loading={isLoading("seat")}
                                onClick={() => handleOpenSeatModal(record)}
                            >
                                Chọn bàn
                            </Button>
                        </Tooltip>
                        <Tooltip title="Khách không đến">
                            <Button
                                size="small"
                                danger
                                icon={<CloseCircleOutlined />}
                                loading={isLoading("no_show")}
                                onClick={() => showConfirmModal(id, "no_show")}
                            >
                                Không đến
                            </Button>
                        </Tooltip>
                    </>
                )}

                {status === "seated" && (
                    <Tooltip title="Khách đã dùng xong">
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

            <Table {...tableProps} rowKey="id" size="middle">
                <Table.Column
                    title="Nhà hàng"
                    dataIndex={["restaurant", "name"]}
                    key="restaurantName"
                    render={(value: string) => value || "N/A"}
                />
                <Table.Column
                    title="Khách hàng"
                    key="guestName"
                    render={(_: unknown, record: BookingRecord) => (
                        <div>
                            <div style={{ fontWeight: 500 }}>
                                {record.guest?.fullName || record.contactName || "N/A"}
                            </div>
                            <div style={{ fontSize: 12, color: "#666" }}>
                                {record.contactPhone || record.guest?.phone || ""}
                            </div>
                        </div>
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
                    title="Giờ"
                    dataIndex="bookingTime"
                    key="bookingTime"
                    width={80}
                />
                <Table.Column
                    title="Số người"
                    dataIndex="pax"
                    key="pax"
                    width={90}
                    render={(value: number) => (
                        <Tag color="blue">{value} người</Tag>
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
                    width={280}
                    fixed="right"
                    render={(_: unknown, record: BookingRecord) => renderActions(record)}
                />
            </Table>

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
                    setSelectedBooking(null);
                }}
                confirmLoading={actionLoading === `${selectedBooking?.id}-seat`}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                {selectedBooking && (
                    <div style={{ marginBottom: 16 }}>
                        <Text>
                            Đặt bàn cho <Text strong>{selectedBooking.guest?.fullName || selectedBooking.contactName}</Text> - {selectedBooking.pax} người
                        </Text>
                    </div>
                )}
                
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
        </List>
    );
};
