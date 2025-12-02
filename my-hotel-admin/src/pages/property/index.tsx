import React, { useEffect } from "react";
import {
    Card,
    Descriptions,
    Space,
    Typography,
    Spin,
    Row,
    Col,
    Statistic,
} from "antd";
import {
    HomeOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    BankOutlined,
    TeamOutlined,
    CoffeeOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const API_URL = import.meta.env.VITE_API_URL;

export const PropertyInfo: React.FC = () => {
    const [property, setPropertyData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    
    useEffect(() => {
        const getPropertyData = async () => {
            try {
                const token = localStorage.getItem("refine-auth");
                const userID = JSON.parse(localStorage.getItem("refine-user") || "")?.id;
                const employeeResponse = await fetch(
                    `${API_URL}/employees/get-employee-by-user-id/${userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (employeeResponse.ok) {
                    const employeeData = await employeeResponse.json();
                    const employeeId = employeeData.id;
                    const employeeRoleResponse = await fetch(
                        `${API_URL}/employee-roles?employeeId=${employeeId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (employeeRoleResponse.ok) {
                        const employeeRoleData = await employeeRoleResponse.json();
                        const propertyId = employeeRoleData[0]?.propertyId;
                        const propertyResponse = await fetch(
                            `${API_URL}/properties/${propertyId}?include=amenities,images,restaurants,rooms`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (propertyResponse.ok) {
                            const propertyData = await propertyResponse.json();
                            setPropertyData(propertyData);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };
        getPropertyData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!property) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Title level={4}>Không tìm thấy thông tin cơ sở</Title>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* Header Card */}
                <Card hoverable>
                    <Space align="start" size="large" wrap>
                        <BankOutlined style={{ fontSize: 64, color: "#1890ff" }} />
                        <div>
                            <Title level={2} style={{ marginBottom: 8 }}>
                                {property.name}
                            </Title>
                            <Title level={5} type="secondary" style={{ marginTop: 0 }}>
                                {property.propertyType}
                            </Title>
                            <Space direction="vertical" size={4}>
                                <Space>
                                    <HomeOutlined />
                                    <span>{property.address}</span>
                                </Space>
                                <Space>
                                    <PhoneOutlined />
                                    <span>{property.phone}</span>
                                </Space>
                                <Space>
                                    <MailOutlined />
                                    <span>{property.email}</span>
                                </Space>
                                <Space>
                                    <GlobalOutlined />
                                    <span>{property.website}</span>
                                </Space>
                            </Space>
                        </div>
                    </Space>
                </Card>

                {/* Statistics - Responsive */}
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={6}>
                        <Card hoverable>
                            <Statistic
                                title="Tổng số phòng"
                                value={property.rooms?.length || 0}
                                prefix={<HomeOutlined />}
                                valueStyle={{ color: "#3f8600", fontSize: 28 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                        <Card hoverable>
                            <Statistic
                                title="Nhà hàng"
                                value={property.restaurants?.length || 0}
                                prefix={<CoffeeOutlined />}
                                valueStyle={{ color: "#1890ff", fontSize: 28 }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* General Information */}
                <Card title="Thông tin chung" bordered={false} hoverable>
                    <Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered>
                        <Descriptions.Item label="Tên cơ sở">
                            {property.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại hình">
                            {property.propertyType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {property.address}, {property.city}, {property.country}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {property.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {property.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Website">
                            {property.website}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng số phòng">
                            {property.rooms?.length || 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng số nhà hàng">
                            {property.restaurants?.length || 0}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Room List */}
                <Card title={`Danh sách phòng - Tổng cộng: ${property.rooms?.length || 0} phòng`} hoverable>
                    <Row gutter={[16, 16]}>
                        {property.rooms?.slice(0, 12).map((room: any) => (
                            <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
                                <Card size="small" title={`Phòng ${room.number}`}>
                                    <p><strong>Tầng:</strong> {room.floor}</p>
                                    <p><strong>View:</strong> {room.viewType || "-"}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {property.rooms?.length > 12 && (
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <span style={{ color: "#999" }}>... và {property.rooms.length - 12} phòng khác</span>
                        </div>
                    )}
                </Card>

                {/* Restaurant List */}
                {property.restaurants?.length > 0 && (
                    <Card title={`Danh sách nhà hàng - Tổng cộng: ${property.restaurants?.length || 0} nhà hàng`} hoverable>
                        <Row gutter={[16, 16]}>
                            {property.restaurants?.map((restaurant: any) => (
                                <Col key={restaurant.id} xs={24} sm={12} md={8}>
                                    <Card size="small" title={restaurant.name}>
                                        <p><strong>Vị trí:</strong> {restaurant.location || "-"}</p>
                                        <p><strong>Loại ẩm thực:</strong> {restaurant.cuisineType || "-"}</p>
                                        <p><strong>Giờ hoạt động:</strong> {restaurant.openingHours || "-"}</p>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                )}
            </Space>
        </div>
    );
};