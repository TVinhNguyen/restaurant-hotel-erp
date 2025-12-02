import { useEffect, useState } from "react";
import { List } from "@refinedev/antd";
import { Table, Tag, Space, Avatar, Card, Row, Col, Statistic, Input, Select, Typography, Spin, Button, Modal, Descriptions, Divider } from "antd";
import { UserOutlined, TeamOutlined, SearchOutlined, EyeOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;

const TOKEN_KEY = "refine-auth";
const USER_KEY = "refine-user";
const API_URL = "http://34.151.224.213:4000/api/v1";

interface Employee {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    status: string;
    hireDate: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    department?: {
        id: string;
        name: string;
    };
}

interface EmployeeRole {
    id: string;
    employeeId: string;
    roleId: string;
    propertyId: string;
    role?: {
        id: string;
        name: string;
    };
}

export const NhanVienList: React.FC = () => {
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]); // Original data for stats
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeRoles, setEmployeeRoles] = useState<Record<string, EmployeeRole[]>>({});
    const [loading, setLoading] = useState(true);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [propertyName, setPropertyName] = useState<string>("");
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    
    // View modal
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const getAuthHeader = (): HeadersInit => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Fetch propertyId first
    useEffect(() => {
        const fetchPropertyId = async () => {
            try {
                const userStr = localStorage.getItem(USER_KEY);
                if (!userStr) {
                    setLoading(false);
                    return;
                }
                
                const userData = JSON.parse(userStr);
                const userId = userData.id;

                // Get employee by userId
                const empResponse = await fetch(`${API_URL}/employees/get-employee-by-user-id/${userId}`, {
                    headers: getAuthHeader(),
                });
                
                if (!empResponse.ok) {
                    console.error("Failed to fetch employee");
                    setLoading(false);
                    return;
                }
                
                const empData = await empResponse.json();

                if (empData?.id) {
                    // Get employee roles
                    const roleResponse = await fetch(`${API_URL}/employee-roles?employeeId=${empData.id}`, {
                        headers: getAuthHeader(),
                    });
                    const roleData = await roleResponse.json();

                    if (roleData?.length > 0 && roleData[0]?.propertyId) {
                        setPropertyId(roleData[0].propertyId);

                        // Fetch property name
                        const propResponse = await fetch(`${API_URL}/properties/${roleData[0].propertyId}`, {
                            headers: getAuthHeader(),
                        });
                        const propData = await propResponse.json();
                        setPropertyName(propData?.name || "");
                    }
                }
            } catch (error) {
                console.error("Error fetching propertyId:", error);
            }
        };

        fetchPropertyId();
    }, []);

    // Fetch employees after propertyId is available
    useEffect(() => {
        if (!propertyId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all employee-roles for this property first
                const empRolesResponse = await fetch(`${API_URL}/employee-roles?propertyId=${propertyId}`, {
                    headers: getAuthHeader(),
                });
                const empRolesData = await empRolesResponse.json();
                // API returns {data: [], total: number} or array
                const empRolesArray = Array.isArray(empRolesData) ? empRolesData : (empRolesData?.data || []);

                if (!empRolesArray || empRolesArray.length === 0) {
                    setEmployees([]);
                    setAllEmployees([]);
                    setLoading(false);
                    return;
                }

                // Group roles by employeeId
                const rolesMap: Record<string, EmployeeRole[]> = {};
                empRolesArray.forEach((er: EmployeeRole) => {
                    if (!rolesMap[er.employeeId]) {
                        rolesMap[er.employeeId] = [];
                    }
                    rolesMap[er.employeeId].push(er);
                });
                setEmployeeRoles(rolesMap);

                // Get unique employee IDs
                const employeeIds = [...new Set(empRolesArray.map((er: EmployeeRole) => er.employeeId))];

                // Fetch all employees
                const allEmpsResponse = await fetch(`${API_URL}/employees`, {
                    headers: getAuthHeader(),
                });
                const allEmpsData = await allEmpsResponse.json();
                // API returns {data: [], total: number} or array
                const allEmpsArray = Array.isArray(allEmpsData) ? allEmpsData : (allEmpsData?.data || []);

                // Filter employees that belong to this property
                const propertyEmployees = allEmpsArray.filter((emp: Employee) => 
                    employeeIds.includes(emp.id)
                );

                setEmployees(propertyEmployees);
                setAllEmployees(propertyEmployees);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [propertyId]);

    // Calculate stats from ALL employees (unfiltered)
    const stats = {
        total: allEmployees.length,
        active: allEmployees.filter((e) => e.status === "active").length,
        inactive: allEmployees.filter((e) => e.status === "inactive" || e.status === "terminated").length,
        onLeave: allEmployees.filter((e) => e.status === "on_leave").length,
    };

    // Filter employees for display
    const filteredEmployees = employees.filter((emp) => {
        const matchSearch = !searchText || 
            emp.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            emp.phone?.includes(searchText);
        const matchStatus = !filterStatus || emp.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const statusColors: Record<string, string> = {
        active: "green",
        inactive: "red",
        terminated: "red",
        on_leave: "orange",
    };

    const statusLabels: Record<string, string> = {
        active: "Đang làm việc",
        inactive: "Nghỉ việc",
        terminated: "Đã nghỉ",
        on_leave: "Nghỉ phép",
    };

    const genderLabels: Record<string, string> = {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
    };

    const handleView = (record: Employee) => {
        setSelectedEmployee(record);
        setViewModalVisible(true);
    };

    const getEmployeeRoles = (employeeId: string): string => {
        const roles = employeeRoles[employeeId];
        if (!roles || roles.length === 0) return "-";
        return roles.map(r => r.role?.name || "N/A").join(", ");
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <List title={`Nhân viên - ${propertyName}`} canCreate={false}>
            {/* Statistics Cards - Always show total stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={12} md={6}>
                    <Card 
                        hoverable 
                        onClick={() => setFilterStatus(undefined)}
                        style={{ borderBottom: !filterStatus ? "3px solid #1890ff" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Tổng nhân viên"
                            value={stats.total}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: "#1890ff", fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card 
                        hoverable 
                        onClick={() => setFilterStatus("active")}
                        style={{ borderBottom: filterStatus === "active" ? "3px solid #52c41a" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Đang làm việc"
                            value={stats.active}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#52c41a", fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card 
                        hoverable 
                        onClick={() => setFilterStatus("on_leave")}
                        style={{ borderBottom: filterStatus === "on_leave" ? "3px solid #faad14" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Nghỉ phép"
                            value={stats.onLeave}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: "#faad14", fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card 
                        hoverable 
                        onClick={() => setFilterStatus("inactive")}
                        style={{ borderBottom: filterStatus === "inactive" ? "3px solid #ff4d4f" : "3px solid transparent" }}
                    >
                        <Statistic
                            title="Nghỉ việc"
                            value={stats.inactive}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#ff4d4f", fontSize: 28 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm kiếm theo tên, email, SĐT..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            style={{ width: "100%" }}
                            allowClear
                            value={filterStatus}
                            onChange={setFilterStatus}
                        >
                            <Option value="active">Đang làm việc</Option>
                            <Option value="inactive">Nghỉ việc</Option>
                            <Option value="on_leave">Nghỉ phép</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Employee Table */}
            <Table
                dataSource={filteredEmployees}
                rowKey="id"
                pagination={{ 
                    pageSize: 10,
                    showTotal: (total) => `Hiển thị ${total} nhân viên`
                }}
                scroll={{ x: 800 }}
            >
                <Table.Column
                    title="Nhân viên"
                    key="employee"
                    render={(_, record: Employee) => (
                        <Space>
                            <Avatar icon={<UserOutlined />} size="large" />
                            <div>
                                <Text strong style={{ fontSize: 14 }}>{record.fullName}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    <MailOutlined /> {record.email}
                                </Text>
                            </div>
                        </Space>
                    )}
                />
                <Table.Column
                    title="Số điện thoại"
                    dataIndex="phone"
                    key="phone"
                    render={(phone: string) => (
                        <Space>
                            <PhoneOutlined />
                            {phone || "-"}
                        </Space>
                    )}
                />
                <Table.Column
                    title="Chức vụ"
                    key="role"
                    render={(_, record: Employee) => getEmployeeRoles(record.id)}
                />
                <Table.Column
                    title="Ngày vào làm"
                    dataIndex="hireDate"
                    key="hireDate"
                    render={(date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-"}
                />
                <Table.Column
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(status: string) => (
                        <Tag color={statusColors[status] || "default"}>
                            {statusLabels[status] || status}
                        </Tag>
                    )}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    render={(_, record: Employee) => (
                        <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                        >
                            Xem
                        </Button>
                    )}
                />
            </Table>

            {/* View Employee Modal */}
            <Modal
                title={
                    <Space>
                        <Avatar icon={<UserOutlined />} size={48} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>{selectedEmployee?.fullName}</Title>
                            <Text type="secondary">{getEmployeeRoles(selectedEmployee?.id || "")}</Text>
                        </div>
                    </Space>
                }
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedEmployee(null);
                }}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedEmployee && (
                    <>
                        <Divider orientation="left">Thông tin cá nhân</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Họ và tên" span={2}>
                                {selectedEmployee.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {selectedEmployee.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                {selectedEmployee.phone || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                                {genderLabels[selectedEmployee.gender || ""] || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">
                                {selectedEmployee.dateOfBirth ? dayjs(selectedEmployee.dateOfBirth).format("DD/MM/YYYY") : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>
                                {selectedEmployee.address || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Thông tin công việc</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Chức vụ" span={2}>
                                {getEmployeeRoles(selectedEmployee.id)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày vào làm">
                                {selectedEmployee.hireDate ? dayjs(selectedEmployee.hireDate).format("DD/MM/YYYY") : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={statusColors[selectedEmployee.status] || "default"}>
                                    {statusLabels[selectedEmployee.status] || selectedEmployee.status}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>
        </List>
    );
};
