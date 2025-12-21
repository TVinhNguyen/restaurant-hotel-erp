import { Card, Col, Row, Statistic, Typography } from "antd";
import {
    UserOutlined,
    HomeOutlined,
    TeamOutlined,
    CalendarOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { USER_KEY } from "../../authProvider";

const { Title } = Typography;

interface DashboardStats {
    totalRooms: number;
    totalEmployees: number;
    totalGuests: number;
    totalReservations: number;
    checkedInCount: number;
    occupancyRate: number;
}

export const DashboardAdmin: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalRooms: 0,
        totalEmployees: 0,
        totalGuests: 0,
        totalReservations: 0,
        checkedInCount: 0,
        occupancyRate: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const userStr = localStorage.getItem(USER_KEY);
                const token = localStorage.getItem("refine-auth");
                const API_URL = import.meta.env.VITE_API_URL;

                if (!userStr || !token) {
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userStr);
                const userId = user.id;
                
                // Fetch employee data
                const employeeResponse = await fetch(
                    `${API_URL}/employees/get-employee-by-user-id/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                
                if (!employeeResponse.ok) {
                    setLoading(false);
                    return;
                }

                const employeeData = await employeeResponse.json();
                const employeeId = employeeData.id;
                
                // Fetch employee roles để lấy propertyId
                const rolesResponse = await fetch(
                    `${API_URL}/employee-roles?employeeId=${employeeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                
                if (!rolesResponse.ok) {
                    setLoading(false);
                    return;
                }

                const rolesData = await rolesResponse.json();
                if (!rolesData || rolesData.length === 0) {
                    setLoading(false);
                    return;
                }

                const propId = rolesData[0].propertyId;

                // Fetch all statistics
                const [roomsRes, employeesRes, guestsRes, reservationsRes, checkedInRes] = await Promise.all([
                    fetch(`${API_URL}/rooms?propertyId=${propId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/employees`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/guests`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/reservations?propertyId=${propId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/reservations?propertyId=${propId}&status=checked_in`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const [roomsData, employeesData, guestsData, reservationsData, checkedInData] = await Promise.all([
                    roomsRes.json(),
                    employeesRes.json(),
                    guestsRes.json(),
                    reservationsRes.json(),
                    checkedInRes.json(),
                ]);

                const totalRooms = roomsData.total || 0;
                const totalEmployees = employeesData.total || 0;
                const totalGuests = Array.isArray(guestsData) ? guestsData.length : (guestsData.total || 0);
                const totalReservations = reservationsData.total || 0;
                const checkedInCount = checkedInData.total || 0;
                const occupancyRate = totalRooms > 0 ? Math.round((checkedInCount / totalRooms) * 100) : 0;

                setStats({
                    totalRooms,
                    totalEmployees,
                    totalGuests,
                    totalReservations,
                    checkedInCount,
                    occupancyRate,
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>👨‍💼 Tổng quan Quản trị</Title>

            <Row gutter={16} style={{ marginBottom: "24px" }}>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Tổng số phòng"
                            value={stats.totalRooms}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Nhân viên"
                            value={stats.totalEmployees}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Khách hàng"
                            value={stats.totalGuests}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Tổng đặt phòng"
                            value={stats.totalReservations}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Tỷ lệ lấp đầy phòng" loading={loading} style={{ marginBottom: "24px" }}>
                        <Statistic
                            value={stats.occupancyRate}
                            suffix="%"
                            valueStyle={{ color: "#1890ff", fontSize: "36px" }}
                        />
                        <Typography.Text type="secondary">
                            {stats.checkedInCount} / {stats.totalRooms} phòng đang có khách
                        </Typography.Text>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Phòng đang có khách (Checked In)" loading={loading} style={{ marginBottom: "24px" }}>
                        <Statistic
                            value={stats.checkedInCount}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#3f8600", fontSize: "36px" }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
