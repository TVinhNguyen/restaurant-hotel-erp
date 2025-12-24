import { List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Tag, Typography } from "antd";
import { useCan } from "@refinedev/core";

const { Text } = Typography;

export const LoaiPhongList: React.FC = () => {
    const { tableProps } = useTable({
        resource: "room-types",
        syncWithLocation: true,
    });

    const { data: canEdit } = useCan({ resource: "loai-phong", action: "edit" });
    const { data: canDelete } = useCan({ resource: "loai-phong", action: "delete" });

    return (
        <List title="Quản lý loại phòng">
            <Table {...tableProps} rowKey="id">
                <Table.Column 
                    title="Tên loại phòng" 
                    dataIndex="name" 
                    sorter
                    render={(value) => <Text strong>{value}</Text>}
                />
                <Table.Column
                    title="Giá phòng"
                    dataIndex="basePrice"
                    sorter
                    render={(value: string) => (
                        <Text strong style={{ color: "#52c41a" }}>
                            {parseFloat(value || "0").toLocaleString("vi-VN")} VNĐ
                        </Text>
                    )}
                />
                <Table.Column
                    title="Sức chứa"
                    key="capacity"
                    render={(_, record: any) => (
                        <Space direction="vertical" size={0}>
                            <Text>{record.maxAdults} người lớn</Text>
                            <Text type="secondary">{record.maxChildren} trẻ em</Text>
                        </Space>
                    )}
                />
                <Table.Column 
                    title="Loại giường" 
                    dataIndex="bedType"
                    render={(value) => value || <Text type="secondary">-</Text>}
                />
                <Table.Column
                    title="Số phòng"
                    dataIndex={["rooms"]}
                    render={(rooms: any[]) => (
                        <Tag color="blue">{rooms?.length || 0} phòng</Tag>
                    )}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    render={(_, record: any) => (
                        <Space>
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            {canEdit?.can && (
                                <EditButton hideText size="small" recordItemId={record.id} />
                            )}
                            {canDelete?.can && (
                                <DeleteButton hideText size="small" recordItemId={record.id} />
                            )}
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
