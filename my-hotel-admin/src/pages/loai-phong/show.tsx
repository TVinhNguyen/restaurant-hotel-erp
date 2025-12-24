import { Show } from "@refinedev/antd";
import { Typography, Descriptions, Tag, Table, Spin } from "antd";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

const { Title } = Typography;

export const LoaiPhongShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [record, setRecord] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setIsLoading(true);
            const token = localStorage.getItem("refine-auth");
            const API_URL = import.meta.env.VITE_API_URL;

            try {
                const response = await fetch(`${API_URL}/room-types/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRecord(data);
                }
            } catch (error) {
                console.error("Error fetching room type data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        return numPrice?.toLocaleString("vi-VN") + " VNĐ";
    };

    const roomColumns = [
        {
            title: "Số phòng",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "Tầng",
            dataIndex: "floor",
            key: "floor",
        },
        {
            title: "Trạng thái",
            dataIndex: "operationalStatus",
            key: "operationalStatus",
            render: (status: string) => {
                const statusConfig: Record<string, { color: string; text: string }> = {
                    available: { color: "green", text: "Trống" },
                    occupied: { color: "red", text: "Đang sử dụng" },
                    maintenance: { color: "orange", text: "Bảo trì" },
                    out_of_service: { color: "default", text: "Ngừng hoạt động" },
                };
                const config = statusConfig[status] || { color: "default", text: status };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
    ];

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <Show isLoading={false} title={`Chi tiết: ${record?.name || "Loại phòng"}`}>
            <Title level={5}>Thông tin loại phòng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Tên loại phòng">
                    {record?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Giá phòng">
                    <Tag color="blue">{formatPrice(record?.basePrice || 0)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Số người lớn tối đa">
                    {record?.maxAdults} người
                </Descriptions.Item>
                <Descriptions.Item label="Số trẻ em tối đa">
                    {record?.maxChildren} người
                </Descriptions.Item>
                <Descriptions.Item label="Loại giường" span={2}>
                    {record?.bedType || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                    {record?.description || "Chưa có mô tả"}
                </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24 }}>Danh sách phòng thuộc loại này</Title>
            <Table
                dataSource={record?.rooms || []}
                columns={roomColumns}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: "Chưa có phòng nào" }}
            />
        </Show>
    );
};
