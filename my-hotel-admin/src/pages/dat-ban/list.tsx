import { List, useTable, DateField } from "@refinedev/antd";
import { Table, Tag, Space } from "antd";
import { useNavigation, useCan } from "@refinedev/core";

export const DatBanList: React.FC = () => {
    const { tableProps } = useTable({
        resource: "restaurants/bookings",
        syncWithLocation: true,
    });

    const { show, edit } = useNavigation();
    const { data: canEdit } = useCan({
        resource: "dat-ban",
        action: "edit",
    });

    const statusColors: Record<string, string> = {
        pending: "orange",
        confirmed: "blue",
        seated: "green",
        completed: "default",
        cancelled: "red",
        no_show: "volcano",
    };

    const statusLabels: Record<string, string> = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        seated: "Đã ngồi",
        completed: "Hoàn thành",
        cancelled: "Đã hủy",
        no_show: "Không đến",
    };

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Nhà hàng"
                    dataIndex={["restaurant", "name"]}
                    key="restaurantName"
                />
                <Table.Column
                    title="Khách hàng"
                    dataIndex={["guest", "fullName"]}
                    key="guestName"
                    render={(_, record: { guest?: { fullName: string }; contactName?: string }) => 
                        record.guest?.fullName || record.contactName || "N/A"
                    }
                />
                <Table.Column
                    title="Số điện thoại"
                    dataIndex="contactPhone"
                    key="contactPhone"
                    render={(_, record: { contactPhone?: string; guest?: { phone?: string } }) => 
                        record.contactPhone || record.guest?.phone || "N/A"
                    }
                />
                <Table.Column
                    title="Ngày đặt"
                    dataIndex="bookingDate"
                    key="bookingDate"
                    render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
                />
                <Table.Column
                    title="Giờ đặt"
                    dataIndex="bookingTime"
                    key="bookingTime"
                />
                <Table.Column
                    title="Số người"
                    dataIndex="pax"
                    key="pax"
                />
                <Table.Column
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(value) => (
                        <Tag color={statusColors[value]}>
                            {statusLabels[value] || value}
                        </Tag>
                    )}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    render={(_, record: { id: string }) => (
                        <Space>
                            <a onClick={() => show("dat-ban", record.id)}>Xem</a>
                            {canEdit && (
                                <a onClick={() => edit("dat-ban", record.id)}>Sửa</a>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
