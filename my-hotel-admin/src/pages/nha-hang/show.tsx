import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Tag } from "antd";

const { Title } = Typography;

export const NhaHangShow: React.FC = () => {
    const { query: queryResult } = useShow({
        resource: "restaurants",
    });

    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading} title="Chi tiết nhà hàng">
            <Title level={5}>Thông tin nhà hàng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Tên nhà hàng" span={2}>
                    {record?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Loại món ăn">
                    <Tag color="blue">{record?.cuisineType || "Chưa cập nhật"}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Vị trí">
                    {record?.location || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ mở cửa" span={2}>
                    {record?.openingHours || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                    {record?.description || "Chưa có mô tả"}
                </Descriptions.Item>
            </Descriptions>
        </Show>
    );
};

