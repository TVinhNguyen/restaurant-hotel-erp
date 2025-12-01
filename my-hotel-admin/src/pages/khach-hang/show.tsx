import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Divider, Table } from "antd";

const { Title } = Typography;

export const KhachHangShow: React.FC = () => {
    const { query: queryResult } = useShow({
        resource: "guests",
    });

    const { data, isLoading } = queryResult;
    const record = data?.data;

    const reservationColumns = [
        {
            title: "Mã đặt phòng",
            dataIndex: "confirmationCode",
            key: "confirmationCode",
        },
        {
            title: "Ngày check-in",
            dataIndex: "checkInDate",
            key: "checkInDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Ngày check-out",
            dataIndex: "checkOutDate",
            key: "checkOutDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
        },
    ];

    return (
        <Show isLoading={isLoading} title="Chi tiết khách hàng">
            <Title level={5}>Thông tin cá nhân</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Họ và tên">
                    {record?.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {record?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {record?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Quốc tịch">
                    {record?.nationality || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Số CMND/CCCD" span={2}>
                    {record?.identificationNumber || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                    {record?.address || "Chưa cập nhật"}
                </Descriptions.Item>
            </Descriptions>

            {record?.notes && (
                <>
                    <Divider />
                    <Title level={5}>Ghi chú</Title>
                    <p>{record.notes}</p>
                </>
            )}

            <Divider />
            <Title level={5}>Lịch sử đặt phòng</Title>
            <Table
                dataSource={record?.reservations || []}
                columns={reservationColumns}
                rowKey="id"
                pagination={false}
            />
        </Show>
    );
};
