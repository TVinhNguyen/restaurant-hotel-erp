import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Tag, Divider } from "antd";

const { Title } = Typography;

export const DatPhongShow: React.FC = () => {
    const { query: queryResult } = useShow({
        resource: "reservations",
    });

    const { data, isLoading } = queryResult;
    const record = data?.data;

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

    return (
        <Show isLoading={isLoading} title="Chi tiết đặt phòng">
            <Title level={5}>Thông tin đặt phòng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã đặt phòng">
                    {record?.confirmationCode}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={statusColors[record?.status]}>
                        {statusLabels[record?.status] || record?.status}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày check-in">
                    {new Date(record?.checkInDate).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày check-out">
                    {new Date(record?.checkOutDate).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
                <Descriptions.Item label="Số người lớn">
                    {record?.numberOfAdults}
                </Descriptions.Item>
                <Descriptions.Item label="Số trẻ em">
                    {record?.numberOfChildren || 0}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Thông tin khách hàng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Họ tên">
                    {record?.guest?.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {record?.guest?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {record?.guest?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Quốc tịch">
                    {record?.guest?.nationality}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Thông tin phòng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Loại phòng">
                    {record?.roomType?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Số phòng">
                    {record?.room?.roomNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Giá phòng">
                    {record?.roomType?.basePrice?.toLocaleString("vi-VN")} VNĐ/đêm
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                    <strong style={{ color: "#3f8600", fontSize: "16px" }}>
                        {record?.totalAmount?.toLocaleString("vi-VN")} VNĐ
                    </strong>
                </Descriptions.Item>
            </Descriptions>

            {record?.specialRequests && (
                <>
                    <Divider />
                    <Title level={5}>Ghi chú đặc biệt</Title>
                    <p>{record.specialRequests}</p>
                </>
            )}
        </Show>
    );
};
