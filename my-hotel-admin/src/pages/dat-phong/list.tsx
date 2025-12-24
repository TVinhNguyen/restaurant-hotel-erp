import { useTable, List, DateField } from "@refinedev/antd";
import { Table, Space, Button, Tag, Modal, Typography, Input, Select, DatePicker, Row, Col, Card, Spin } from "antd";
import { EyeOutlined, EditOutlined, CloseCircleOutlined, SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { useNavigation, useCan, useUpdate, useApiUrl } from "@refinedev/core";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import axios from "axios";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const DatPhongList: React.FC = () => {
    const { show, edit } = useNavigation();
    const { mutate: updateReservation } = useUpdate();
    const apiUrl = useApiUrl();
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<any>(null);

    // Room details cache - fetch thêm thông tin phòng
    const [roomDetailsCache, setRoomDetailsCache] = useState<Record<string, any>>({});
    const [loadingRoomDetails, setLoadingRoomDetails] = useState<Record<string, boolean>>({});

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [searchText, setSearchText] = useState<string>("");
    const [checkInRange, setCheckInRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
    const [checkOutRange, setCheckOutRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

    const { tableProps, setFilters } = useTable({
        resource: "reservations",
        syncWithLocation: true,
        filters: {
            permanent: [
                {
                    field: "includeRelations",
                    operator: "eq",
                    value: true,
                },
            ],
        },
        sorters: {
            initial: [
                {
                    field: "createdAt",
                    order: "desc",
                },
            ],
        },
    });

    // Fetch room details for a reservation
    const fetchRoomDetails = useCallback(async (reservationId: string) => {
        if (roomDetailsCache[reservationId] || loadingRoomDetails[reservationId]) {
            return;
        }

        setLoadingRoomDetails(prev => ({ ...prev, [reservationId]: true }));
        
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${apiUrl}/reservations/${reservationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setRoomDetailsCache(prev => ({
                ...prev,
                [reservationId]: {
                    roomType: response.data.roomType,
                    assignedRoom: response.data.assignedRoom,
                }
            }));
        } catch (error) {
            console.error("Failed to fetch room details:", error);
        } finally {
            setLoadingRoomDetails(prev => ({ ...prev, [reservationId]: false }));
        }
    }, [apiUrl, roomDetailsCache, loadingRoomDetails]);

    // Fetch room details for visible reservations
    useEffect(() => {
        const dataSource = tableProps.dataSource as any[];
        if (dataSource?.length) {
            dataSource.forEach(record => {
                // Only fetch if we don't have roomType/assignedRoom from API
                if (!record.roomType && !roomDetailsCache[record.id]) {
                    fetchRoomDetails(record.id);
                }
            });
        }
    }, [tableProps.dataSource, fetchRoomDetails, roomDetailsCache]);

    // Kiểm tra permissions
    const { data: canEdit } = useCan({
        resource: "dat-phong",
        action: "edit",
    });

    const { data: canCreate } = useCan({
        resource: "dat-phong",
        action: "create",
    });

    const { data: canCancel } = useCan({
        resource: "dat-phong",
        action: "delete",
    });

    const handleCancelClick = (record: any) => {
        setSelectedReservation(record);
        setCancelModalVisible(true);
    };

    const handleConfirmCancel = () => {
        if (selectedReservation) {
            updateReservation({
                resource: "reservations",
                id: selectedReservation.id,
                values: {
                    status: "cancelled",
                },
                successNotification: {
                    message: "Đã hủy đặt phòng thành công",
                    type: "success",
                },
            });
            setCancelModalVisible(false);
            setSelectedReservation(null);
        }
    };

    const statusColors: Record<string, string> = {
        pending: "orange",
        confirmed: "blue",
        checked_in: "green",
        checked_out: "default",
        cancelled: "red",
    };

    const statusLabels: Record<string, string> = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        checked_in: "Đã check-in",
        checked_out: "Đã check-out",
        cancelled: "Đã hủy",
    };

    // Handle filter application
    const handleApplyFilters = () => {
        const filters: any[] = [];

        if (statusFilter) {
            filters.push({
                field: "status",
                operator: "eq",
                value: statusFilter,
            });
        }

        if (checkInRange && checkInRange[0] && checkInRange[1]) {
            filters.push({
                field: "checkInFrom",
                operator: "eq",
                value: checkInRange[0].format("YYYY-MM-DD"),
            });
            filters.push({
                field: "checkInTo",
                operator: "eq",
                value: checkInRange[1].format("YYYY-MM-DD"),
            });
        }

        if (checkOutRange && checkOutRange[0] && checkOutRange[1]) {
            filters.push({
                field: "checkOutFrom",
                operator: "eq",
                value: checkOutRange[0].format("YYYY-MM-DD"),
            });
            filters.push({
                field: "checkOutTo",
                operator: "eq",
                value: checkOutRange[1].format("YYYY-MM-DD"),
            });
        }

        setFilters(filters, "replace");
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setStatusFilter(undefined);
        setSearchText("");
        setCheckInRange(null);
        setCheckOutRange(null);
        setFilters([], "replace");
    };

    // Filter data locally for search (name, email, confirmation code)
    const filteredData = searchText
        ? (tableProps.dataSource as any[])?.filter((record) => {
            const searchLower = searchText.toLowerCase();
            const guestName = (record.guest?.name || record.contactName || "").toLowerCase();
            const guestEmail = (record.guest?.email || record.contactEmail || "").toLowerCase();
            const confirmationCode = (record.confirmationCode || "").toLowerCase();
            return guestName.includes(searchLower) || 
                   guestEmail.includes(searchLower) ||
                   confirmationCode.includes(searchLower);
        })
        : tableProps.dataSource;

    return (
        <List
            title="Danh sách đặt phòng"
            canCreate={canCreate?.can}
            createButtonProps={{
                children: "Tạo đặt phòng mới",
            }}
        >
            {/* Filter Section */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Tìm theo tên, email, mã đặt phòng..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: "100%" }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            allowClear
                        >
                            <Select.Option value="pending">Chờ xác nhận</Select.Option>
                            <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                            <Select.Option value="checked_in">Đã check-in</Select.Option>
                            <Select.Option value="checked_out">Đã check-out</Select.Option>
                            <Select.Option value="cancelled">Đã hủy</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={5}>
                        <RangePicker
                            placeholder={["Check-in từ", "đến"]}
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            value={checkInRange}
                            onChange={(dates) => setCheckInRange(dates)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={5}>
                        <RangePicker
                            placeholder={["Check-out từ", "đến"]}
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            value={checkOutRange}
                            onChange={(dates) => setCheckOutRange(dates)}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={4}>
                        <Space>
                            <Button
                                type="primary"
                                icon={<FilterOutlined />}
                                onClick={handleApplyFilters}
                            >
                                Lọc
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearFilters}
                            >
                                Xóa lọc
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Table 
                {...tableProps} 
                dataSource={filteredData}
                rowKey="id"
                pagination={{
                    ...tableProps.pagination,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đặt phòng`,
                }}
            >
                <Table.Column
                    title="Mã đặt phòng"
                    dataIndex="confirmationCode"
                    key="confirmationCode"
                    sorter={(a: any, b: any) => (a.confirmationCode || "").localeCompare(b.confirmationCode || "")}
                />
                <Table.Column
                    title="Tên khách"
                    key="guestName"
                    render={(_, record: any) => {
                        const phone = record.guest?.phone || record.contactPhone;
                        return (
                            <div>
                                <div>{record.guest?.name || record.contactName || "N/A"}</div>
                                {phone && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {phone}
                                    </Text>
                                )}
                            </div>
                        );
                    }}
                />
                <Table.Column
                    title="Loại phòng"
                    key="roomType"
                    render={(_, record: any) => {
                        // Try from API response first, then from cache
                        const roomType = record.roomType || roomDetailsCache[record.id]?.roomType;
                        if (loadingRoomDetails[record.id]) {
                            return <Spin size="small" />;
                        }
                        return roomType?.name || <Text type="secondary">-</Text>;
                    }}
                />
                <Table.Column
                    title="Số phòng"
                    key="roomNumber"
                    render={(_, record: any) => {
                        const assignedRoom = record.assignedRoom || roomDetailsCache[record.id]?.assignedRoom;
                        if (loadingRoomDetails[record.id]) {
                            return <Spin size="small" />;
                        }
                        return assignedRoom?.number 
                            ? <Tag color="blue">Phòng {assignedRoom.number}</Tag>
                            : <Text type="secondary">Chưa gán</Text>;
                    }}
                />
                <Table.Column
                    title="Ngày check-in"
                    dataIndex="checkIn"
                    key="checkIn"
                    sorter={(a: any, b: any) => dayjs(a.checkIn).unix() - dayjs(b.checkIn).unix()}
                    render={(value) => (
                        value ? <DateField value={value} format="DD/MM/YYYY" /> : "N/A"
                    )}
                />
                <Table.Column
                    title="Ngày check-out"
                    dataIndex="checkOut"
                    key="checkOut"
                    sorter={(a: any, b: any) => dayjs(a.checkOut).unix() - dayjs(b.checkOut).unix()}
                    render={(value) => (
                        value ? <DateField value={value} format="DD/MM/YYYY" /> : "N/A"
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
                    title="Tổng tiền"
                    dataIndex="totalAmount"
                    key="totalAmount"
                    sorter={(a: any, b: any) => parseFloat(a.totalAmount || 0) - parseFloat(b.totalAmount || 0)}
                    render={(value: number | string) => {
                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                        return <span>{numValue?.toLocaleString("vi-VN")} VNĐ</span>;
                    }}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    render={(_, record: any) => (
                        <Space>
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => show("dat-phong", record.id)}
                            >
                                Xem
                            </Button>
                            {canEdit?.can && record.status !== "cancelled" && (
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => edit("dat-phong", record.id)}
                                >
                                    Sửa
                                </Button>
                            )}
                            {canCancel?.can &&
                                record.status !== "cancelled" &&
                                record.status !== "checked_out" && (
                                    <Button
                                        size="small"
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => handleCancelClick(record)}
                                    >
                                        Hủy
                                    </Button>
                                )}
                        </Space>
                    )}
                />
            </Table>

            {/* Cancel Confirmation Modal */}
            <Modal
                title="Xác nhận hủy đặt phòng"
                open={cancelModalVisible}
                onOk={handleConfirmCancel}
                onCancel={() => {
                    setCancelModalVisible(false);
                    setSelectedReservation(null);
                }}
                okText="Xác nhận hủy"
                okButtonProps={{ danger: true }}
                cancelText="Đóng"
            >
                <div style={{ marginBottom: 16 }}>
                    <Text>Bạn có chắc chắn muốn hủy đặt phòng này?</Text>
                </div>
                {selectedReservation && (
                    <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                        <div><Text strong>Mã đặt phòng:</Text> {selectedReservation.confirmationCode}</div>
                        <div><Text strong>Khách hàng:</Text> {selectedReservation.guest?.fullName}</div>
                        <div><Text strong>Phòng:</Text> {selectedReservation.roomType?.name}</div>
                    </div>
                )}
                <div style={{ marginTop: 16, padding: 12, background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 4 }}>
                    <Text type="warning">
                        ⚠️ Hành động này không thể hoàn tác. Đặt phòng sẽ bị hủy vĩnh viễn.
                    </Text>
                </div>
            </Modal>
        </List>
    );
};
