import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Card, Row, Col, Typography, InputNumber, Descriptions, Spin } from "antd";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

export const PhongEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [roomTypeInfo, setRoomTypeInfo] = useState<any>(null);

    const { formProps, saveButtonProps, query } = useForm({
        resource: "rooms",
        action: "edit",
        id: id,
        redirect: "show",
    });

    const roomData = query?.data?.data as any;
    const isLoading = query?.isLoading;

    // Fetch room types for select
    const { selectProps: roomTypeSelectProps, query: roomTypesQuery } = useSelect({
        resource: "room-types",
        optionLabel: "name",
        optionValue: "id",
        filters: roomData?.propertyId ? [
            {
                field: "propertyId",
                operator: "eq",
                value: roomData.propertyId,
            },
        ] : [],
        queryOptions: {
            enabled: !!roomData?.propertyId,
        },
    });

    // Update roomTypeInfo when roomTypeId changes
    useEffect(() => {
        if (roomData?.roomType) {
            setRoomTypeInfo(roomData.roomType);
        }
    }, [roomData]);

    // Handle room type change to show price info
    const handleRoomTypeChange = (roomTypeId: string) => {
        const roomTypes = roomTypesQuery?.data?.data || [];
        const selectedType = roomTypes.find((rt: any) => rt.id === roomTypeId);
        setRoomTypeInfo(selectedType);
    };

    const operationalStatusOptions = [
        { value: "available", label: "Trống - Sẵn sàng" },
        { value: "occupied", label: "Đang sử dụng" },
        { value: "maintenance", label: "Bảo trì" },
        { value: "out_of_service", label: "Ngừng hoạt động" },
    ];

    const housekeepingStatusOptions = [
        { value: "clean", label: "Sạch" },
        { value: "dirty", label: "Cần dọn dẹp" },
        { value: "inspected", label: "Đã kiểm tra" },
    ];

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Đang tải dữ liệu phòng...</div>
            </div>
        );
    }

    return (
        <Edit
            saveButtonProps={saveButtonProps}
            title={`Chỉnh sửa phòng ${roomData?.number || ''}`}
            headerButtons={({ defaultButtons }) => defaultButtons}
        >
            <Form
                {...formProps}
                layout="vertical"
            >
                <Row gutter={24}>
                    {/* Thông tin cơ bản */}
                    <Col span={12}>
                        <Card 
                            title={<Title level={5}>Thông tin cơ bản</Title>}
                            style={{ marginBottom: 16 }}
                        >
                            <Form.Item
                                label="Số phòng"
                                name="number"
                                rules={[{ required: true, message: "Vui lòng nhập số phòng" }]}
                            >
                                <Input placeholder="VD: 101, 201A..." />
                            </Form.Item>

                            <Form.Item
                                label="Tầng"
                                name="floor"
                                rules={[{ required: true, message: "Vui lòng nhập tầng" }]}
                            >
                                <Input placeholder="VD: 1, 2, 3..." />
                            </Form.Item>

                            <Form.Item
                                label="Loại phòng"
                                name="roomTypeId"
                                rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
                            >
                                <Select
                                    {...roomTypeSelectProps}
                                    placeholder="Chọn loại phòng"
                                    allowClear
                                    onChange={(value: any) => handleRoomTypeChange(String(value))}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Hướng view"
                                name="viewType"
                            >
                                <Input placeholder="VD: View biển, View thành phố..." />
                            </Form.Item>
                        </Card>

                        {/* Thông tin loại phòng - chỉ hiển thị */}
                        {roomTypeInfo && (
                            <Card 
                                title={<Title level={5}>Thông tin loại phòng</Title>}
                                style={{ marginBottom: 16, backgroundColor: "#fafafa" }}
                            >
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Tên loại phòng">
                                        <Text strong>{roomTypeInfo.name}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Giá phòng">
                                        <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                                            {parseFloat(roomTypeInfo.basePrice || 0).toLocaleString("vi-VN")} VNĐ/đêm
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Sức chứa">
                                        {roomTypeInfo.maxAdults} người lớn, {roomTypeInfo.maxChildren} trẻ em
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Loại giường">
                                        {roomTypeInfo.bedType || "Chưa cập nhật"}
                                    </Descriptions.Item>
                                    {roomTypeInfo.description && (
                                        <Descriptions.Item label="Mô tả">
                                            {roomTypeInfo.description}
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>
                                <div style={{ marginTop: 12, padding: 8, background: "#fff7e6", borderRadius: 4 }}>
                                    <Text type="warning" style={{ fontSize: 12 }}>
                                        💡 Để thay đổi giá phòng, vui lòng vào quản lý <strong>Loại phòng</strong>
                                    </Text>
                                </div>
                            </Card>
                        )}
                    </Col>

                    {/* Trạng thái */}
                    <Col span={12}>
                        <Card 
                            title={<Title level={5}>Trạng thái phòng</Title>}
                            style={{ marginBottom: 16 }}
                        >
                            <Form.Item
                                label="Trạng thái hoạt động"
                                name="operationalStatus"
                                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                            >
                                <Select
                                    options={operationalStatusOptions}
                                    placeholder="Chọn trạng thái hoạt động"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Trạng thái dọn phòng"
                                name="housekeepingStatus"
                            >
                                <Select
                                    options={housekeepingStatusOptions}
                                    placeholder="Chọn trạng thái dọn phòng"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú dọn phòng"
                                name="housekeeperNotes"
                            >
                                <Input.TextArea 
                                    rows={4} 
                                    placeholder="Ghi chú cho nhân viên dọn phòng..."
                                />
                            </Form.Item>
                        </Card>

                        {/* Thông tin bổ sung */}
                        <Card 
                            title={<Title level={5}>Thông tin khác</Title>}
                            style={{ marginBottom: 16 }}
                        >
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Khách sạn">
                                    {roomData?.property?.name || "N/A"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">
                                    {roomData?.property?.address}, {roomData?.property?.city}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>

                {/* Hidden fields to preserve data */}
                <Form.Item name="propertyId" hidden>
                    <Input />
                </Form.Item>
            </Form>
        </Edit>
    );
};
