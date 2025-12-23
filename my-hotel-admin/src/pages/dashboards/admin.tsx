import { Card, Col, Row, Statistic, Typography, Table, Tag, Progress, Badge, Space, theme } from "antd";
import {
    UserOutlined,
    HomeOutlined,
    TeamOutlined,
    CalendarOutlined,
    DollarOutlined,
    RiseOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { Pie, Column } from "@ant-design/charts";
import { USER_KEY } from "../../authProvider";

const { useToken } = theme;

const { Title, Text } = Typography;

interface DashboardStats {
    totalRooms: number;
    totalEmployees: number;
    totalGuests: number;
    totalReservations: number;
    checkedInCount: number;
    occupancyRate: number;
    totalRevenue: number;
    pendingCount: number;
    confirmedCount: number;
    checkedOutCount: number;
    cancelledCount: number;
}

interface RecentReservation {
    id: string;
    guestName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    status: string;
    totalAmount: number;
}

interface RoomStatus {
    type: string;
    value: number;
}

// Gradient card styles
const cardStyles = {
    rooms: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        border: "none",
    },
    employees: {
        background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        borderRadius: "16px",
        border: "none",
    },
    guests: {
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        borderRadius: "16px",
        border: "none",
    },
    reservations: {
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        borderRadius: "16px",
        border: "none",
    },
    revenue: {
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        borderRadius: "16px",
        border: "none",
    },
    occupancy: {
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        borderRadius: "16px",
        border: "none",
    },
};

const StatCard: React.FC<{
    title: string;
    value: number | string;
    prefix?: React.ReactNode;
    suffix?: string;
    loading?: boolean;
    style?: React.CSSProperties;
    trend?: number;
}> = ({ title, value, prefix, suffix, loading, style, trend }) => (
    <Card
        loading={loading}
        style={{ ...style, minHeight: "140px" }}
        bodyStyle={{ padding: "24px" }}
        hoverable
    >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                    {title}
                </Text>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}>
                        {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
                    </span>
                    {suffix && <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px" }}>{suffix}</span>}
                </div>
                {trend !== undefined && (
                    <div style={{ marginTop: "8px" }}>
                        <Tag color={trend >= 0 ? "green" : "red"} style={{ borderRadius: "12px" }}>
                            <RiseOutlined rotate={trend >= 0 ? 0 : 180} /> {Math.abs(trend)}%
                        </Tag>
                    </div>
                )}
            </div>
            <div style={{ 
                background: "rgba(255,255,255,0.2)", 
                borderRadius: "12px", 
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {prefix && <span style={{ fontSize: "28px", color: "#fff" }}>{prefix}</span>}
            </div>
        </div>
    </Card>
);

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: "orange",
        confirmed: "blue",
        checked_in: "green",
        checked_out: "purple",
        cancelled: "red",
        no_show: "default",
    };
    return colors[status] || "default";
};

const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        checked_in: "Đang ở",
        checked_out: "Đã trả phòng",
        cancelled: "Đã hủy",
        no_show: "Không đến",
    };
    return texts[status] || status;
};

