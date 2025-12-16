import { Card, Col, Row, Statistic, Typography } from "antd";
import {
    UserOutlined,
    HomeOutlined,
    DollarOutlined,
    TeamOutlined
} from "@ant-design/icons";
import { useCustom } from "@refinedev/core";

const { Title } = Typography;

export const DashboardAdmin: React.FC = () => {
    const statsQuery = useCustom<any>({
        url: "/reports/dashboard",
        method: "get",
        config: {
            headers: {
                "Content-Type": "application/json",
            },
        },
    });

    const stats = (statsQuery as any)?.data?.data || {};
    const isLoading = (statsQuery as any)?.isFetching || false;

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>👨‍💼 Tổng quan Quản trị</Title>

            <Row gutter={16} style={{ marginBottom: "24px" }}>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Tổng doanh thu tháng này"
                            value={stats?.monthlyRevenue || 0}
                            prefix={<DollarOutlined />}
                            suffix="VNĐ"
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Tổng số phòng"
                            value={stats?.totalRooms || 0}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Nhân viên"
                            value={stats?.totalEmployees || 0}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Khách hàng"
                            value={stats?.totalGuests || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Tỷ lệ lấp đầy phòng" loading={isLoading} style={{ marginBottom: "24px" }}>
                        <Statistic
                            value={stats?.occupancyRate || 0}
                            suffix="%"
                            valueStyle={{ color: "#1890ff", fontSize: "36px" }}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Doanh thu trung bình mỗi phòng" loading={isLoading} style={{ marginBottom: "24px" }}>
                        <Statistic
                            value={stats?.averageRoomRevenue || 0}
                            suffix="VNĐ"
                            valueStyle={{ color: "#3f8600", fontSize: "36px" }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
