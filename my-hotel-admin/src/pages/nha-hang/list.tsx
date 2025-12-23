import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Card, Row, Col, Statistic, Tooltip } from "antd";
import { 
    EyeOutlined, 
    EditOutlined, 
    ShopOutlined, 
    DeleteOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { useNavigation, useCan, useDelete } from "@refinedev/core";

interface RestaurantRecord {
    id: string;
    name: string;
    cuisineType?: string;
    location?: string;
    openingHours?: string;
    description?: string;
}

const cuisineLabels: Record<string, string> = {
    Vietnamese: "Việt Nam",
    Chinese: "Trung Quốc",
    Japanese: "Nhật Bản",
    Korean: "Hàn Quốc",
    Thai: "Thái Lan",
    Italian: "Ý",
    French: "Pháp",
    Seafood: "Hải sản",
    BBQ: "BBQ",
    Buffet: "Buffet",
    Fastfood: "Fastfood",
    Other: "Khác",
};

const cuisineColors: Record<string, string> = {
    Vietnamese: "green",
    Chinese: "red",
    Japanese: "volcano",
    Korean: "orange",
    Thai: "gold",
    Italian: "blue",
    French: "purple",
    Seafood: "cyan",
    BBQ: "magenta",
    Buffet: "geekblue",
    Fastfood: "lime",
    Other: "default",
};

export const NhaHangList: React.FC = () => {
    const { show, edit, create } = useNavigation();
    const { mutate: deleteOne } = useDelete();

    const { tableProps, tableQuery } = useTable<RestaurantRecord>({
        resource: "restaurants",
        syncWithLocation: true,
    });

    const { data: canEdit } = useCan({ resource: "nha-hang", action: "edit" });
    const { data: canCreate } = useCan({ resource: "nha-hang", action: "create" });
    const { data: canDelete } = useCan({ resource: "nha-hang", action: "delete" });

    const restaurants = tableQuery.data?.data || [];
    const totalRestaurants = restaurants.length;

    const handleDelete = (id: string) => {
        deleteOne({
            resource: "restaurants",
            id,
            mutationMode: "pessimistic",
        }, {
            onSuccess: () => {
                // Refetch handled automatically
            },
        });
    };

    return (
        <List
            title="Quản lý nhà hàng"
            canCreate={canCreate?.can}
            createButtonProps={{
                children: "Thêm nhà hàng",
                icon: <ShopOutlined />,
                onClick: () => create("nha-hang"),
            }}
        >
            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card size="small" style={{ borderLeft: "4px solid #1890ff" }}>
                        <Statistic
                            title="Tổng nhà hàng"
                            value={totalRestaurants}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Table {...tableProps} rowKey="id" size="middle">
                <Table.Column
                    title="Tên nhà hàng"
                    dataIndex="name"
                    key="name"
                    render={(text: string, record: RestaurantRecord) => (
                        <Space>
                            <ShopOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                            <div>
                                <div style={{ fontWeight: 600 }}>{text}</div>
                                {record.description && (
                                    <div style={{ fontSize: 12, color: "#666", maxWidth: 300 }}>
                                        {record.description.length > 50 
                                            ? `${record.description.substring(0, 50)}...` 
                                            : record.description}
                                    </div>
                                )}
                            </div>
                        </Space>
                    )}
                    sorter
                />
                <Table.Column
                    title="Loại món ăn"
                    dataIndex="cuisineType"
                    key="cuisineType"
                    render={(cuisineType: string) => (
                        <Tag color={cuisineColors[cuisineType] || "default"}>
                            {cuisineLabels[cuisineType] || cuisineType || "Chưa xác định"}
                        </Tag>
                    )}
                    filters={Object.entries(cuisineLabels).map(([value, text]) => ({
                        text,
                        value,
                    }))}
                />
                <Table.Column
                    title="Vị trí"
                    dataIndex="location"
                    key="location"
                    render={(location: string) => (
                        location ? (
                            <Space>
                                <EnvironmentOutlined style={{ color: "#52c41a" }} />
                                {location}
                            </Space>
                        ) : (
                            <span style={{ color: "#999" }}>Chưa cập nhật</span>
                        )
                    )}
                />
                <Table.Column
                    title="Giờ mở cửa"
                    dataIndex="openingHours"
                    key="openingHours"
                    render={(hours: string) => (
                        hours ? (
                            <Space>
                                <ClockCircleOutlined style={{ color: "#faad14" }} />
                                {hours}
                            </Space>
                        ) : (
                            <span style={{ color: "#999" }}>Chưa cập nhật</span>
                        )
                    )}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    width={200}
                    render={(_: unknown, record: RestaurantRecord) => (
                        <Space size="small">
                            <Tooltip title="Xem chi tiết">
                                <Button
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => show("nha-hang", record.id)}
                                />
                            </Tooltip>
                            {canEdit?.can && (
                                <Tooltip title="Chỉnh sửa">
                                    <Button
                                        size="small"
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => edit("nha-hang", record.id)}
                                    />
                                </Tooltip>
                            )}
                            {canDelete?.can && (
                                <Tooltip title="Xóa">
                                    <Button
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(record.id)}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
