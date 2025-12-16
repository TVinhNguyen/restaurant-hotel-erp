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
const API_URL = import.meta.env.VITE_API_URL;

export const PropertyInfo: React.FC = () => {
    const [property, setPropertyData] = React.useState<any>(null);
    const [amenities, setAmenities] = React.useState<string[]>([]);
    useEffect(() => {
        const getPropertyData = async () => {
            const token = localStorage.getItem("refine-auth");
            const userID = JSON.parse(localStorage.getItem("refine-user") || "")?.id;
            const employeeResponse = await fetch(
                `${API_URL}/employees/get-employee-by-user-id/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (employeeResponse.ok) {
                const employeeData = await employeeResponse.json();
                const employeeId = employeeData.id;
                const employeeRoleResponse = await fetch(
                    `${API_URL}/employee-roles?employeeId=${employeeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (employeeRoleResponse.ok) {
                    const employeeRoleData = await employeeRoleResponse.json();
                    const propertyId = employeeRoleData[0]?.propertyId;
                    const propertyResponse = await fetch(
                        `${API_URL}/properties/${propertyId}?include=amenities,images,restaurants,rooms`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    if (propertyResponse.ok) {
                        const propertyData = await propertyResponse.json();
                        console.log("Fetched property data:", propertyData);
                        setPropertyData(propertyData);
                    }
                }
            }
        };
        const getAmenities = async () => {

        }
        getPropertyData();
        getAmenities();
    }, []);

    const propertyData = {
        id: property?.id,
        name: property?.name,
        type: property?.propertyType,
        address: property?.address,
        city: property?.city,
        country: property?.country,
        phone: property?.phone,
        email: property?.email,
        website: property?.website,
        // taxCode: "0123456789",
        // establishedYear: "2020",
        description: `${property?.name} là khách sạn 5 sao sang trọng tọa lạc tại trung tâm thành phố, cung cấp dịch vụ cao cấp với đội ngũ nhân viên chuyên nghiệp.`,
        totalRooms: property?.rooms?.length,
        totalRestaurants: property?.restaurants?.length,
        // amenities: [
        //     "Hồ bơi",
        //     "Phòng gym",
        //     "Spa",
        //     "Nhà hàng",
        //     "Bar",
        //     "Phòng họp",
        //     "WiFi miễn phí",
        //     "Bãi đỗ xe",
        // ],
        // images: [
        //     "https://via.placeholder.com/800x400?text=Hotel+Exterior",
        //     "https://via.placeholder.com/800x400?text=Lobby",
        //     "https://via.placeholder.com/800x400?text=Room",
        // ],
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
                                title="Tổng số nhà hàng"
                                value={propertyData.totalRestaurants}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    {/* <Col span={8}>
                        <Card>
                            <Statistic
                                title="Năm thành lập"
                                value={propertyData.establishedYear}
                                prefix={<BankOutlined />}
                                valueStyle={{ color: "#cf1322" }}
                            />
                        </Card>
                    </Col> */}
                </Row>

                {/* Property Images */}
                {/* <Card title="Hình ảnh cơ sở" bordered={false}>
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
                </Card> */}

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
                            {propertyData.address}, {propertyData.city}, {propertyData.country}
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
                        <Descriptions.Item label="Mô tả" span={2}>
                            {propertyData.description}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Mã số thuế">
                            {propertyData.taxCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Năm thành lập">
                            {propertyData.establishedYear}
                        </Descriptions.Item> */}
                        <Descriptions.Item label="Tổng số phòng">
                            {propertyData.totalRooms}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng số nhà hàng">
                            {propertyData.totalRestaurants}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Amenities */}
                {/* <Card title="Tiện nghi" bordered={false}>
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
                </Card> */}

                <Card title={`Danh sách phòng - Tổng cộng: ${property?.rooms?.length || 0} phòng`}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        {property?.rooms?.map((room: any) => (
                            <Card key={room.id} type="inner" title={`Phòng ${room.number}`}>
                                <Descriptions column={3} bordered>
                                    <Descriptions.Item label="Tầng">
                                        {room.floor}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="View">
                                        {room.viewType}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ghi chú" span={2}>
                                        {room.notes || "Không có"}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        ))}
                    </Space>
                </Card>

                <Card title={`Danh sách nhà hàng - Tổng cộng: ${property?.restaurants?.length || 0} nhà hàng`}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        {property?.restaurants?.map((restaurant: any) => (
                            <Card key={restaurant.id} type="inner" title={`Nhà hàng ${restaurant.name}`}>
                                <Descriptions column={3} bordered>
                                    <Descriptions.Item label="Vị trí">
                                        {restaurant.location}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Loại ẩm thực">
                                        {restaurant.cuisineType}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Giờ hoạt động" span={2}>
                                        {restaurant.openingHours || "Không có"}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        ))}
                    </Space>
                </Card>
            </Space>
        </div>
    );
};