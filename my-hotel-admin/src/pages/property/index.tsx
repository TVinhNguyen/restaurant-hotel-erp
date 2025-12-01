import React from "react";
import {
    Card,
    Descriptions,
    Space,
    Typography,
    Spin,
    Row,
    Col,
    Statistic,
    Image,
} from "antd";
import {
    HomeOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    BankOutlined,
    TeamOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export const PropertyInfo: React.FC = () => {
    // Mock property data - sẽ được lấy từ API /properties
    const propertyData = {
        id: "1",
        name: "Golden Palace Hotel",
        type: "Khách sạn 5 sao",
        address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
        phone: "028 1234 5678",
        email: "info@goldenpalace.com",
        website: "www.goldenpalace.com",
        taxCode: "0123456789",
        establishedYear: "2020",
        description:
            "Golden Palace Hotel là khách sạn 5 sao sang trọng tọa lạc tại trung tâm thành phố, cung cấp dịch vụ cao cấp với đội ngũ nhân viên chuyên nghiệp.",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        totalRooms: 120,
        totalEmployees: 85,
        amenities: [
            "Hồ bơi",
            "Phòng gym",
            "Spa",
            "Nhà hàng",
            "Bar",
            "Phòng họp",
            "WiFi miễn phí",
            "Bãi đỗ xe",
        ],
        images: [
            "https://via.placeholder.com/800x400?text=Hotel+Exterior",
            "https://via.placeholder.com/800x400?text=Lobby",
            "https://via.placeholder.com/800x400?text=Room",
        ],
    };

    const isLoading = false; // Mock loading state

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* Header Card */}
                <Card>
                    <Space align="start" size="large">
                        <BankOutlined style={{ fontSize: 64, color: "#1890ff" }} />
                        <div>
                            <Title level={2} style={{ marginBottom: 8 }}>
                                {propertyData.name}
                            </Title>
                            <Title level={5} type="secondary" style={{ marginTop: 0 }}>
                                {propertyData.type}
                            </Title>
                            <Space direction="vertical" size={4}>
                                <Space>
                                    <HomeOutlined />
                                    <span>{propertyData.address}</span>
                                </Space>
                                <Space>
                                    <PhoneOutlined />
                                    <span>{propertyData.phone}</span>
                                </Space>
                                <Space>
                                    <MailOutlined />
                                    <span>{propertyData.email}</span>
                                </Space>
                                <Space>
                                    <GlobalOutlined />
                                    <span>{propertyData.website}</span>
                                </Space>
                            </Space>
                        </div>
                    </Space>
                </Card>

                {/* Statistics */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số phòng"
                                value={propertyData.totalRooms}
                                valueStyle={{ color: "#3f8600" }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Số nhân viên"
                                value={propertyData.totalEmployees}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Năm thành lập"
                                value={propertyData.establishedYear}
                                prefix={<BankOutlined />}
                                valueStyle={{ color: "#cf1322" }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Property Images */}
                <Card title="Hình ảnh cơ sở" bordered={false}>
                    <Space size="middle" wrap>
                        {propertyData.images.map((image, index) => (
                            <Image
                                key={index}
                                width={250}
                                height={150}
                                src={image}
                                style={{ objectFit: "cover", borderRadius: 8 }}
                            />
                        ))}
                    </Space>
                </Card>

                {/* General Information */}
                <Card title="Thông tin chung" bordered={false}>
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Tên cơ sở">
                            {propertyData.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại hình">
                            {propertyData.type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {propertyData.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {propertyData.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {propertyData.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Website">
                            {propertyData.website}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã số thuế">
                            {propertyData.taxCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Năm thành lập">
                            {propertyData.establishedYear}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giờ nhận phòng">
                            {propertyData.checkInTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giờ trả phòng">
                            {propertyData.checkOutTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng số phòng">
                            {propertyData.totalRooms}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số nhân viên">
                            {propertyData.totalEmployees}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mô tả" span={2}>
                            {propertyData.description}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Amenities */}
                <Card title="Tiện nghi" bordered={false}>
                    <Space size={[8, 16]} wrap>
                        {propertyData.amenities.map((amenity, index) => (
                            <Card
                                key={index}
                                size="small"
                                style={{
                                    backgroundColor: "#f0f5ff",
                                    border: "1px solid #adc6ff",
                                }}
                            >
                                {amenity}
                            </Card>
                        ))}
                    </Space>
                </Card>

                {/* Operating Hours */}
                <Card title="Giờ hoạt động" bordered={false}>
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Lễ tân">24/7</Descriptions.Item>
                        <Descriptions.Item label="Nhà hàng">06:00 - 23:00</Descriptions.Item>
                        <Descriptions.Item label="Spa & Gym">06:00 - 22:00</Descriptions.Item>
                        <Descriptions.Item label="Hồ bơi">06:00 - 20:00</Descriptions.Item>
                        <Descriptions.Item label="Bar">18:00 - 02:00</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>
        </div>
    );
};