import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag } from "antd";
import { EyeOutlined, EditOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigation, useCan } from "@refinedev/core";

export const NhaHangList: React.FC = () => {
    const { show, edit } = useNavigation();

    const { tableProps } = useTable({
        resource: "restaurants",
        syncWithLocation: true,
    });

    // Check permissions
    const { data: canEdit } = useCan({
        resource: "nha-hang",
        action: "edit",
    });

    const { data: canCreate } = useCan({
        resource: "nha-hang",
        action: "create",
    });

    return (
        <List
            title="Danh sách nhà hàng"
            canCreate={canCreate?.can}
            createButtonProps={{
                children: "Tạo nhà hàng mới",
            }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Tên nhà hàng"
                    dataIndex="name"
                    key="name"
                    render={(text: string) => (
                        <Space>
                            <ShopOutlined style={{ color: "#1890ff" }} />
                            {text}
                        </Space>
                    )}
                />
                <Table.Column
                    title="Loại món ăn"
                    dataIndex="cuisineType"
                    key="cuisineType"
                    render={(cuisineType: string) => (
                        <Tag color="blue">{cuisineType || "Chưa xác định"}</Tag>
                    )}
                />
                <Table.Column
                    title="Vị trí"
                    dataIndex="location"
                    key="location"
                    render={(location: string) => location || "N/A"}
                />
                <Table.Column
                    title="Giờ mở cửa"
                    dataIndex="openingHours"
                    key="openingHours"
                    render={(hours: string) => hours || "N/A"}
                />
                <Table.Column
                    title="Hành động"
                    key="actions"
                    render={(_: unknown, record: { id?: string | number }) => (
                        <Space size="middle">
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => show("restaurants", String(record.id || ""))}
                            >
                                Xem
                            </Button>
                            {canEdit?.can && (
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => edit("restaurants", String(record.id || ""))}
                                >
                                    Sửa
                                </Button>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
