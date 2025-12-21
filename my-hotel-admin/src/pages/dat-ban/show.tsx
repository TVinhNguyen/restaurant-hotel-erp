import { Show, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Tag } from "antd";

const { Title } = Typography;

export const DatBanShow: React.FC = () => {
    const { query: queryResult } = useShow({
        resource: "restaurants/bookings",
    });

    const { data, isLoading } = queryResult;
    const record = data?.data;

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
        <Show isLoading={isLoading} title="Chi tiết đặt bàn">
            <Title level={5}>Thông tin đặt bàn</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Nhà hàng" span={2}>
                    {record?.restaurant?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                    <DateField value={record?.bookingDate} format="DD/MM/YYYY" />
                </Descriptions.Item>
                <Descriptions.Item label="Giờ đặt">
                    {record?.bookingTime}
                </Descriptions.Item>
                <Descriptions.Item label="Số người">
                    {record?.pax}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian (phút)">
                    {record?.durationMinutes || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={2}>
                    <Tag color={statusColors[record?.status]}>
                        {statusLabels[record?.status] || record?.status}
                    </Tag>
                </Descriptions.Item>
                {record?.assignedTable && (
                    <Descriptions.Item label="Bàn được giao" span={2}>
                        Bàn số {record.assignedTable.tableNumber} - {record.assignedTable.capacity} chỗ
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Title level={5} style={{ marginTop: 24 }}>Thông tin liên hệ</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Tên khách hàng">
                    {record?.guest?.fullName || record?.contactName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {record?.contactPhone || record?.guest?.phone || "N/A"}
                </Descriptions.Item>
                {record?.guest?.email && (
                    <Descriptions.Item label="Email" span={2}>
                        {record.guest.email}
                    </Descriptions.Item>
                )}
            </Descriptions>

            {(record?.notes || record?.specialRequests) && (
                <>
                    <Title level={5} style={{ marginTop: 24 }}>Ghi chú</Title>
                    <Descriptions bordered column={1}>
                        {record?.notes && (
                            <Descriptions.Item label="Ghi chú">
                                {record.notes}
                            </Descriptions.Item>
                        )}
                        {record?.specialRequests && (
                            <Descriptions.Item label="Yêu cầu đặc biệt">
                                {record.specialRequests}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </>
            )}
        </Show>
    );
};
