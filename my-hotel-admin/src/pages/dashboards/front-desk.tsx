import { Card, Col, Row, Statistic, Table, Typography, Button, Space, Tag } from "antd";
import {
    UserOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    LoginOutlined,
    LogoutOutlined,
    PlusOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { useList, useNavigation } from "@refinedev/core";
import { useEffect, useState } from "react";

const { Title } = Typography;

export const DashboardFrontDesk: React.FC = () => {
    const { push } = useNavigation();
    const [userPermissions, setUserPermissions] = useState<string[]>([]);

    useEffect(() => {
        const userStr = localStorage.getItem("refine-user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserPermissions(user.permissions || []);
        }
    }, []);

    // Fetch reservations
    const { data: reservationsData, isLoading: isLoadingReservations } = useList({
        resource: "reservations",
        pagination: { pageSize: 100 },
    });

    // Fetch rooms
    const { data: roomsData, isLoading: isLoadingRooms } = useList({
        resource: "rooms",
        pagination: { pageSize: 100 },
    });

    const reservations = reservationsData?.data || [];
    const rooms = roomsData?.data || [];

    const today = new Date().toISOString().split('T')[0];
    
    const todayCheckIns = reservations.filter((r: any) => 
        r.checkInDate?.split('T')[0] === today && 
        (r.status === 'confirmed' || r.status === 'pending')
    );
    
    const todayCheckOuts = reservations.filter((r: any) => 
        r.checkOutDate?.split('T')[0] === today && 
        r.status === 'checked_in'
    );

    const availableRooms = rooms.filter((r: any) => r.status === 'available');

    const hasPermission = (perm: string) => userPermissions.includes(perm);

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
            title: "Phòng",
            dataIndex: ["room", "roomNumber"],
            key: "roomNumber",
        },
        {
            title: "Check-in",
            dataIndex: "checkInDate",
            key: "checkInDate",
            render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "-",
        },
        {
            title: "Check-out",
            dataIndex: "checkOutDate",
            key: "checkOutDate",
            render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "-",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>🏨 Tổng quan Lễ tân</Title>

            {/* Quick Actions */}
            <Card style={{ marginBottom: 24 }}>
                <Title level={4} style={{ marginBottom: 16 }}>⚡ Thao tác nhanh</Title>
                <Space wrap size="middle">
                    {hasPermission("reservation.create") && (
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => push("/dat-phong/tao-moi")}
                        >
                            Tạo đặt phòng mới
                        </Button>
                    )}
                    {hasPermission("reservation.checkin") && (
                        <Button 
                            icon={<LoginOutlined />}
                            onClick={() => push("/check-in")}
                            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "#fff" }}
                        >
                            Check-in
                        </Button>
                    )}
                    {hasPermission("reservation.checkout") && (
                        <Button 
                            icon={<LogoutOutlined />}
                            onClick={() => push("/check-out")}
                            style={{ backgroundColor: "#faad14", borderColor: "#faad14", color: "#fff" }}
                        >
                            Check-out
                        </Button>
                    )}
                    {hasPermission("reservation.view") && (
                        <Button 
                            icon={<CalendarOutlined />}
                            onClick={() => push("/dat-phong")}
                        >
                            Xem đặt phòng
                        </Button>
                    )}
                </Space>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoadingReservations}>
                        <Statistic
                            title="Check-in hôm nay"
                            value={todayCheckIns.length}
                            prefix={<LoginOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoadingReservations}>
                        <Statistic
                            title="Check-out hôm nay"
                            value={todayCheckOuts.length}
                            prefix={<LogoutOutlined />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoadingRooms}>
                        <Statistic
                            title="Phòng trống"
                            value={availableRooms.length}
                            suffix={`/ ${rooms.length}`}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={isLoadingReservations}>
                        <Statistic
                            title="Đang lưu trú"
                            value={reservations.filter((r: any) => r.status === 'checked_in').length}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Today's Check-ins */}
            <Card 
                title={`📥 Check-in hôm nay (${todayCheckIns.length})`} 
                style={{ marginBottom: "24px" }}
                extra={hasPermission("reservation.checkin") && todayCheckIns.length > 0 && (
                    <Button type="primary" onClick={() => push("/check-in")}>
                        Đi đến Check-in
                    </Button>
                )}
            >
                <Table
                    dataSource={todayCheckIns}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    loading={isLoadingReservations}
                    locale={{ emptyText: "Không có check-in hôm nay" }}
                />
            </Card>

            {/* Today's Check-outs */}
            <Card 
                title={`📤 Check-out hôm nay (${todayCheckOuts.length})`}
                extra={hasPermission("reservation.checkout") && todayCheckOuts.length > 0 && (
                    <Button type="primary" onClick={() => push("/check-out")}>
                        Đi đến Check-out
                    </Button>
                )}
            >
                <Table
                    dataSource={todayCheckOuts}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    loading={isLoadingReservations}
                    locale={{ emptyText: "Không có check-out hôm nay" }}
                />
            </Card>
        </div>
    );
};
