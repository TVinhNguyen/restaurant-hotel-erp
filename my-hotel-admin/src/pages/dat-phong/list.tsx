import { useTable, List, DateField } from "@refinedev/antd";
import { Table, Space, Button, Tag, Modal, Typography, Card, Row, Col, Statistic, Spin, Input, Select, Descriptions, Divider } from "antd";
import { EyeOutlined, CloseCircleOutlined, ScheduleOutlined, CheckCircleOutlined, ClockCircleOutlined, SearchOutlined, UserOutlined, HomeOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import { useNavigation, useUpdate } from "@refinedev/core";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const TOKEN_KEY = "refine-auth";
const USER_KEY = "refine-user";
const API_URL = "http://34.151.224.213:4000/api/v1";

export const DatPhongList: React.FC = () => {
    const { show } = useNavigation();
    const { mutate: updateReservation } = useUpdate();
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [propertyName, setPropertyName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [searchText, setSearchText] = useState("");
    
    // For total stats (unfiltered)
    const [allReservations, setAllReservations] = useState<any[]>([]);
    
    // View modal
    const [viewModalVisible, setViewModalVisible] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchPropertyId = async () => {
            try {
                const userStr = localStorage.getItem(USER_KEY);
                if (!userStr) return;
                
                const userData = JSON.parse(userStr);
                const userId = userData.id;

                // Get employee by userId
                const empResponse = await fetch(`${API_URL}/employees/get-employee-by-user-id/${userId}`, {
                    headers: getAuthHeader(),
                });
                const empData = await empResponse.json();

                if (empData?.id) {
                    // Get employee roles
                    const roleResponse = await fetch(`${API_URL}/employee-roles?employeeId=${empData.id}`, {
                        headers: getAuthHeader(),
                    });
                    const roleData = await roleResponse.json();

                    if (roleData?.length > 0 && roleData[0]?.propertyId) {
                        setPropertyId(roleData[0].propertyId);

                        // Fetch property name
                        const propResponse = await fetch(`${API_URL}/properties/${roleData[0].propertyId}`, {
                            headers: getAuthHeader(),
                        });
                        const propData = await propResponse.json();
                        setPropertyName(propData?.name || "");
                    }
                }
            } catch (error) {
                console.error("Error fetching propertyId:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPropertyId();
    }, []);

    // Fetch all reservations for stats
    useEffect(() => {
        if (!propertyId) return;

        const fetchAllReservations = async () => {
            try {
                const response = await fetch(`${API_URL}/reservations?propertyId=${propertyId}`, {
                    headers: getAuthHeader(),
                });
                const data = await response.json();
                // API returns {data: [], total: number} or array
                const reservationsArray = Array.isArray(data) ? data : (data?.data || []);
                setAllReservations(reservationsArray);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };

        fetchAllReservations();
    }, [propertyId]);

    const { tableProps } = useTable({
        resource: "reservations",
        syncWithLocation: true,
        filters: {
            permanent: [
                ...(propertyId
                    ? [{ field: "propertyId", operator: "eq" as const, value: propertyId }]
                    : []),
                ...(statusFilter
                    ? [{ field: "status", operator: "eq" as const, value: statusFilter }]
                    : []),
            ],
        },
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

    const handleView = (record: any) => {
        setSelectedReservation(record);
        setViewModalVisible(true);
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

    // Calculate statistics from ALL reservations (unfiltered)
    const stats = {
        total: allReservations.length,
        pending: allReservations.filter((r) => r.status === "pending").length,
        confirmed: allReservations.filter((r) => r.status === "confirmed").length,
        checkedIn: allReservations.filter((r) => r.status === "checked_in").length,
        cancelled: allReservations.filter((r) => r.status === "cancelled").length,
    };

    // Filter by search (applied to table data)
    const reservations = (tableProps.dataSource as any[]) || [];
    const filteredData = reservations.filter((r) => {
        if (!searchText) return true;
        const search = searchText.toLowerCase();
        return (
            r.confirmationCode?.toLowerCase().includes(search) ||
            r.guest?.fullName?.toLowerCase().includes(search) ||
            r.roomType?.name?.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Stats Cards - Always show total stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={8} md={4}>
                    <Card hoverable onClick={() => setStatusFilter(undefined)} style={{ borderBottom: !statusFilter ? "3px solid #1890ff" : "3px solid transparent" }}>
                        <Statistic
                            title="Tổng đặt phòng"
                            value={stats.total}
                            prefix={<ScheduleOutlined />}
                            valueStyle={{ color: "#1890ff", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card hoverable onClick={() => setStatusFilter("pending")} style={{ cursor: "pointer", borderBottom: statusFilter === "pending" ? "3px solid #faad14" : "3px solid transparent" }}>
                        <Statistic
                            title="Chờ xác nhận"
                            value={stats.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: "#faad14", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card hoverable onClick={() => setStatusFilter("confirmed")} style={{ cursor: "pointer", borderBottom: statusFilter === "confirmed" ? "3px solid #1890ff" : "3px solid transparent" }}>
                        <Statistic
                            title="Đã xác nhận"
                            value={stats.confirmed}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#1890ff", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card hoverable onClick={() => setStatusFilter("checked_in")} style={{ cursor: "pointer", borderBottom: statusFilter === "checked_in" ? "3px solid #52c41a" : "3px solid transparent" }}>
                        <Statistic
                            title="Đã check-in"
                            value={stats.checkedIn}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#52c41a", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card hoverable onClick={() => setStatusFilter("cancelled")} style={{ cursor: "pointer", borderBottom: statusFilter === "cancelled" ? "3px solid #ff4d4f" : "3px solid transparent" }}>
                        <Statistic
                            title="Đã hủy"
                            value={stats.cancelled}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: "#ff4d4f", fontSize: 24 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm kiếm mã đặt phòng, tên khách..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            style={{ width: "100%" }}
                            allowClear
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Select.Option value="pending">Chờ xác nhận</Select.Option>
                            <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                            <Select.Option value="checked_in">Đã check-in</Select.Option>
                            <Select.Option value="checked_out">Đã check-out</Select.Option>
                            <Select.Option value="cancelled">Đã hủy</Select.Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            <List
                title={`Danh sách đặt phòng - ${propertyName}`}
                canCreate={false}
            >
                <Table 
                    {...tableProps} 
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 900 }}
                    pagination={{ pageSize: 10, showTotal: (total) => `Tổng: ${total} đặt phòng` }}
                >
                <Table.Column
                    title="Mã đặt phòng"
                    dataIndex="confirmationCode"
                    key="confirmationCode"
                    render={(code: string) => <Text strong>{code}</Text>}
                />
                <Table.Column
                    title="Tên khách"
                    dataIndex={["guest", "fullName"]}
                    key="guestName"
                />
                <Table.Column
                    title="Loại phòng"
                    dataIndex={["roomType", "name"]}
                    key="roomType"
                />
                <Table.Column
                    title="Số phòng"
                    dataIndex={["room", "roomNumber"]}
                    key="roomNumber"
                    render={(roomNumber: string) => roomNumber || "-"}
                />
                <Table.Column
                    title="Check-in"
                    dataIndex="checkInDate"
                    key="checkInDate"
                    render={(value) => (
                        <DateField value={value} format="DD/MM/YYYY" />
                    )}
                />
                <Table.Column
                    title="Check-out"
                    dataIndex="checkOutDate"
                    key="checkOutDate"
                    render={(value) => (
                        <DateField value={value} format="DD/MM/YYYY" />
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
                    render={(value: number) => (
                        <Text strong style={{ color: "#52c41a" }}>
                            {value?.toLocaleString("vi-VN")} VNĐ
                        </Text>
                    )}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    render={(_, record: any) => (
                        <Space>
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleView(record)}
                            >
                                Xem
                            </Button>
                            {record.status !== "cancelled" && record.status !== "checked_out" && (
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
            </List>

            {/* View Reservation Modal */}
            <Modal
                title={
                    <Space>
                        <ScheduleOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>Chi tiết đặt phòng</Title>
                            <Text type="secondary">{selectedReservation?.confirmationCode}</Text>
                        </div>
                    </Space>
                }
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedReservation(null);
                }}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={700}
            >
                {selectedReservation && (
                    <>
                        <Divider orientation="left"><UserOutlined /> Thông tin khách hàng</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Họ và tên" span={2}>
                                {selectedReservation.guest?.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {selectedReservation.guest?.email || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                {selectedReservation.guest?.phone || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left"><HomeOutlined /> Thông tin phòng</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Loại phòng">
                                {selectedReservation.roomType?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số phòng">
                                {selectedReservation.room?.roomNumber || "Chưa gán"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số người lớn">
                                {selectedReservation.adults || 1}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số trẻ em">
                                {selectedReservation.children || 0}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left"><CalendarOutlined /> Thông tin đặt phòng</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Ngày check-in">
                                {selectedReservation.checkInDate ? dayjs(selectedReservation.checkInDate).format("DD/MM/YYYY") : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày check-out">
                                {selectedReservation.checkOutDate ? dayjs(selectedReservation.checkOutDate).format("DD/MM/YYYY") : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số đêm">
                                {selectedReservation.checkInDate && selectedReservation.checkOutDate 
                                    ? dayjs(selectedReservation.checkOutDate).diff(dayjs(selectedReservation.checkInDate), 'day')
                                    : "-"
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={statusColors[selectedReservation.status]}>
                                    {statusLabels[selectedReservation.status] || selectedReservation.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú" span={2}>
                                {selectedReservation.notes || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left"><DollarOutlined /> Thông tin thanh toán</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Tổng tiền" span={2}>
                                <Text strong style={{ color: "#52c41a", fontSize: 18 }}>
                                    {selectedReservation.totalAmount?.toLocaleString("vi-VN")} VNĐ
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>

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
        </div>
    );
};
