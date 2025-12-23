import { Show } from "@refinedev/antd";
import { useShow, useNavigation } from "@refinedev/core";
import { Typography, Descriptions, Tag, Button, Space, Card, Empty } from "antd";
import { 
    EditOutlined, 
    ShopOutlined, 
    EnvironmentOutlined, 
    ClockCircleOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";

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
    const { query: queryResult } = useShow<RestaurantData>({
        resource: "restaurants",
    });
    const { edit } = useNavigation();

    const { data, isLoading } = queryResult;
    const record = data?.data;

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

    return (
        <Show 
            isLoading={isLoading} 
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
                            <ClockCircleOutlined style={{ color: "#faad14" }} />
                            {record.openingHours}
                        </Space>
                    ) : (
                        <Text type="secondary">Chưa cập nhật</Text>
                    )}
                </Descriptions.Item>
            </Descriptions>

            {/* Description */}
            <Title level={5}>📝 Mô tả</Title>
            <Card style={{ marginBottom: 24 }}>
                {record?.description ? (
                    <Paragraph>{record.description}</Paragraph>
                ) : (
                    <Empty description="Chưa có mô tả" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </Card>
        </Show>
    );
};

