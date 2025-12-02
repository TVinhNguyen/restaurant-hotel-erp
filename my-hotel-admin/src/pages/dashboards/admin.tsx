import { Card, Col, Row, Statistic, Typography, Tag, Alert, Spin } from "antd";
import {
    UserOutlined,
    HomeOutlined,
    LoginOutlined,
    LogoutOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    TeamOutlined,
    BankOutlined,
    AppstoreOutlined,
    ClearOutlined,
    ToolOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { TOKEN_KEY, USER_KEY } from "../../authProvider";

const { Title } = Typography;

const API_URL = import.meta.env.VITE_API_URL;

interface PropertyInfo {
    id: string;
    name: string;
    propertyType: string;
}

interface EmployeesByDepartment {
    [key: string]: number;
}

interface EmployeesByStatus {
    active: number;
    inactive: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export const DashboardAdmin: React.FC = () => {
    const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
    const [reservations, setReservations] = useState<AnyRecord[]>([]);
    const [rooms, setRooms] = useState<AnyRecord[]>([]);
    const [guests, setGuests] = useState<AnyRecord[]>([]);
    const [payments, setPayments] = useState<AnyRecord[]>([]);
    const [employees, setEmployees] = useState<AnyRecord[]>([]);
    const [roomTypes, setRoomTypes] = useState<AnyRecord[]>([]);
    const [employeesByDept, setEmployeesByDept] = useState<EmployeesByDepartment>({});
    const [employeesByStatus, setEmployeesByStatus] = useState<EmployeesByStatus>({ active: 0, inactive: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyAndData = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            const userStr = localStorage.getItem(USER_KEY);
            const userId = userStr ? JSON.parse(userStr)?.id : null;
            
            if (!token || !userId) {
                setLoading(false);
                return;
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            try {
                // 1. Lấy employee của user hiện tại
                const employeeRes = await fetch(`${API_URL}/employees/get-employee-by-user-id/${userId}`, { headers });
                if (!employeeRes.ok) throw new Error('Failed to fetch employee');
                const employeeData = await employeeRes.json();
                
                // 2. Lấy employee roles để lấy propertyId
                const employeeRoleRes = await fetch(`${API_URL}/employee-roles?employeeId=${employeeData.id}`, { headers });
                if (!employeeRoleRes.ok) throw new Error('Failed to fetch employee roles');
                const employeeRoleData = await employeeRoleRes.json();
                
                const propId = employeeRoleData[0]?.propertyId;
                if (!propId) throw new Error('No property assigned');

                // 3. Lấy thông tin property
                const propertyRes = await fetch(`${API_URL}/properties/${propId}`, { headers });
                if (propertyRes.ok) {
                    const propData = await propertyRes.json();
                    setPropertyInfo(propData);
                }

                // 4. Lấy dữ liệu theo propertyId
                const [roomsRes, roomTypesRes, resRes, guestsRes, paymentsRes] = await Promise.all([
                    fetch(`${API_URL}/rooms?propertyId=${propId}&limit=200`, { headers }),
                    fetch(`${API_URL}/room-types?propertyId=${propId}&limit=100`, { headers }),
                    fetch(`${API_URL}/reservations?propertyId=${propId}&limit=200`, { headers }),
                    fetch(`${API_URL}/guests?limit=200`, { headers }),
                    fetch(`${API_URL}/payments?limit=200`, { headers }),
                ]);

                const [roomsData, roomTypesData, resData, guestsData, paymentsData] = await Promise.all([
                    roomsRes.json(),
                    roomTypesRes.json(),
                    resRes.json(),
                    guestsRes.json(),
                    paymentsRes.json(),
                ]);

                setRooms(roomsData.data || []);
                setRoomTypes(roomTypesData.data || []);
                setReservations(resData.data || []);
                setGuests(guestsData.data || []);
                setPayments(paymentsData.data || []);

                // 5. Lấy employees theo propertyId (từ employee-roles)
                const allEmployeesRes = await fetch(`${API_URL}/employees?limit=100`, { headers });
                const allEmployeesData = await allEmployeesRes.json();
                const allEmployees: AnyRecord[] = allEmployeesData.data || [];
                
                // Lọc employees có role trong property này
                const propertyEmployees = allEmployees.filter((emp: AnyRecord) => 
                    emp.employeeRoles?.some((role: AnyRecord) => role.propertyId === propId)
                );
                setEmployees(propertyEmployees);

                // Tính toán employees theo department và status
                const deptCounts: EmployeesByDepartment = {};
                let activeCount = 0, inactiveCount = 0;
                
                propertyEmployees.forEach((emp: AnyRecord) => {
                    const dept = emp.department || 'Khác';
                    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
                    if (emp.status === 'active') activeCount++;
                    else inactiveCount++;
                });
                
                setEmployeesByDept(deptCounts);
                setEmployeesByStatus({ active: activeCount, inactive: inactiveCount });

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyAndData();
    }, []);

    const today = new Date().toISOString().split('T')[0];
    
    // API dùng checkIn/checkOut thay vì checkInDate/checkOutDate
    const todayCheckIns = reservations.filter((r) => 
        r.checkIn === today && ['confirmed', 'pending'].includes(r.status)
    ).length;
    const todayCheckOuts = reservations.filter((r) => 
        r.checkOut === today && r.status === 'checked_in'
    ).length;
    
    // Room status - API dùng operationalStatus và housekeepingStatus
    const availableRooms = rooms.filter((r) => r.operationalStatus === 'available').length;
    const occupiedRooms = rooms.filter((r) => r.operationalStatus === 'occupied').length;
    const outOfServiceRooms = rooms.filter((r) => r.operationalStatus === 'out_of_service').length;
    
    // Housekeeping status
    const cleanRooms = rooms.filter((r) => r.housekeepingStatus === 'clean').length;
    const dirtyRooms = rooms.filter((r) => r.housekeepingStatus === 'dirty').length;
    const inspectedRooms = rooms.filter((r) => r.housekeepingStatus === 'inspected').length;
    
    // Reservation stats
    const pendingRes = reservations.filter((r) => r.status === 'pending').length;
    const confirmedRes = reservations.filter((r) => r.status === 'confirmed').length;
    const checkedIn = reservations.filter((r) => r.status === 'checked_in').length;
    
    // API dùng status='captured' cho payments
    const totalRevenue = payments
        .filter((p) => p.status === 'captured')
        .reduce((sum: number, p) => sum + Number(p.amount || 0), 0);

    if (loading) {
        return (
            <div style={{ padding: 32, textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, fontSize: 18 }}>Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (!propertyInfo) {
        return (
            <div style={{ padding: 32 }}>
                <Alert 
                    type="warning" 
                    message="Không tìm thấy thông tin cơ sở" 
                    description="Vui lòng liên hệ quản trị viên để được phân quyền vào một cơ sở."
                    showIcon
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            {/* Header với tên property */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ marginBottom: 8, fontSize: 28 }}>
                    🏨 {propertyInfo.name}
                </Title>
                <Tag color="purple" style={{ fontSize: 16, padding: '6px 16px' }}>
                    <BankOutlined /> {propertyInfo.propertyType}
                </Tag>
            </div>

            {/* Hoạt động hôm nay */}
            <Title level={4} style={{ marginBottom: 20, fontSize: 20 }}>📅 Hoạt động hôm nay</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Check-in hôm nay</span>}
                            value={todayCheckIns} 
                            prefix={<LoginOutlined />} 
                            valueStyle={{ color: "#52c41a", fontSize: 28 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Check-out hôm nay</span>}
                            value={todayCheckOuts} 
                            prefix={<LogoutOutlined />} 
                            valueStyle={{ color: "#faad14", fontSize: 28 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Chờ xác nhận</span>}
                            value={pendingRes} 
                            prefix={<ClockCircleOutlined />} 
                            valueStyle={{ color: "#ff4d4f", fontSize: 28 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Đã xác nhận</span>}
                            value={confirmedRes} 
                            prefix={<CheckCircleOutlined />} 
                            valueStyle={{ color: "#1890ff", fontSize: 28 }} 
                        />
                    </Card>
                </Col>
            </Row>

            {/* Thống kê chi tiết */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {/* Trạng thái phòng */}
                <Col xs={24} md={8}>
                    <Card title={<span style={{ fontSize: 17 }}>🚪 Trạng thái phòng</span>} hoverable>
                        <Row gutter={[8, 16]}>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Trống</span>} value={availableRooms} valueStyle={{ color: "#52c41a", fontSize: 24 }} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Đang ở</span>} value={occupiedRooms} valueStyle={{ color: "#1890ff", fontSize: 24 }} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Bảo trì</span>} value={outOfServiceRooms} valueStyle={{ color: "#ff4d4f", fontSize: 24 }} prefix={<ToolOutlined />} />
                            </Col>
                        </Row>
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            <Tag color="default" style={{ fontSize: 14, padding: '4px 12px' }}>Tổng: {rooms.length} phòng</Tag>
                        </div>
                    </Card>
                </Col>

                {/* Housekeeping */}
                <Col xs={24} md={8}>
                    <Card title={<span style={{ fontSize: 17 }}>🧹 Housekeeping</span>} hoverable>
                        <Row gutter={[8, 16]}>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Sạch</span>} value={cleanRooms} valueStyle={{ color: "#52c41a", fontSize: 24 }} prefix={<ClearOutlined />} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Bẩn</span>} value={dirtyRooms} valueStyle={{ color: "#faad14", fontSize: 24 }} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Đã kiểm</span>} value={inspectedRooms} valueStyle={{ color: "#1890ff", fontSize: 24 }} />
                            </Col>
                        </Row>
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            {dirtyRooms > 0 && <Tag color="warning" style={{ fontSize: 14, padding: '4px 12px' }}>{dirtyRooms} phòng cần dọn</Tag>}
                            {dirtyRooms === 0 && <Tag color="success" style={{ fontSize: 14, padding: '4px 12px' }}>Tất cả phòng sạch</Tag>}
                        </div>
                    </Card>
                </Col>

                {/* Doanh thu & Khách */}
                <Col xs={24} md={8}>
                    <Card title={<span style={{ fontSize: 17 }}>💰 Doanh thu & Khách</span>} hoverable>
                        <Row gutter={[8, 16]}>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Khách</span>} value={guests.length} prefix={<UserOutlined />} valueStyle={{ fontSize: 24 }} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Đang ở</span>} value={checkedIn} prefix={<HomeOutlined />} valueStyle={{ color: "#52c41a", fontSize: 24 }} />
                            </Col>
                            <Col span={8}>
                                <Statistic title={<span style={{ fontSize: 14 }}>Doanh thu</span>} value={totalRevenue.toLocaleString()} prefix={<DollarOutlined />} suffix="$" valueStyle={{ color: "#52c41a", fontSize: 20 }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Thống kê cơ sở */}
            <Title level={4} style={{ marginBottom: 20, fontSize: 20 }}>📊 Thống kê cơ sở</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Tổng phòng</span>}
                            value={rooms.length} 
                            prefix={<HomeOutlined />} 
                            valueStyle={{ color: "#722ed1", fontSize: 28 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Nhân viên</span>}
                            value={employees.length} 
                            prefix={<TeamOutlined />} 
                            valueStyle={{ color: "#13c2c2", fontSize: 28 }}
                            suffix={<span style={{ fontSize: 14, color: '#52c41a' }}>({employeesByStatus.active} active)</span>}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Loại phòng</span>}
                            value={roomTypes.length} 
                            prefix={<AppstoreOutlined />} 
                            valueStyle={{ color: "#fa8c16", fontSize: 28 }} 
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic 
                            title={<span style={{ fontSize: 15 }}>Đặt phòng</span>}
                            value={reservations.length} 
                            prefix={<ScheduleOutlined />} 
                            valueStyle={{ color: "#eb2f96", fontSize: 28 }} 
                        />
                    </Card>
                </Col>
            </Row>

            {/* Phân bố nhân viên theo phòng ban */}
            {Object.keys(employeesByDept).length > 0 && (
                <Card title={<span style={{ fontSize: 17 }}>👥 Phân bố nhân viên theo phòng ban</span>} style={{ marginBottom: 24 }} hoverable>
                    <Row gutter={[16, 12]}>
                        {Object.entries(employeesByDept).map(([dept, count]) => (
                            <Col key={dept} xs={12} sm={8} md={6} lg={4}>
                                <Tag color="blue" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                                    {dept}: <strong>{count}</strong>
                                </Tag>
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}
        </div>
    );
};
