import { Show } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Typography, Descriptions, Tag, Button, Space, Card, Spin, App } from "antd";
import { 
    EditOutlined, 
    ShopOutlined, 
    EnvironmentOutlined, 
    ClockCircleOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { TOKEN_KEY } from "../../authProvider";

const { Title, Text, Paragraph } = Typography;

interface RestaurantData {
    id: string;
    name: string;
    cuisineType?: string;
    location?: string;
    openingHours?: string;
    description?: string;
    property?: { name: string };
}

const cuisineLabels: Record<string, string> = {
    Vietnamese: "Việt Nam",
    Chinese: "Trung Quốc",
    Japanese: "Nhật Bản",
    Korean: "Hàn Quốc",
    Thai: "Thái Lan",
    Italian: "Ý",
    French: "Pháp",
    Seafood: "Hải sản",
    BBQ: "BBQ",
    Buffet: "Buffet",
    Fastfood: "Fastfood",
    Other: "Khác",
};

const cuisineColors: Record<string, string> = {
    Vietnamese: "green",
    Chinese: "red",
    Japanese: "volcano",
    Korean: "orange",
    Thai: "gold",
    Italian: "blue",
    French: "purple",
    Seafood: "cyan",
    BBQ: "magenta",
    Buffet: "geekblue",
    Fastfood: "lime",
    Other: "default",
};

export const NhaHangShow: React.FC = () => {
    const { message } = App.useApp();
    const { id } = useParams<{ id: string }>();
    const { edit } = useNavigation();
    
    const [record, setRecord] = useState<RestaurantData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch restaurant data
    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!id) return;
            
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await fetch(`${API_URL}/restaurants/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRecord(data);
                } else {
                    message.error("Không thể tải dữ liệu nhà hàng");
                }
            } catch (error) {
                console.error("Error fetching restaurant:", error);
                message.error("Lỗi khi tải dữ liệu");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurant();
    }, [id, API_URL, message]);

    const renderActionButtons = () => {
        if (!record) return null;
        
        return (
            <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => edit("nha-hang", record.id)}
            >
                Chỉnh sửa
            </Button>
        );
    };

    if (isLoading) {
        return (
            <Show title="Chi tiết nhà hàng">
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            </Show>
        );
    }

    return (
        <Show 
            isLoading={false} 
            title="Chi tiết nhà hàng"
            headerButtons={renderActionButtons}
        >
            {/* Header Card */}
            {record && (
                <Card 
                    style={{ 
                        marginBottom: 24,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                    }}
                >
                    <Space align="center" size="large">
                        <div style={{ 
                            background: "rgba(255,255,255,0.2)", 
                            borderRadius: "12px", 
                            padding: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <ShopOutlined style={{ fontSize: 32, color: "#fff" }} />
                        </div>
                        <div>
                            <Title level={3} style={{ color: "#fff", margin: 0 }}>
                                {record.name}
                            </Title>
                            {record.cuisineType && (
                                <Tag 
                                    color={cuisineColors[record.cuisineType] || "default"}
                                    style={{ marginTop: 8 }}
                                >
                                    {cuisineLabels[record.cuisineType] || record.cuisineType}
                                </Tag>
                            )}
                        </div>
                    </Space>
                </Card>
            )}

            {/* Basic Info */}
            <Title level={5}><InfoCircleOutlined /> Thông tin cơ bản</Title>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Tên nhà hàng" span={2}>
                    <Text strong>{record?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Loại món ăn">
                    {record?.cuisineType ? (
                        <Tag color={cuisineColors[record.cuisineType] || "default"}>
                            {cuisineLabels[record.cuisineType] || record.cuisineType}
                        </Tag>
                    ) : (
                        <Text type="secondary">Chưa cập nhật</Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Thuộc cơ sở">
                    {record?.property?.name || <Text type="secondary">N/A</Text>}
                </Descriptions.Item>
            </Descriptions>

            {/* Location & Hours */}
            <Title level={5}><EnvironmentOutlined /> Vị trí & Giờ hoạt động</Title>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Vị trí">
                    {record?.location ? (
                        <Space>
                            <EnvironmentOutlined style={{ color: "#52c41a" }} />
                            {record.location}
                        </Space>
                    ) : (
                        <Text type="secondary">Chưa cập nhật</Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ mở cửa">
                    {record?.openingHours ? (
                        <Space>
                            <ClockCircleOutlined style={{ color: "#1890ff" }} />
                            {record.openingHours}
                        </Space>
                    ) : (
                        <Text type="secondary">Chưa cập nhật</Text>
                    )}
                </Descriptions.Item>
            </Descriptions>

            {/* Description */}
            {record?.description && (
                <>
                    <Title level={5}>📝 Mô tả</Title>
                    <Card>
                        <Paragraph>{record.description}</Paragraph>
                    </Card>
                </>
            )}
        </Show>
    );
};

