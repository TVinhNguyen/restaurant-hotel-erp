import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import {
    UserOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { useCustom } from "@refinedev/core";
import { useEffect, useState } from "react";

const { Title } = Typography;

interface DashboardStats {
    todayReservations?: number;
    availableRooms?: number;
    todayCheckIns?: number;
    todayCheckOuts?: number;
}

export const DashboardFrontDesk: React.FC = () => {

    const [stats1, setStats] = useState<DashboardStats>({});

    // Fetch dashboard statistics
    // const statsQuery = useCustom<any>({
    //     url: "/reservations/stats",
    //     method: "get",
    //     config: {
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     },
    // });

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

    // const stats = (statsQuery as any)?.data?.data || {};
    // const todayReservations = (todayQuery as any)?.data?.data || [];
    // const isLoadingStats = (statsQuery as any)?.isFetching || false;
    let isLoadingStats = false;
    // const isLoadingReservations = (todayQuery as any)?.isFetching || false;

    useEffect(() => {
        const getStatistic = async () => {
            const userStr = localStorage.getItem("refine-user");
            if (userStr) {
                const user = JSON.parse(userStr);
                const token = localStorage.getItem("refine-auth");
                const API_URL = import.meta.env.VITE_API_URL;
                try {
                    const response = await fetch(
                        `${API_URL}/employees/get-employee-by-user-id/${user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        const employeeRoleDataResponse = await fetch(
                            `${API_URL}/employee-roles?employeeId=${data.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (employeeRoleDataResponse.ok) {
                            const employeeRoleData = await employeeRoleDataResponse.json();
                            const propertyIdFromApi = employeeRoleData[0]?.propertyId;
                            localStorage.setItem("propertyId", propertyIdFromApi.toString());
                            if (propertyIdFromApi) {
                                const roomsStatsResponse = await fetch(
                                    `${API_URL}/rooms?propertyId=${propertyIdFromApi}&limit=9999`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                if (roomsStatsResponse.ok) {
                                    const roomsData = await roomsStatsResponse.json();
                                    const allRooms = roomsData.data || [];
                                    setStats({
                                        availableRooms: allRooms.filter((r: any) => r.operationalStatus === "available").length,
                                    });
                                }
                                const reservationToday = await fetch(
                                    `${API_URL}/reservations/?propertyId=${propertyIdFromApi}&createdAt=${new Date().toISOString().split('T')[0]}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                if (reservationToday.ok) {
                                    const reservationTodayData = await reservationToday.json();
                                    setStats((prevStats) => ({
                                        ...prevStats,
                                        todayReservations: reservationTodayData.total || 0,
                                    }));
                                }
                                const checkInsToday = await fetch(
                                    `${API_URL}/reservations/?propertyId=${propertyIdFromApi}&checkInFrom=${new Date().toISOString().split('T')[0]}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                if (checkInsToday.ok) {
                                    const checkInsTodayData = await checkInsToday.json();
                                    setStats((prevStats) => ({
                                        ...prevStats,
                                        todayCheckIns: checkInsTodayData.total || 0,
                                    }));
                                }
                                const checkOutsToday = await fetch(
                                    `${API_URL}/reservations/?propertyId=${propertyIdFromApi}&checkOutTo=${new Date().toISOString().split('T')[0]}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                if (checkOutsToday.ok) {
                                    const checkOutsTodayData = await checkOutsToday.json();
                                    setStats((prevStats) => ({
                                        ...prevStats,
                                        todayCheckOuts: checkOutsTodayData.total || 0,
                                    }));
                                }
                            }
                            isLoadingStats = true;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching propertyId:", error);
                }
            }
        }
        getStatistic();
    }, []);

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
                            value={stats1?.todayReservations || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoadingStats}>
                        <Statistic
                            title="Phòng trống"
                            value={stats1?.availableRooms || 0}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoadingStats}>
                        <Statistic
                            title="Check-in hôm nay"
                            value={stats1?.todayCheckIns || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoadingStats}>
                        <Statistic
                            title="Check-out hôm nay"
                            value={stats1?.todayCheckOuts || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Đặt phòng hôm nay" style={{ marginBottom: "24px" }}>
                {/* <Table
                    dataSource={todayReservations}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    loading={isLoadingReservations}
                /> */}
            </Card>
        </div>
    );
};
