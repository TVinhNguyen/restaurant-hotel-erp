import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Card, Row, Col, Typography, Select } from "antd";
import { EyeOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigation, useCan, useGetIdentity } from "@refinedev/core";
import { useState, useEffect } from "react";

const { Text } = Typography;

export const PhongList: React.FC = () => {
    const { show, edit } = useNavigation();
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [propertyId, setPropertyId] = useState<number | null>(null);

    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        occupied: 0,
        cleaning: 0,
        maintenance: 0,
    });

    useEffect(() => {
        const fetchPropertyId = async () => {
            const userStr = localStorage.getItem("refine-user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const token = localStorage.getItem("refine-auth");
                const API_URL = import.meta.env.VITE_API_URL;
                try {
                    const response = await fetch(
                        `${API_URL}/employees/get-employee-by-user-id/${user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        const employeeRoleDataResponse = await fetch(
                            `${API_URL}/employee-roles?employeeId=${data.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (employeeRoleDataResponse.ok) {
                            const employeeRoleData = await employeeRoleDataResponse.json();
                            const propertyIdFromApi = employeeRoleData[0]?.propertyId;
                            setPropertyId(propertyIdFromApi);
                            if (propertyIdFromApi) {
                                const roomsStatsResponse = await fetch(
                                    `${API_URL}/rooms?propertyId=${propertyIdFromApi}&limit=9999`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                if (roomsStatsResponse.ok) {
                                    const roomsData = await roomsStatsResponse.json();
                                    const allRooms = roomsData.data || [];
                                    setStats({
                                        total: allRooms.length,
                                        available: allRooms.filter((r: any) => r.operationalStatus === "available").length,
                                        occupied: allRooms.filter((r: any) => r.operationalStatus === "occupied").length,
                                        cleaning: allRooms.filter((r: any) => r.operationalStatus === "cleaning").length,
                                        maintenance: allRooms.filter((r: any) => r.operationalStatus === "maintenance").length,
                                    });
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching propertyId:", error);
                }
            }
        };
        fetchPropertyId();
    }, []);

    // Check permissions
    const { data: canEdit } = useCan({
        resource: "phong",
        action: "edit",
    });

    const { tableProps } = useTable({
        resource: "rooms",
        syncWithLocation: true,
        pagination: {
            currentPage: 1,
            pageSize: 10,
        },
        filters: {
            permanent: propertyId ? [
                {
                    field: "propertyId",
                    operator: "eq",
                    value: propertyId,
                },
            ] : [],
        },
    });

    console.log("Table Props:", tableProps);

    // Room status configuration
    const roomStatusConfig: Record<string, { label: string; color: string; icon: string }> = {
        available: { label: "Trống", color: "success", icon: "✓" },
        occupied: { label: "Đang sử dụng", color: "error", icon: "●" },
        cleaning: { label: "Đang dọn", color: "processing", icon: "⟳" },
        maintenance: { label: "Bảo trì", color: "warning", icon: "⚠" },
        reserved: { label: "Đã đặt", color: "default", icon: "◐" },
    };

    // Calculate room statistics
    const rooms = (tableProps.dataSource as any[]) || [];
    // const stats = {
    //     total: tableProps?.pagination?.total,
    //     available: rooms.filter((r) => r.operationalStatus === "available").length,
    //     occupied: rooms.filter((r) => r.operationalStatus === "occupied").length,
    //     cleaning: rooms.filter((r) => r.operationalStatus === "cleaning").length,
    //     maintenance: rooms.filter((r) => r.operationalStatus === "maintenance").length,
    // };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={4}>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <HomeOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Tổng số phòng</Text>
                                <div style={{ fontSize: 20, fontWeight: "bold" }}>
                                    {stats.total}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={4}>
                    <Card onClick={() => setStatusFilter("available")} style={{ cursor: "pointer" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 24, color: "#52c41a" }}>✓</div>
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Phòng trống</Text>
                                <div style={{ fontSize: 20, fontWeight: "bold", color: "#52c41a" }}>
                                    {stats.available}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={4}>
                    <Card onClick={() => setStatusFilter("occupied")} style={{ cursor: "pointer" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 24, color: "#ff4d4f" }}>●</div>
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Đang sử dụng</Text>
                                <div style={{ fontSize: 20, fontWeight: "bold", color: "#ff4d4f" }}>
                                    {stats.occupied}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={4}>
                    <Card onClick={() => setStatusFilter("cleaning")} style={{ cursor: "pointer" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 24, color: "#1890ff" }}>⟳</div>
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Đang dọn</Text>
                                <div style={{ fontSize: 20, fontWeight: "bold", color: "#1890ff" }}>
                                    {stats.cleaning}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={4}>
                    <Card onClick={() => setStatusFilter("maintenance")} style={{ cursor: "pointer" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 24, color: "#faad14" }}>⚠</div>
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Bảo trì</Text>
                                <div style={{ fontSize: 20, fontWeight: "bold", color: "#faad14" }}>
                                    {stats.maintenance}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={4}>
                    <Card onClick={() => setStatusFilter(undefined)} style={{ cursor: "pointer" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 24 }}>🔄</div>
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Xem tất cả</Text>
                                <div style={{ fontSize: 14 }}>
                                    <Button type="link" size="small">Reset</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <List
                title="Danh sách phòng"
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
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        title="Số phòng"
                        dataIndex="number"
                        key="number"
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
                                    Sức chứa: {record.roomType?.maxAdults + record.roomType?.maxChildren} người
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Trong đó tối đa: {record.roomType?.maxAdults} người lớn, {record.roomType?.maxChildren} trẻ em
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
                        dataIndex="operationalStatus"
                        key="operationalStatus"
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
                        filters={[
                            { text: "Phòng trống", value: "available" },
                            { text: "Đang sử dụng", value: "occupied" },
                            { text: "Đang dọn", value: "cleaning" },
                            { text: "Bảo trì", value: "maintenance" },
                            { text: "Đã đặt", value: "reserved" },
                        ]}
                    />
                    <Table.Column
                        title="Góc view"
                        dataIndex="viewType"
                        key="viewType"
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
                            <Space>
                                <Button
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => show("rooms", record.id)}
                                >
                                    Xem
                                </Button>
                                {canEdit?.can && (
                                    <Button
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => edit("rooms", record.id)}
                                    >
                                        Sửa
                                    </Button>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </List>
        </div>
    );
};
