import { Show } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Typography, Descriptions, Tag, Button, Space, Spin, App, Modal, Select, Table, InputNumber, DatePicker, Divider } from "antd";
import { EditOutlined, LoginOutlined, LogoutOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { TOKEN_KEY } from "../../authProvider";
import dayjs from "dayjs";

const { Title } = Typography;

// Interfaces
interface RoomOption {
    id: string;
    number: string;
    housekeepingStatus: string;
    operationalStatus: string;
}

interface ServiceInfo {
    id: string;
    name: string;
    unit?: string;
}

interface PropertyServiceOption {
    id: string;
    price: number;
    taxRate: number;
    currency: string;
    service?: ServiceInfo;
    serviceId?: string;
}

interface ReservationServiceItem {
    id: string;
    quantity: number;
    totalPrice: number;
    dateProvided?: string;
    propertyService?: PropertyServiceOption;
    propertyServiceId?: string;
}

interface ReservationData {
    id: string;
    confirmationCode: string;
    status: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
    totalAmount?: string | number;
    paymentStatus?: string;
    guestNotes?: string;
    roomTypeId?: string;
    assignedRoomId?: string;
    propertyId?: string;
    guest?: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
    };
    roomType?: {
        id: string;
        name: string;
        basePrice?: string | number;
    };
    assignedRoom?: {
        id: string;
        number: string;
        floor?: string;
    };
}

// Constants
const STATUS_COLORS: Record<string, string> = {
    pending: "orange",
    confirmed: "blue",
    checked_in: "green",
    checked_out: "default",
    cancelled: "red",
};

const STATUS_LABELS: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    checked_in: "Đã check-in",
    checked_out: "Đã check-out",
    cancelled: "Đã hủy",
};

// Helper functions
const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
};

const formatCurrency = (amount?: string | number): string => {
    if (amount === undefined || amount === null) return "0 VNĐ";
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "0 VNĐ";
    return `${numAmount.toLocaleString("vi-VN")} VNĐ`;
};

