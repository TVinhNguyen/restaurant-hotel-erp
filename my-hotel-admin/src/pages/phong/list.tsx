import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Card, Row, Col, Typography, Select, Spin, Statistic, Modal, Descriptions, Divider } from "antd";
import { EyeOutlined, HomeOutlined, CheckCircleOutlined, StopOutlined, SyncOutlined, ToolOutlined, ReloadOutlined, DollarOutlined, TeamOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Text, Title } = Typography;

const TOKEN_KEY = "refine-auth";
const USER_KEY = "refine-user";
const API_URL = "http://34.151.224.213:4000/api/v1";

export const PhongList: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [propertyName, setPropertyName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [allRooms, setAllRooms] = useState<any[]>([]); // For stats
    
    // View modal
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

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

    // Fetch all rooms for stats
    useEffect(() => {
        if (!propertyId) return;

        const fetchAllRooms = async () => {
            try {
                const response = await fetch(`${API_URL}/rooms?propertyId=${propertyId}`, {
                    headers: getAuthHeader(),
                });
                const data = await response.json();
                // API returns {data: [], total: number} or array
                const roomsArray = Array.isArray(data) ? data : (data?.data || []);
                setAllRooms(roomsArray);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchAllRooms();
    }, [propertyId]);

    const { tableProps } = useTable({
        resource: "rooms",
        syncWithLocation: true,
        filters: {
            permanent: [
                ...(propertyId
                    ? [
                        {
                            field: "propertyId",
                            operator: "eq" as const,
                            value: propertyId,
                        },
                    ]
                    : []),
                ...(statusFilter
                    ? [
                        {
                            field: "status",
                            operator: "eq" as const,
                            value: statusFilter,
                        },
                    ]
                    : []),
            ],
        },
        meta: {
            include: "roomType,amenities",
        },
    });

    // Room status configuration
    const roomStatusConfig: Record<string, { label: string; color: string; icon: string }> = {
        available: { label: "Trống", color: "success", icon: "✓" },
        occupied: { label: "Đang sử dụng", color: "error", icon: "●" },
        cleaning: { label: "Đang dọn", color: "processing", icon: "⟳" },
        maintenance: { label: "Bảo trì", color: "warning", icon: "⚠" },
        reserved: { label: "Đã đặt", color: "default", icon: "◐" },
    };

    // Calculate room statistics from ALL rooms (unfiltered)
    const stats = {
        total: allRooms.length,
        available: allRooms.filter((r) => r.status === "available").length,
        occupied: allRooms.filter((r) => r.status === "occupied").length,
        cleaning: allRooms.filter((r) => r.status === "cleaning").length,
        maintenance: allRooms.filter((r) => r.status === "maintenance").length,
    };

    const handleView = (record: any) => {
        setSelectedRoom(record);
        setViewModalVisible(true);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Responsive Stats Row - Always show total stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={8} md={4}>
                    <Card 
                        hoverable
                        onClick={() => setStatusFilter(undefined)}
                        style={{ borderBottom: !statusFilter ? "3px solid #1890ff" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Tổng số phòng"
                            value={stats.total}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: "#1890ff", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card 
                        hoverable 
                        onClick={() => setStatusFilter("available")} 
                        style={{ cursor: "pointer", borderBottom: statusFilter === "available" ? "3px solid #52c41a" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Phòng trống"
                            value={stats.available}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#52c41a", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card 
                        hoverable 
                        onClick={() => setStatusFilter("occupied")} 
                        style={{ cursor: "pointer", borderBottom: statusFilter === "occupied" ? "3px solid #ff4d4f" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Đang sử dụng"
                            value={stats.occupied}
                            prefix={<StopOutlined />}
                            valueStyle={{ color: "#ff4d4f", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card 
                        hoverable 
                        onClick={() => setStatusFilter("cleaning")} 
                        style={{ cursor: "pointer", borderBottom: statusFilter === "cleaning" ? "3px solid #1890ff" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Đang dọn"
                            value={stats.cleaning}
                            prefix={<SyncOutlined />}
                            valueStyle={{ color: "#1890ff", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card 
                        hoverable 
                        onClick={() => setStatusFilter("maintenance")} 
                        style={{ cursor: "pointer", borderBottom: statusFilter === "maintenance" ? "3px solid #faad14" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Bảo trì"
                            value={stats.maintenance}
                            prefix={<ToolOutlined />}
                            valueStyle={{ color: "#faad14", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card 
                        hoverable 
                        onClick={() => setStatusFilter(undefined)} 
                        style={{ cursor: "pointer", borderBottom: "3px solid transparent" }}
                    >
                        <Statistic
                            title="Xem tất cả"
                            value="Reset"
                            prefix={<ReloadOutlined />}
                            valueStyle={{ color: "#722ed1", fontSize: 20 }}
                        />
                    </Card>
                </Col>
            </Row>

            <List
                title={`Danh sách phòng - ${propertyName}`}
                canCreate={false}
                headerButtons={({ defaultButtons }) => (
                    <>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            style={{ width: 200 }}
                            allowClear
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                        >
                            <Select.Option value="available">Phòng trống</Select.Option>
                            <Select.Option value="occupied">Đang sử dụng</Select.Option>
                            <Select.Option value="cleaning">Đang dọn</Select.Option>
                            <Select.Option value="maintenance">Bảo trì</Select.Option>
                            <Select.Option value="reserved">Đã đặt</Select.Option>
                        </Select>
                        {defaultButtons}
                    </>
                )}
            >
                <Table 
                    {...tableProps} 
                    rowKey="id" 
                    scroll={{ x: 900 }}
                    pagination={{ pageSize: 10, showTotal: (total) => `Hiển thị ${total} phòng` }}
                >
                    <Table.Column
                        title="Số phòng"
                        dataIndex="roomNumber"
                        key="roomNumber"
                        render={(value) => (
                            <Space>
                                <HomeOutlined />
                                <Text strong style={{ fontSize: 16 }}>
                                    {value}
                                </Text>
                            </Space>
                        )}
                        sorter
                    />
                    <Table.Column
                        title="Loại phòng"
                        dataIndex={["roomType", "name"]}
                        key="roomType"
                        render={(value, record: any) => (
                            <Space direction="vertical" size={0}>
                                <Text>{value}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Sức chứa: {record.roomType?.capacity} người
                                </Text>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Tầng"
                        dataIndex="floor"
                        key="floor"
                        render={(value) => <Text>Tầng {value}</Text>}
                        sorter
                    />
                    <Table.Column
                        title="Giá phòng"
                        dataIndex={["roomType", "basePrice"]}
                        key="price"
                        render={(value: number) => (
                            <Text strong style={{ color: "#3f8600" }}>
                                {value?.toLocaleString("vi-VN")} VNĐ/đêm
                            </Text>
                        )}
                    />
                    <Table.Column
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(status: string) => {
                            const config = roomStatusConfig[status] || {
                                label: status,
                                color: "default",
                                icon: "?",
                            };
                            return (
                                <Tag color={config.color}>
                                    {config.icon} {config.label}
                                </Tag>
                            );
                        }}
                    />
                    <Table.Column
                        title="Ghi chú"
                        dataIndex="notes"
                        key="notes"
                        render={(value) => (
                            <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                                {value || "-"}
                            </Text>
                        )}
                    />
                    <Table.Column
                        title="Thao tác"
                        key="actions"
                        render={(_, record: any) => (
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleView(record)}
                            >
                                Xem
                            </Button>
                        )}
                    />
                </Table>
            </List>

            {/* View Room Modal */}
            <Modal
                title={
                    <Space>
                        <HomeOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>Chi tiết phòng {selectedRoom?.roomNumber}</Title>
                            <Text type="secondary">{selectedRoom?.roomType?.name}</Text>
                        </div>
                    </Space>
                }
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedRoom(null);
                }}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedRoom && (
                    <>
                        <Divider orientation="left"><HomeOutlined /> Thông tin phòng</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Số phòng">
                                <Text strong style={{ fontSize: 16 }}>{selectedRoom.roomNumber}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tầng">
                                Tầng {selectedRoom.floor}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại phòng" span={2}>
                                {selectedRoom.roomType?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={roomStatusConfig[selectedRoom.status]?.color || "default"}>
                                    {roomStatusConfig[selectedRoom.status]?.icon} {roomStatusConfig[selectedRoom.status]?.label || selectedRoom.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="View">
                                {selectedRoom.viewType || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left"><TeamOutlined /> Thông tin loại phòng</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Sức chứa">
                                {selectedRoom.roomType?.capacity} người
                            </Descriptions.Item>
                            <Descriptions.Item label="Diện tích">
                                {selectedRoom.roomType?.size || "-"} m²
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả" span={2}>
                                {selectedRoom.roomType?.description || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left"><DollarOutlined /> Thông tin giá</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Giá cơ bản" span={2}>
                                <Text strong style={{ color: "#52c41a", fontSize: 18 }}>
                                    {selectedRoom.roomType?.basePrice?.toLocaleString("vi-VN")} VNĐ/đêm
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>

                        {selectedRoom.notes && (
                            <>
                                <Divider orientation="left"><EnvironmentOutlined /> Ghi chú</Divider>
                                <Card size="small" style={{ background: "#f5f5f5" }}>
                                    {selectedRoom.notes}
                                </Card>
                            </>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};
