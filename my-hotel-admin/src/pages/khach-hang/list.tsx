import { useTable, List, DateField } from "@refinedev/antd";
import { Table, Space, Button } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigation, useCan } from "@refinedev/core";

export const KhachHangList: React.FC = () => {
    const { show, edit } = useNavigation();
    const { tableProps } = useTable({
        resource: "guests",
        syncWithLocation: true,
    });

    // Kiểm tra permissions
    const { data: canEdit } = useCan({
        resource: "khach-hang",
        action: "edit",
    });

    const { data: canCreate } = useCan({
        resource: "khach-hang",
        action: "create",
    });

    return (
        <List
            title="Danh sách khách hàng"
            canCreate={canCreate?.can}
            createButtonProps={{
                children: "Thêm khách hàng mới",
            }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Họ và tên"
                    dataIndex="fullName"
                    key="fullName"
                />
                <Table.Column
                    title="Email"
                    dataIndex="email"
                    key="email"
                />
                <Table.Column
                    title="Số điện thoại"
                    dataIndex="phone"
                    key="phone"
                />
                <Table.Column
                    title="Quốc tịch"
                    dataIndex="nationality"
                    key="nationality"
                />
                <Table.Column
                    title="Ngày tạo"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(value) => (
                        <DateField value={value} format="DD/MM/YYYY" />
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
                                onClick={() => show("guests", record.id)}
                            >
                                Xem
                            </Button>
                            {canEdit?.can && (
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => edit("guests", record.id)}
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