export const DatPhongShow: React.FC = () => {
    const { message } = App.useApp();
    const { id } = useParams<{ id: string }>();
    const { edit } = useNavigation();

    // Main states
    const [record, setRecord] = useState<ReservationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal states
    const [checkInModalVisible, setCheckInModalVisible] = useState(false);
    const [checkOutModalVisible, setCheckOutModalVisible] = useState(false);
    const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
    
    // Room states
    const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
    
    // Action states
    const [actionLoading, setActionLoading] = useState(false);
    const [servicesLoading, setServicesLoading] = useState(false);
    
    // Services states
    const [reservationServices, setReservationServices] = useState<ReservationServiceItem[]>([]);
    const [propertyServices, setPropertyServices] = useState<PropertyServiceOption[]>([]);
    const [selectedPropertyServiceId, setSelectedPropertyServiceId] = useState<string | undefined>();
    const [serviceQuantity, setServiceQuantity] = useState<number>(1);
    const [serviceDate, setServiceDate] = useState<dayjs.Dayjs | null>(dayjs());

    const API_URL = import.meta.env.VITE_API_URL;

    // Get auth token
    const getToken = () => localStorage.getItem(TOKEN_KEY);

    // Fetch reservation data
    const fetchReservation = useCallback(async () => {
        if (!id) return;

        try {
            const response = await fetch(`${API_URL}/reservations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Reservation data:", data);
                setRecord(data);
            } else {
                message.error("Không thể tải dữ liệu đặt phòng");
            }
        } catch (error) {
            console.error("Error fetching reservation:", error);
            message.error("Lỗi khi tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    }, [id, API_URL, message]);

    // Fetch reservation services (services used by guest)
    const fetchReservationServices = useCallback(async () => {
        if (!id) return;

        try {
            const response = await fetch(`${API_URL}/reservation-services?reservationId=${id}&limit=100`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Reservation services:", data);
                setReservationServices(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching reservation services:", error);
        }
    }, [id, API_URL]);

    // Fetch property services (available services to add)
    const fetchPropertyServices = useCallback(async (propertyId?: string) => {
        try {
            // Build URL - if propertyId provided, filter by it; otherwise get all
            let url = `${API_URL}/property-services?limit=100`;
            if (propertyId) {
                url += `&propertyId=${propertyId}`;
            }
            
            console.log("Fetching property services from:", url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Property services response:", data);
                const services = data.data || [];
                setPropertyServices(services);
                
                if (services.length === 0) {
                    console.warn("No property services found. Please add services in admin.");
                }
            } else {
                console.error("Failed to fetch property services:", response.status);
            }
        } catch (error) {
            console.error("Error fetching property services:", error);
        }
    }, [API_URL]);

    // Fetch available rooms for check-in
    const fetchAvailableRooms = useCallback(async () => {
        if (!record?.roomTypeId) return;

        try {
            const response = await fetch(`${API_URL}/rooms?roomTypeId=${record.roomTypeId}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const rooms = Array.isArray(data) ? data : data.data || [];
                const available = rooms.filter((room: RoomOption) => 
                    room.operationalStatus === 'available' && 
                    room.housekeepingStatus !== 'dirty'
                );
                setAvailableRooms(available);
                
                if (record.assignedRoomId) {
                    setSelectedRoomId(record.assignedRoomId);
                }
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }, [record?.roomTypeId, record?.assignedRoomId, API_URL]);

    // Initial load
    useEffect(() => {
        fetchReservation();
    }, [fetchReservation]);

    // Load services when record is available
    useEffect(() => {
        if (record?.id) {
            fetchReservationServices();
            // Fetch property services - try with propertyId first, if not available fetch all
            fetchPropertyServices(record.propertyId);
        }
    }, [record?.id, record?.propertyId, fetchReservationServices, fetchPropertyServices]);

    // Handle Check-in
    const handleCheckIn = async () => {
        if (!record) return;

        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/reservations/${record.id}/checkin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId: selectedRoomId }),
            });

            if (response.ok) {
                message.success("Check-in thành công!");
                setCheckInModalVisible(false);
                fetchReservation();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Check-in thất bại");
            }
        } catch (error) {
            console.error("Error checking in:", error);
            message.error("Lỗi khi check-in");
        } finally {
            setActionLoading(false);
        }
    };

    // Handle Check-out
    const handleCheckOut = async () => {
        if (!record) return;

        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/reservations/${record.id}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                message.success("Check-out thành công!");
                setCheckOutModalVisible(false);
                fetchReservation();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Check-out thất bại");
            }
        } catch (error) {
            console.error("Error checking out:", error);
            message.error("Lỗi khi check-out");
        } finally {
            setActionLoading(false);
        }
    };

    // Add service to reservation
    const handleAddService = async () => {
        if (!selectedPropertyServiceId || !record) return;

        const selectedService = propertyServices.find(ps => ps.id === selectedPropertyServiceId);
        if (!selectedService) {
            message.error("Không tìm thấy dịch vụ đã chọn");
            return;
        }

        const price = Number(selectedService.price) || 0;
        const taxRate = Number(selectedService.taxRate) || 0;
        const totalPrice = price * serviceQuantity * (1 + taxRate / 100);

        setServicesLoading(true);
        try {
            const response = await fetch(`${API_URL}/reservation-services`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservationId: record.id,
                    propertyServiceId: selectedPropertyServiceId,
                    quantity: serviceQuantity,
                    totalPrice: Math.round(totalPrice * 100) / 100,
                    dateProvided: serviceDate?.format('YYYY-MM-DD'),
                }),
            });

            if (response.ok) {
                message.success("Đã thêm dịch vụ thành công!");
                closeAddServiceModal();
                fetchReservationServices();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Thêm dịch vụ thất bại");
            }
        } catch (error) {
            console.error("Error adding service:", error);
            message.error("Lỗi khi thêm dịch vụ");
        } finally {
            setServicesLoading(false);
        }
    };

    // Delete service from reservation
    const handleDeleteService = async (serviceId: string) => {
        try {
            const response = await fetch(`${API_URL}/reservation-services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                message.success("Đã xóa dịch vụ!");
                fetchReservationServices();
            } else {
                message.error("Xóa dịch vụ thất bại");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            message.error("Lỗi khi xóa dịch vụ");
        }
    };

    // Modal handlers
    const openCheckInModal = () => {
        fetchAvailableRooms();
        setCheckInModalVisible(true);
    };

    const closeAddServiceModal = () => {
        setAddServiceModalVisible(false);
        setSelectedPropertyServiceId(undefined);
        setServiceQuantity(1);
        setServiceDate(dayjs());
    };

    // Calculate totals
    const totalServicesAmount = reservationServices.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const roomAmount = record ? Number(record.totalAmount || 0) : 0;
    const grandTotal = roomAmount + totalServicesAmount;

    // Get service name helper
    const getServiceName = (item: ReservationServiceItem): string => {
        return item.propertyService?.service?.name || 'Dịch vụ không xác định';
    };

    // Get service price helper
    const getServicePrice = (item: ReservationServiceItem): number => {
        return Number(item.propertyService?.price || 0);
    };

    // Render action buttons
    const renderActionButtons = () => {
        if (!record) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkInDate = new Date(record.checkIn);
        checkInDate.setHours(0, 0, 0, 0);
        const canCheckInToday = checkInDate <= today;

        return (
            <Space>
                {record.status === "confirmed" && canCheckInToday && (
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={openCheckInModal}
                        style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                    >
                        Check-in
                    </Button>
                )}

                {record.status === "checked_in" && (
                    <Button
                        type="primary"
                        icon={<LogoutOutlined />}
                        onClick={() => setCheckOutModalVisible(true)}
                        style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
                    >
                        Check-out
                    </Button>
                )}

                {record.status !== "cancelled" && record.status !== "checked_out" && (
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => edit("dat-phong", record.id)}
                    >
                        Chỉnh sửa
                    </Button>
                )}
            </Space>
        );
    };

    // Service table columns
    const serviceColumns = [
        {
            title: 'Dịch vụ',
            key: 'name',
            render: (_: unknown, item: ReservationServiceItem) => getServiceName(item),
        },
        {
            title: 'Đơn giá',
            key: 'price',
            render: (_: unknown, item: ReservationServiceItem) => formatCurrency(getServicePrice(item)),
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 60,
        },
        {
            title: 'Ngày',
            dataIndex: 'dateProvided',
            key: 'dateProvided',
            render: (date: string) => date ? formatDate(date) : 'N/A',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price: number) => <strong>{formatCurrency(price)}</strong>,
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: (_: unknown, item: ReservationServiceItem) => (
                (record?.status === "checked_in" || record?.status === "confirmed") && (
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteService(item.id)}
                        size="small"
                    />
                )
            ),
        },
    ];

    // Loading state
    if (isLoading) {
        return (
            <Show title="Chi tiết đặt phòng">
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            </Show>
        );
    }

    // Not found state
    if (!record) {
        return (
            <Show title="Chi tiết đặt phòng">
                <div style={{ textAlign: "center", padding: "50px" }}>
                    Không tìm thấy thông tin đặt phòng
                </div>
            </Show>
        );
    }

    return (
        <Show title="Chi tiết đặt phòng" headerButtons={renderActionButtons}>
            {/* Thông tin đặt phòng */}
            <Title level={5}>Thông tin đặt phòng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã đặt phòng">
                    {record.confirmationCode || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={STATUS_COLORS[record.status] || "default"}>
                        {STATUS_LABELS[record.status] || record.status}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày check-in">
                    {formatDate(record.checkIn)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày check-out">
                    {formatDate(record.checkOut)}
                </Descriptions.Item>
                <Descriptions.Item label="Số người lớn">
                    {record.adults || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Số trẻ em">
                    {record.children || 0}
                </Descriptions.Item>
            </Descriptions>

            {/* Thông tin khách hàng */}
            <Title level={5} style={{ marginTop: 24 }}>Thông tin khách hàng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Họ tên">
                    {record.guest?.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {record.guest?.email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" span={2}>
                    {record.guest?.phone || "N/A"}
                </Descriptions.Item>
            </Descriptions>

            {/* Thông tin phòng */}
            <Title level={5} style={{ marginTop: 24 }}>Thông tin phòng</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Loại phòng">
                    {record.roomType?.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Số phòng">
                    {record.assignedRoom?.number ? `Phòng ${record.assignedRoom.number}` : "Chưa gán"}
                    {record.assignedRoom?.floor && ` (Tầng ${record.assignedRoom.floor})`}
                </Descriptions.Item>
                <Descriptions.Item label="Giá phòng">
                    {formatCurrency(record.roomType?.basePrice)}/đêm
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền phòng">
                    <strong style={{ color: "#3f8600", fontSize: "16px" }}>
                        {formatCurrency(record.totalAmount)}
                    </strong>
                </Descriptions.Item>
            </Descriptions>

            {/* Ghi chú */}
            {record.guestNotes && (
                <>
                    <Title level={5} style={{ marginTop: 24 }}>Ghi chú đặc biệt</Title>
                    <p>{record.guestNotes}</p>
                </>
            )}

            {/* Dịch vụ đã sử dụng */}
            <Title level={5} style={{ marginTop: 24 }}>
                Dịch vụ đã sử dụng
                {(record.status === "checked_in" || record.status === "confirmed") && (
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => setAddServiceModalVisible(true)}
                        disabled={propertyServices.length === 0}
                    >
                        Thêm dịch vụ
                    </Button>
                )}
            </Title>
            
            {propertyServices.length === 0 && (
                <p style={{ color: '#faad14', marginBottom: 8 }}>
                    ⚠️ Chưa có dịch vụ nào được cấu hình cho property này. Vui lòng thêm dịch vụ trong phần quản lý.
                </p>
            )}
            
            {reservationServices.length > 0 ? (
                <>
                    <Table
                        dataSource={reservationServices}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        columns={serviceColumns}
                    />
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                        <strong>Tổng tiền dịch vụ: {formatCurrency(totalServicesAmount)}</strong>
                    </div>
                </>
            ) : (
                <p style={{ color: '#888' }}>Chưa có dịch vụ nào được sử dụng</p>
            )}

            {/* Tổng bill */}
            <Divider />
            <Title level={5}>Tổng hóa đơn</Title>
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Tiền phòng">
                    {formatCurrency(roomAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền dịch vụ">
                    {formatCurrency(totalServicesAmount)}
                </Descriptions.Item>
                <Descriptions.Item label={<strong>TỔNG CỘNG</strong>}>
                    <strong style={{ color: "#3f8600", fontSize: "18px" }}>
                        {formatCurrency(grandTotal)}
                    </strong>
                </Descriptions.Item>
            </Descriptions>

            {/* Check-in Modal */}
            <Modal
                title="Check-in khách hàng"
                open={checkInModalVisible}
                onOk={handleCheckIn}
                onCancel={() => {
                    setCheckInModalVisible(false);
                    setSelectedRoomId(undefined);
                }}
                okText="Xác nhận Check-in"
                cancelText="Hủy"
                confirmLoading={actionLoading}
                okButtonProps={{ style: { backgroundColor: "#52c41a", borderColor: "#52c41a" } }}
            >
                <div style={{ marginBottom: 16 }}>
                    <p><strong>Khách hàng:</strong> {record.guest?.name}</p>
                    <p><strong>Mã đặt phòng:</strong> {record.confirmationCode}</p>
                    <p><strong>Loại phòng:</strong> {record.roomType?.name}</p>
                    <p><strong>Ngày check-in:</strong> {formatDate(record.checkIn)}</p>
                    <p><strong>Ngày check-out:</strong> {formatDate(record.checkOut)}</p>
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label><strong>Chọn phòng:</strong></label>
                </div>
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn phòng để gán (hoặc để trống để tự động)"
                    value={selectedRoomId}
                    onChange={setSelectedRoomId}
                    allowClear
                >
                    {availableRooms.map((room) => (
                        <Select.Option key={room.id} value={room.id}>
                            Phòng {room.number} ({room.housekeepingStatus === 'clean' ? 'Sạch' : room.housekeepingStatus === 'inspected' ? 'Đã kiểm tra' : room.housekeepingStatus})
                        </Select.Option>
                    ))}
                </Select>
                {availableRooms.length === 0 && (
                    <p style={{ color: "#faad14", marginTop: 8 }}>
                        Không có phòng trống cho loại phòng này. Hệ thống sẽ tự động tìm phòng phù hợp.
                    </p>
                )}
            </Modal>

            {/* Check-out Modal */}
            <Modal
                title="Check-out khách hàng"
                open={checkOutModalVisible}
                onOk={handleCheckOut}
                onCancel={() => setCheckOutModalVisible(false)}
                okText="Xác nhận Check-out"
                cancelText="Hủy"
                confirmLoading={actionLoading}
                okButtonProps={{ style: { backgroundColor: "#faad14", borderColor: "#faad14" } }}
                width={500}
            >
                <div>
                    <p><strong>Khách hàng:</strong> {record.guest?.name}</p>
                    <p><strong>Mã đặt phòng:</strong> {record.confirmationCode}</p>
                    <p><strong>Phòng:</strong> {record.assignedRoom?.number ? `Phòng ${record.assignedRoom.number}` : "Chưa gán"}</p>
                </div>
                
                <Divider />
                
                <Title level={5} style={{ marginTop: 0 }}>Chi tiết hóa đơn</Title>
                <div style={{ background: '#fafafa', padding: 12, borderRadius: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>Tiền phòng:</span>
                        <span>{formatCurrency(roomAmount)}</span>
                    </div>
                    {reservationServices.length > 0 && (
                        <>
                            <div style={{ borderTop: '1px dashed #ddd', paddingTop: 8, marginTop: 8 }}>
                                <strong>Dịch vụ sử dụng:</strong>
                            </div>
                            {reservationServices.map((service) => (
                                <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 12, fontSize: 13, color: '#666' }}>
                                    <span>{getServiceName(service)} x{service.quantity}</span>
                                    <span>{formatCurrency(service.totalPrice)}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px dashed #ddd' }}>
                                <span>Tổng tiền dịch vụ:</span>
                                <span>{formatCurrency(totalServicesAmount)}</span>
                            </div>
                        </>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '2px solid #1890ff' }}>
                        <strong style={{ fontSize: 16 }}>TỔNG CỘNG:</strong>
                        <strong style={{ fontSize: 18, color: '#3f8600' }}>{formatCurrency(grandTotal)}</strong>
                    </div>
                </div>

                <div style={{ marginTop: 16 }}>
                    <p><strong>Trạng thái thanh toán:</strong> {record.paymentStatus === 'paid' ? '✅ Đã thanh toán' : record.paymentStatus === 'partial' ? '⚠️ Thanh toán một phần' : '❌ Chưa thanh toán'}</p>
                </div>

                <div style={{ marginTop: 16, padding: 12, background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 4 }}>
                    <p style={{ margin: 0, color: "#d48806" }}>
                        ⚠️ Sau khi check-out, phòng sẽ được chuyển sang trạng thái cần dọn dẹp.
                    </p>
                </div>
            </Modal>

            {/* Add Service Modal */}
            <Modal
                title="Thêm dịch vụ cho khách"
                open={addServiceModalVisible}
                onOk={handleAddService}
                onCancel={closeAddServiceModal}
                okText="Thêm dịch vụ"
                cancelText="Hủy"
                confirmLoading={servicesLoading}
                okButtonProps={{ disabled: !selectedPropertyServiceId }}
            >
                {propertyServices.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#faad14' }}>
                        <p>⚠️ Không có dịch vụ nào được cấu hình.</p>
                        <p>Vui lòng thêm dịch vụ trong phần "Property Services" trước.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8 }}><strong>Chọn dịch vụ:</strong></label>
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Chọn dịch vụ..."
                                value={selectedPropertyServiceId}
                                onChange={setSelectedPropertyServiceId}
                                showSearch
                                optionFilterProp="label"
                                options={propertyServices.map((ps) => ({
                                    value: ps.id,
                                    label: `${ps.service?.name || 'Dịch vụ'} - ${formatCurrency(ps.price)}/${ps.service?.unit || 'lần'}`,
                                }))}
                            />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8 }}><strong>Số lượng:</strong></label>
                            <InputNumber
                                style={{ width: "100%" }}
                                min={1}
                                value={serviceQuantity}
                                onChange={(val) => setServiceQuantity(val || 1)}
                            />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8 }}><strong>Ngày sử dụng:</strong></label>
                            <DatePicker
                                style={{ width: "100%" }}
                                value={serviceDate}
                                onChange={setServiceDate}
                                format="DD/MM/YYYY"
                            />
                        </div>

                        {selectedPropertyServiceId && (
                            <div style={{ background: '#f6ffed', padding: 12, borderRadius: 4, border: '1px solid #b7eb8f' }}>
                                {(() => {
                                    const selected = propertyServices.find(ps => ps.id === selectedPropertyServiceId);
                                    if (!selected) return null;
                                    const unitPrice = Number(selected.price) || 0;
                                    const taxRate = Number(selected.taxRate) || 0;
                                    const tax = unitPrice * serviceQuantity * taxRate / 100;
                                    const total = unitPrice * serviceQuantity + tax;
                                    return (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Đơn giá:</span>
                                                <span>{formatCurrency(unitPrice)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Số lượng:</span>
                                                <span>x{serviceQuantity}</span>
                                            </div>
                                            {taxRate > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Thuế ({taxRate}%):</span>
                                                    <span>{formatCurrency(tax)}</span>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #b7eb8f' }}>
                                                <strong>Thành tiền:</strong>
                                                <strong style={{ color: '#3f8600' }}>{formatCurrency(total)}</strong>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </Show>
    );
};
