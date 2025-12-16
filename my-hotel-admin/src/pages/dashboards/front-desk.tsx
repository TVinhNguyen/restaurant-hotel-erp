import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import {
    UserOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { useCustom } from "@refinedev/core";

const { Title } = Typography;

export const DashboardFrontDesk: React.FC = () => {
    // Fetch dashboard statistics
    const statsQuery = useCustom<any>({
        url: "/reservations/stats",
        method: "get",
        config: {
            headers: {
                "Content-Type": "application/json",
            },
        },
    });

    const todayQuery = useCustom<any>({
        url: "/reservations",
        method: "get",
        config: {
            query: {
                checkInDate: new Date().toISOString().split('T')[0],
                limit: 5,
            },
        },
    });

    const stats = (statsQuery as any)?.data?.data || {};
    const todayReservations = (todayQuery as any)?.data?.data || [];
    const isLoadingStats = (statsQuery as any)?.isFetching || false;
    const isLoadingReservations = (todayQuery as any)?.isFetching || false;

    const columns = [
        {
            title: "Mã đặt phòng",
            dataIndex: "confirmationCode",
            key: "confirmationCode",
        },
        {
            title: "Tên khách",
            dataIndex: ["guest", "fullName"],
            key: "guestName",
        },
        {
            title: "Loại phòng",
            dataIndex: ["roomType", "name"],
            key: "roomType",
        },
        {
            title: "Check-in",
            dataIndex: "checkInDate",
            key: "checkInDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Check-out",
            dataIndex: "checkOutDate",
            key: "checkOutDate",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const statusMap: Record<string, string> = {
                    pending: "Chờ xác nhận",
                    confirmed: "Đã xác nhận",
                    checked_in: "Đã check-in",
                    checked_out: "Đã check-out",
                    cancelled: "Đã hủy",
                };
                return statusMap[status] || status;
            },
        },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>🏨 Tổng quan Lễ tân</Title>

            <Row gutter={16} style={{ marginBottom: "24px" }}>
                <Col span={6}>
                    <Card loading={isLoadingStats}>
                        <Statistic
                            title="Đặt phòng hôm nay"
                            value={stats?.todayReservations || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoadingStats}>
                        <Statistic
                            title="Phòng trống"
                            value={stats?.availableRooms || 0}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoadingStats}>
                        <Statistic
                            title="Check-in hôm nay"
                            value={stats?.todayCheckIns || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoadingStats}>
                        <Statistic
                            title="Check-out hôm nay"
                            value={stats?.todayCheckOuts || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Đặt phòng hôm nay" style={{ marginBottom: "24px" }}>
                <Table
                    dataSource={todayReservations}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    loading={isLoadingReservations}
                />
            </Card>
        </div>
    );
};
