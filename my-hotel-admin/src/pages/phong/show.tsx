import { Show } from "@refinedev/antd";
import {
    Card,
    Descriptions,
    Tag,
    Space,
    Typography,
    Row,
    Col,
    Calendar,
    Badge,
    List,
    Divider,
    Spin,
} from "antd";
import viVN from "antd/es/locale/vi_VN";
import {
    HomeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ToolOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Title, Text } = Typography;

dayjs.locale("vi");

interface Amenity {
    id: number;
    name: string;
    description?: string;
}

interface RoomAmenity {
    id: number;
    amenity: Amenity;
}

interface RoomType {
    id: number;
    name: string;
    description?: string;
    basePrice: number;
    maxAdults: number;
    maxChildren: number;
    bedType?: string;
    size?: number;
}

interface Room {
    id: number;
    number: string;
    floor: number;
    operationalStatus: string;
    viewType?: string;
    roomType: RoomType;
    roomAmenities?: RoomAmenity[];
}

interface Reservation {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
    guest?: {
        firstName: string;
        lastName: string;
        email?: string;
        phoneNumber?: string;
    };
}

export const PhongShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [record, setRecord] = useState<Room | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loadingReservations, setLoadingReservations] = useState(false);

    useEffect(() => {
        const fetchRoomData = async () => {
            if (!id) return;

            setIsLoading(true);
            const token = localStorage.getItem("refine-auth");
            const API_URL = import.meta.env.VITE_API_URL;

            try {
                const response = await fetch(
                    `${API_URL}/rooms/${id}?populate=roomType,roomAmenities.amenity`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setRecord(data);
                }
            } catch (error) {
                console.error("Error fetching room data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoomData();
    }, [id]);

    const roomStatusConfig: Record<
        string,
        { label: string; color: string; icon: React.ReactNode }
    > = {
        available: {
            label: "Trống",
            color: "success",
            icon: <CheckCircleOutlined />,
        },
        occupied: {
            label: "Đang sử dụng",
            color: "error",
            icon: <CloseCircleOutlined />,
        },
        cleaning: {
            label: "Đang dọn",
            color: "processing",
            icon: <ToolOutlined />,
        },
        maintenance: {
            label: "Bảo trì",
            color: "warning",
            icon: <ToolOutlined />,
        },
        reserved: {
            label: "Đã đặt",
            color: "default",
            icon: <HomeOutlined />,
        },
    };

    useEffect(() => {
        if (record?.id) {
            fetchReservations(selectedDate);
        }
    }, [record?.id, selectedDate]);

    const fetchReservations = async (date: Dayjs) => {
        if (!record?.id) return;

        setLoadingReservations(true);
        const token = localStorage.getItem("refine-auth");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const startOfDay = date.startOf("day").toISOString();
            const endOfDay = date.endOf("day").toISOString();
            console.log("Start of date", startOfDay, "End of date", endOfDay);
            console.log(date.toISOString());

            const response = await fetch(
                `${API_URL}/reservations?propertyId=${localStorage.getItem("propertyId")}&roomId=${record.id}&checkInFrom=${endOfDay}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Fetch data from db about reservations:", data);
                setReservations(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
        } finally {
            setLoadingReservations(false);
        }
    };

    const onDateSelect = (date: Dayjs) => {
        setSelectedDate(date);
    };

    const getListData = (value: Dayjs) => {
        return [];
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul style={{ listStyle: "none", padding: 0 }}>
                {listData.map((item: any) => (
                    <li key={item.id}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    const reservationStatusConfig: Record<
        string,
        { label: string; color: string }
    > = {
        pending: { label: "Chờ xác nhận", color: "warning" },
        confirmed: { label: "Đã xác nhận", color: "success" },
        checked_in: { label: "Đã check-in", color: "processing" },
        checked_out: { label: "Đã check-out", color: "default" },
        cancelled: { label: "Đã hủy", color: "error" },
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!record) {
        return <div>Không tìm thấy phòng</div>;
    }

    const statusConfig = roomStatusConfig[record.operationalStatus] || {
        label: record.operationalStatus,
        color: "default",
        icon: <HomeOutlined />,
    };

    return (
        <Show title={`Chi tiết phòng ${record.number}`} headerButtons={[]}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title={
                            <Space>
                                <HomeOutlined style={{ fontSize: 20 }} />
                                <Text strong style={{ fontSize: 18 }}>
                                    Thông tin cơ bản
                                </Text>
                            </Space>
                        }
                    >
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Số phòng">
                                <Text strong style={{ fontSize: 18 }}>
                                    {record.number}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag
                                    color={statusConfig.color}
                                    icon={statusConfig.icon}
                                >
                                    {statusConfig.label}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại phòng">
                                {record.roomType?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tầng">
                                Tầng {record.floor}
                            </Descriptions.Item>
                            <Descriptions.Item label="Góc view">
                                {record.viewType || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giá phòng">
                                <Text strong style={{ color: "#3f8600", fontSize: 16 }}>
                                    {record.roomType?.basePrice?.toLocaleString("vi-VN")}{" "}
                                    VNĐ/đêm
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại giường">
                                {record.roomType?.bedType || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Diện tích">
                                {record.roomType?.size
                                    ? `${record.roomType.size} m²`
                                    : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sức chứa" span={2}>
                                <Space>
                                    <Text>
                                        Tối đa:{" "}
                                        {(record.roomType?.maxAdults || 0) +
                                            (record.roomType?.maxChildren || 0)}{" "}
                                        người
                                    </Text>
                                    <Divider type="vertical" />
                                    <Text type="secondary">
                                        ({record.roomType?.maxAdults || 0} người lớn,{" "}
                                        {record.roomType?.maxChildren || 0} trẻ em)
                                    </Text>
                                </Space>
                            </Descriptions.Item>
                            {record.roomType?.description && (
                                <Descriptions.Item label="Mô tả" span={2}>
                                    {record.roomType.description}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>
                </Col>

                {/* Tiện ích phòng */}
                <Col span={24}>
                    <Card
                        title={
                            <Space>
                                <CheckCircleOutlined style={{ fontSize: 20 }} />
                                <Text strong style={{ fontSize: 18 }}>
                                    Tiện ích trong phòng
                                </Text>
                            </Space>
                        }
                    >
                        {record.roomAmenities && record.roomAmenities.length > 0 ? (
                            <List
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 3,
                                    lg: 4,
                                    xl: 4,
                                    xxl: 4,
                                }}
                                dataSource={record.roomAmenities}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            size="small"
                                            style={{
                                                textAlign: "center",
                                                height: "100%",
                                            }}
                                        >
                                            <CheckCircleOutlined
                                                style={{
                                                    fontSize: 24,
                                                    color: "#52c41a",
                                                    marginBottom: 8,
                                                }}
                                            />
                                            <div>
                                                <Text strong>{item.amenity.name}</Text>
                                            </div>
                                            {item.amenity.description && (
                                                <div>
                                                    <Text
                                                        type="secondary"
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        {item.amenity.description}
                                                    </Text>
                                                </div>
                                            )}
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">
                                Chưa có thông tin về tiện ích trong phòng
                            </Text>
                        )}
                    </Card>
                </Col>

                {/* Lịch đặt phòng */}
                <Col span={24}>
                    <Card
                        title={
                            <Space>
                                <UserOutlined style={{ fontSize: 20 }} />
                                <Text strong style={{ fontSize: 18 }}>
                                    Lịch đặt phòng
                                </Text>
                            </Space>
                        }
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                                <Calendar
                                    fullscreen={false}
                                    value={selectedDate}
                                    onSelect={onDateSelect}
                                    dateCellRender={dateCellRender}
                                    locale={viVN.Calendar}
                                />
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <Text strong>
                                            Đặt phòng ngày{" "}
                                            {selectedDate.format("DD/MM/YYYY")}
                                        </Text>
                                    }
                                    style={{ height: "100%" }}
                                >
                                    {loadingReservations ? (
                                        <div style={{ textAlign: "center", padding: 20 }}>
                                            <Spin />
                                        </div>
                                    ) : reservations.length > 0 ? (
                                        <List
                                            dataSource={reservations}
                                            renderItem={(reservation) => {
                                                const statusConfig =
                                                    reservationStatusConfig[
                                                    reservation.status
                                                    ] || {
                                                        label: reservation.status,
                                                        color: "default",
                                                    };
                                                return (
                                                    <List.Item>
                                                        <Space
                                                            direction="vertical"
                                                            size={4}
                                                            style={{ width: "100%" }}
                                                        >
                                                            <Space>
                                                                <UserOutlined />
                                                                <Text strong>
                                                                    {reservation.guest
                                                                        ?.firstName}{" "}
                                                                    {reservation.guest
                                                                        ?.lastName}
                                                                </Text>
                                                            </Space>
                                                            <Text
                                                                type="secondary"
                                                                style={{ fontSize: 12 }}
                                                            >
                                                                Check-in:{" "}
                                                                {dayjs(
                                                                    reservation.checkInDate
                                                                ).format("DD/MM/YYYY HH:mm")}
                                                            </Text>
                                                            <Text
                                                                type="secondary"
                                                                style={{ fontSize: 12 }}
                                                            >
                                                                Check-out:{" "}
                                                                {dayjs(
                                                                    reservation.checkOutDate
                                                                ).format("DD/MM/YYYY HH:mm")}
                                                            </Text>
                                                            {reservation.guest?.phoneNumber && (
                                                                <Text
                                                                    type="secondary"
                                                                    style={{ fontSize: 12 }}
                                                                >
                                                                    SĐT:{" "}
                                                                    {
                                                                        reservation.guest
                                                                            .phoneNumber
                                                                    }
                                                                </Text>
                                                            )}
                                                            <Tag color={statusConfig.color}>
                                                                {statusConfig.label}
                                                            </Tag>
                                                        </Space>
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    ) : (
                                        <Text type="secondary">
                                            Không có đặt phòng nào trong ngày này
                                        </Text>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Show>
    );
};