export const DashboardAdmin: React.FC = () => {
    const { token } = useToken();
    const isDarkMode = token.colorBgContainer !== '#ffffff';
    
    const [stats, setStats] = useState<DashboardStats>({
        totalRooms: 0,
        totalEmployees: 0,
        totalGuests: 0,
        totalReservations: 0,
        checkedInCount: 0,
        occupancyRate: 0,
        totalRevenue: 0,
        pendingCount: 0,
        confirmedCount: 0,
        checkedOutCount: 0,
        cancelledCount: 0,
    });
    const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWithAuth = async (url: string, token: string) => {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    };

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
                
                const employeeData = await fetchWithAuth(
                    `${API_URL}/employees/get-employee-by-user-id/${userId}`, token
                );
                
                const rolesData = await fetchWithAuth(
                    `${API_URL}/employee-roles?employeeId=${employeeData.id}`, token
                );

                if (!rolesData?.length) {
                    setLoading(false);
                    return;
                }

                const propId = rolesData[0].propertyId;

                // Fetch all statistics in parallel
                const [
                    roomsData,
                    employeesData,
                    guestsData,
                    reservationsData,
                    checkedInData,
                    pendingData,
                    confirmedData,
                    checkedOutData,
                    cancelledData,
                ] = await Promise.all([
                    fetchWithAuth(`${API_URL}/rooms?propertyId=${propId}`, token),
                    fetchWithAuth(`${API_URL}/employees`, token),
                    fetchWithAuth(`${API_URL}/guests`, token),
                    fetchWithAuth(`${API_URL}/reservations?propertyId=${propId}&limit=100`, token),
                    fetchWithAuth(`${API_URL}/reservations?propertyId=${propId}&status=checked_in`, token),
                    fetchWithAuth(`${API_URL}/reservations?propertyId=${propId}&status=pending`, token),
                    fetchWithAuth(`${API_URL}/reservations?propertyId=${propId}&status=confirmed`, token),
                    fetchWithAuth(`${API_URL}/reservations?propertyId=${propId}&status=checked_out`, token),
                    fetchWithAuth(`${API_URL}/reservations?propertyId=${propId}&status=cancelled`, token),
                ]);

                const totalRooms = roomsData.total || roomsData.data?.length || 0;
                const totalEmployees = employeesData.total || employeesData.data?.length || 0;
                const totalGuests = Array.isArray(guestsData) ? guestsData.length : (guestsData.total || 0);
                const totalReservations = reservationsData.total || 0;
                const checkedInCount = checkedInData.total || 0;
                const pendingCount = pendingData.total || 0;
                const confirmedCount = confirmedData.total || 0;
                const checkedOutCount = checkedOutData.total || 0;
                const cancelledCount = cancelledData.total || 0;

                // Calculate revenue from reservations
                const reservationsList = reservationsData.data || [];
                const totalRevenue = reservationsList.reduce(
                    (sum: number, r: { totalAmount?: number }) => sum + (Number(r.totalAmount) || 0), 0
                );

                // Get recent reservations
                const recent = reservationsList
                    .slice(0, 5)
                    .map((r: {
                        id: string;
                        guest?: { fullName?: string };
                        contactName?: string;
                        assignedRoom?: { number?: string };
                        checkIn: string;
                        checkOut: string;
                        status: string;
                        totalAmount?: number;
                    }) => ({
                        id: r.id,
                        guestName: r.guest?.fullName || r.contactName || "N/A",
                        roomNumber: r.assignedRoom?.number || "Chưa gán",
                        checkIn: r.checkIn,
                        checkOut: r.checkOut,
                        status: r.status,
                        totalAmount: r.totalAmount || 0,
                    }));

                setRecentReservations(recent);
                setStats({
                    totalRooms,
                    totalEmployees,
                    totalGuests,
                    totalReservations,
                    checkedInCount,
                    occupancyRate: totalRooms > 0 ? Math.round((checkedInCount / totalRooms) * 100) : 0,
                    totalRevenue,
                    pendingCount,
                    confirmedCount,
                    checkedOutCount,
                    cancelledCount,
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // Chart data
    const reservationStatusData = useMemo(() => [
        { type: "Chờ xác nhận", value: stats.pendingCount },
        { type: "Đã xác nhận", value: stats.confirmedCount },
        { type: "Đang ở", value: stats.checkedInCount },
        { type: "Đã trả phòng", value: stats.checkedOutCount },
        { type: "Đã hủy", value: stats.cancelledCount },
    ].filter(item => item.value > 0), [stats]);

    const roomStatusData: RoomStatus[] = useMemo(() => [
        { type: "Đang có khách", value: stats.checkedInCount },
        { type: "Phòng trống", value: Math.max(0, stats.totalRooms - stats.checkedInCount) },
    ], [stats]);

    const pieConfig = {
        data: reservationStatusData,
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        innerRadius: 0.6,
        label: {
            text: "value",
            style: { fontWeight: "bold", fill: token.colorText },
        },
        legend: {
            position: "bottom" as const,
            itemName: { style: { fill: token.colorText } },
        },
        color: ["#faad14", "#1890ff", "#52c41a", "#722ed1", "#ff4d4f"],
        statistic: {
            title: {
                content: "Tổng",
                style: { fontSize: "14px", color: token.colorText },
            },
            content: {
                content: stats.totalReservations.toString(),
                style: { fontSize: "24px", fontWeight: "bold", color: token.colorText },
            },
        },
        theme: isDarkMode ? "classicDark" : "classic",
    };

    const columnConfig = {
        data: roomStatusData,
        xField: "type",
        yField: "value",
        color: (datum: RoomStatus) => datum.type === "Đang có khách" ? "#52c41a" : "#1890ff",
        label: {
            text: (datum: RoomStatus) => datum.value.toString(),
            position: "middle" as const,
            style: { fill: "#fff", fontWeight: "bold" },
        },
        columnStyle: {
            radius: [8, 8, 0, 0],
        },
        theme: isDarkMode ? "classicDark" : "classic",
        axis: {
            x: { labelFill: token.colorText, title: false },
            y: { labelFill: token.colorText, title: false, gridStroke: token.colorBorderSecondary },
        },
    };

    const recentColumns = [
        {
            title: "Khách hàng",
            dataIndex: "guestName",
            key: "guestName",
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: "Phòng",
            dataIndex: "roomNumber",
            key: "roomNumber",
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Nhận phòng",
            dataIndex: "checkIn",
            key: "checkIn",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Trả phòng",
            dataIndex: "checkOut",
            key: "checkOut",
            render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (amount: number) => (
                <Text strong style={{ color: "#52c41a" }}>
                    {amount.toLocaleString("vi-VN")} ₫
                </Text>
            ),
        },
    ];

    return (
        <div style={{ padding: "24px", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <Title level={2} style={{ margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ 
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Dashboard Quản trị
                    </span>
                </Title>
                <Text type="secondary">Tổng quan hoạt động khách sạn</Text>
            </div>

            {/* Stats Cards Row 1 */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Tổng số phòng"
                        value={stats.totalRooms}
                        prefix={<HomeOutlined />}
                        loading={loading}
                        style={cardStyles.rooms}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Nhân viên"
                        value={stats.totalEmployees}
                        prefix={<TeamOutlined />}
                        loading={loading}
                        style={cardStyles.employees}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Khách hàng"
                        value={stats.totalGuests}
                        prefix={<UserOutlined />}
                        loading={loading}
                        style={cardStyles.guests}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Tổng đặt phòng"
                        value={stats.totalReservations}
                        prefix={<CalendarOutlined />}
                        loading={loading}
                        style={cardStyles.reservations}
                    />
                </Col>
            </Row>

            {/* Stats Cards Row 2 */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={12}>
                    <StatCard
                        title="Tổng doanh thu"
                        value={stats.totalRevenue}
                        prefix={<DollarOutlined />}
                        suffix="₫"
                        loading={loading}
                        style={cardStyles.revenue}
                    />
                </Col>
                <Col xs={24} sm={12}>
                    <Card
                        loading={loading}
                        style={{ 
                            background: isDarkMode 
                                ? "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)" 
                                : "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                            borderRadius: "16px",
                            border: "none",
                            minHeight: "140px" 
                        }}
                        styles={{ body: { padding: "24px" } }}
                        hoverable
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <Text style={{ color: isDarkMode ? "rgba(255,255,255,0.85)" : "#333", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                                    Tỷ lệ lấp đầy phòng
                                </Text>
                                <Progress
                                    percent={stats.occupancyRate}
                                    strokeColor={{
                                        "0%": "#667eea",
                                        "100%": "#764ba2",
                                    }}
                                    trailColor={isDarkMode ? "rgba(255,255,255,0.2)" : undefined}
                                    format={(percent) => (
                                        <span style={{ color: isDarkMode ? "#fff" : "#333", fontWeight: 700 }}>{percent}%</span>
                                    )}
                                    size={[200, 20]}
                                />
                                <Text style={{ color: isDarkMode ? "rgba(255,255,255,0.65)" : "#666", fontSize: "12px", marginTop: "8px", display: "block" }}>
                                    {stats.checkedInCount} / {stats.totalRooms} phòng đang có khách
                                </Text>
                            </div>
                            <div style={{ 
                                background: isDarkMode ? "rgba(102, 126, 234, 0.3)" : "rgba(102, 126, 234, 0.2)", 
                                borderRadius: "12px", 
                                padding: "12px"
                            }}>
                                <CheckCircleOutlined style={{ fontSize: "28px", color: "#667eea" }} />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Quick Status Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={12} sm={6}>
                    <Card hoverable style={{ borderRadius: "12px", borderLeft: "4px solid #faad14" }}>
                        <Statistic
                            title={<><ClockCircleOutlined /> Chờ xác nhận</>}
                            value={stats.pendingCount}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card hoverable style={{ borderRadius: "12px", borderLeft: "4px solid #1890ff" }}>
                        <Statistic
                            title={<><CheckCircleOutlined /> Đã xác nhận</>}
                            value={stats.confirmedCount}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card hoverable style={{ borderRadius: "12px", borderLeft: "4px solid #52c41a" }}>
                        <Statistic
                            title={<><CheckCircleOutlined /> Đang ở</>}
                            value={stats.checkedInCount}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card hoverable style={{ borderRadius: "12px", borderLeft: "4px solid #ff4d4f" }}>
                        <Statistic
                            title={<><CloseCircleOutlined /> Đã hủy</>}
                            value={stats.cancelledCount}
                            valueStyle={{ color: "#ff4d4f" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <CalendarOutlined style={{ color: "#667eea" }} />
                                <span>Trạng thái đặt phòng</span>
                            </Space>
                        }
                        loading={loading}
                        style={{ borderRadius: "16px", height: "100%" }}
                        bodyStyle={{ height: "320px" }}
                    >
                        {reservationStatusData.length > 0 ? (
                            <Pie {...pieConfig} />
                        ) : (
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "center", 
                                alignItems: "center", 
                                height: "100%",
                                color: "#999"
                            }}>
                                <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                                Chưa có dữ liệu
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <HomeOutlined style={{ color: "#52c41a" }} />
                                <span>Tình trạng phòng</span>
                            </Space>
                        }
                        loading={loading}
                        style={{ borderRadius: "16px", height: "100%" }}
                        bodyStyle={{ height: "320px" }}
                    >
                        <Column {...columnConfig} />
                    </Card>
                </Col>
            </Row>

            {/* Recent Reservations */}
            <Card
                title={
                    <Space>
                        <CalendarOutlined style={{ color: "#1890ff" }} />
                        <span>Đặt phòng gần đây</span>
                        <Badge count={recentReservations.length} style={{ backgroundColor: "#52c41a" }} />
                    </Space>
                }
                loading={loading}
                style={{ borderRadius: "16px" }}
            >
                <Table
                    dataSource={recentReservations}
                    columns={recentColumns}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    locale={{ emptyText: "Chưa có đặt phòng nào" }}
                />
            </Card>
        </div>
    );
};
