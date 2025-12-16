import { List, DateField, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Card, Row, Col, Typography, Modal, Descriptions } from "antd";
import { LogoutOutlined, UserOutlined, HomeOutlined, DollarOutlined } from "@ant-design/icons";
import { useNavigation, useCan, useCustom } from "@refinedev/core";
import { useState } from "react";
import dayjs from "dayjs";

const { Text } = Typography;

export const CheckOutList: React.FC = () => {
    const { show } = useNavigation();
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<any>(null);

    // Check permissions
    const { data: canCheckOut } = useCan({
        resource: "check-out",
        action: "create",
    });

    // Fetch reservations cần check-out hôm nay
    const { tableProps } = useTable({
        resource: "reservations",
        syncWithLocation: true,
        filters: {
            permanent: [
                {
                    field: "checkOutDate",
                    operator: "eq",
                    value: dayjs().format("YYYY-MM-DD"),
                },
                {
                    field: "status",
                    operator: "in",
                    value: ["checked_in"],
                },
            ],
        },
    });

    const handleCheckOut = (record: any) => {
        setSelectedReservation(record);
        setCheckoutModalVisible(true);
    };

    const handleConfirmCheckOut = async () => {
        // Call API to check-out
        // TODO: Implement API call
        console.log("Check-out reservation:", selectedReservation);
        setCheckoutModalVisible(false);
        setSelectedReservation(null);
    };

    const statusColors: Record<string, string> = {
        checked_in: "green",
        checked_out: "default",
    };

    const statusLabels: Record<string, string> = {
        checked_in: "Đã check-in",
        checked_out: "Đã check-out",
    };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <LogoutOutlined style={{ fontSize: 32, color: "#faad14" }} />
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Cần check-out hôm nay</Text>
                                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                                    {(tableProps.dataSource as any)?.length || 0}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <List
                title="Danh sách khách cần Check-out hôm nay"
                canCreate={false}
            >
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        title="Mã đặt phòng"
                        dataIndex="confirmationCode"
                        key="confirmationCode"
                        render={(value) => (
                            <Text strong>{value}</Text>
                        )}
                    />
                    <Table.Column
                        title="Tên khách"
                        dataIndex={["guest", "fullName"]}
                        key="guestName"
                        render={(value, record: any) => (
                            <Space>
                                <UserOutlined />
                                <div>
                                    <div>{value}</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {record.guest?.email}
                                    </Text>
                                </div>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Phòng"
                        dataIndex={["room", "roomNumber"]}
                        key="room"
                        render={(value, record: any) => (
                            <Space direction="vertical" size={0}>
                                <Space>
                                    <HomeOutlined />
                                    <Text>Phòng {value}</Text>
                                </Space>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {record.roomType?.name}
                                </Text>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Thời gian lưu trú"
                        key="duration"
                        render={(_, record: any) => (
                            <Space direction="vertical" size={0}>
                                <Text>
                                    Check-in: <DateField value={record.checkInDate} format="DD/MM/YYYY HH:mm" />
                                </Text>
                                <Text>
                                    Check-out: <DateField value={record.checkOutDate} format="DD/MM/YYYY" />
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    ({dayjs(record.checkOutDate).diff(dayjs(record.checkInDate), 'day')} đêm)
                                </Text>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Tổng tiền"
                        dataIndex="totalAmount"
                        key="totalAmount"
                        render={(value: number) => (
                            <Space>
                                <DollarOutlined />
                                <Text strong style={{ color: "#3f8600" }}>
                                    {value?.toLocaleString("vi-VN")} VNĐ
                                </Text>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Trạng thái thanh toán"
                        key="paymentStatus"
                        render={(_, record: any) => (
                            <Tag color={record.paymentStatus === "paid" ? "success" : "warning"}>
                                {record.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                            </Tag>
                        )}
                    />
                    <Table.Column
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(status: string) => (
                            <Tag color={statusColors[status]}>
                                {statusLabels[status] || status}
                            </Tag>
                        )}
                    />
                    <Table.Column
                        title="Thao tác"
                        key="actions"
                        render={(_, record: any) => (
                            <Space>
                                {canCheckOut?.can && record.status === "checked_in" && (
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<LogoutOutlined />}
                                        onClick={() => handleCheckOut(record)}
                                    >
                                        Check-out
                                    </Button>
                                )}
                                {record.status === "checked_out" && (
                                    <Tag color="default">Đã check-out</Tag>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </List>

            {/* Check-out Modal */}
            <Modal
                title="Xác nhận Check-out"
                open={checkoutModalVisible}
                onOk={handleConfirmCheckOut}
                onCancel={() => setCheckoutModalVisible(false)}
                okText="Xác nhận Check-out"
                cancelText="Hủy"
                width={700}
            >
                {selectedReservation && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mã đặt phòng">
                            {selectedReservation.confirmationCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên khách">
                            {selectedReservation.guest?.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phòng">
                            Phòng {selectedReservation.room?.roomNumber} - {selectedReservation.roomType?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian lưu trú">
                            {dayjs(selectedReservation.checkInDate).format("DD/MM/YYYY HH:mm")} - {dayjs(selectedReservation.checkOutDate).format("DD/MM/YYYY")}
                            <br />
                            <Text type="secondary">
                                ({dayjs(selectedReservation.checkOutDate).diff(dayjs(selectedReservation.checkInDate), 'day')} đêm)
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">
                            <Text strong style={{ color: "#3f8600", fontSize: 18 }}>
                                {selectedReservation.totalAmount?.toLocaleString("vi-VN")} VNĐ
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái thanh toán">
                            <Tag color={selectedReservation.paymentStatus === "paid" ? "success" : "warning"}>
                                {selectedReservation.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
                {selectedReservation?.paymentStatus !== "paid" && (
                    <div style={{ marginTop: 16, padding: 12, background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 4 }}>
                        <Text type="warning">
                            ⚠️ Khách chưa thanh toán. Vui lòng thu tiền trước khi check-out.
                        </Text>
                    </div>
                )}
            </Modal>
        </div>
    );
};
