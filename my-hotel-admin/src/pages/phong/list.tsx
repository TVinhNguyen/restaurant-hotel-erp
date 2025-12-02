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

    const { data: identity } = useGetIdentity<any>();

    useEffect(() => {
        const fetchPropertyId = async () => {
            const userStr = localStorage.getItem("refine-user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const token = JSON.parse(localStorage.getItem("refine-auth") || '""');
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
                        setPropertyId(data.propertyId);
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

    console.log("Table Data:", tableProps.dataSource);

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
    const stats = {
        total: rooms.length,
        available: rooms.filter((r) => r.status === "available").length,
        occupied: rooms.filter((r) => r.status === "occupied").length,
        cleaning: rooms.filter((r) => r.status === "cleaning").length,
        maintenance: rooms.filter((r) => r.status === "maintenance").length,
    };

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
                        filters={[
                            { text: "Phòng trống", value: "available" },
                            { text: "Đang sử dụng", value: "occupied" },
                            { text: "Đang dọn", value: "cleaning" },
                            { text: "Bảo trì", value: "maintenance" },
                            { text: "Đã đặt", value: "reserved" },
                        ]}
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
