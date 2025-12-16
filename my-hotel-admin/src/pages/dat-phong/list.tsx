import { useTable, List, DateField } from "@refinedev/antd";
import { Table, Space, Button, Tag, Modal, Typography } from "antd";
import { EyeOutlined, EditOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigation, useCan, useUpdate } from "@refinedev/core";
import { useState } from "react";

const { Text } = Typography;

export const DatPhongList: React.FC = () => {
    const { show, edit } = useNavigation();
    const { mutate: updateReservation } = useUpdate();
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<any>(null);

    const { tableProps } = useTable({
        resource: "reservations",
        syncWithLocation: true,
    });

    // Kiểm tra permissions
    const { data: canEdit } = useCan({
        resource: "dat-phong",
        action: "edit",
    });

    const { data: canCreate } = useCan({
        resource: "dat-phong",
        action: "create",
    });

    const { data: canCancel } = useCan({
        resource: "dat-phong",
        action: "delete",
    });

    const handleCancelClick = (record: any) => {
        setSelectedReservation(record);
        setCancelModalVisible(true);
    };

    const handleConfirmCancel = () => {
        if (selectedReservation) {
            updateReservation({
                resource: "reservations",
                id: selectedReservation.id,
                values: {
                    status: "cancelled",
                },
                successNotification: {
                    message: "Đã hủy đặt phòng thành công",
                    type: "success",
                },
            });
            setCancelModalVisible(false);
            setSelectedReservation(null);
        }
    };

    const statusColors: Record<string, string> = {
        pending: "orange",
        confirmed: "blue",
        checked_in: "green",
        checked_out: "default",
        cancelled: "red",
    };

    const statusLabels: Record<string, string> = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        checked_in: "Đã check-in",
        checked_out: "Đã check-out",
        cancelled: "Đã hủy",
    };

    return (
        <List
            title="Danh sách đặt phòng"
            canCreate={canCreate?.can}
            createButtonProps={{
                children: "Tạo đặt phòng mới",
            }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Mã đặt phòng"
                    dataIndex="confirmationCode"
                    key="confirmationCode"
                />
                <Table.Column
                    title="Tên khách"
                    dataIndex={["guest", "fullName"]}
                    key="guestName"
                />
                <Table.Column
                    title="Loại phòng"
                    dataIndex={["roomType", "name"]}
                    key="roomType"
                />
                <Table.Column
                    title="Số phòng"
                    dataIndex={["room", "roomNumber"]}
                    key="roomNumber"
                />
                <Table.Column
                    title="Ngày check-in"
                    dataIndex="checkInDate"
                    key="checkInDate"
                    render={(value) => (
                        <DateField value={value} format="DD/MM/YYYY" />
                    )}
                />
                <Table.Column
                    title="Ngày check-out"
                    dataIndex="checkOutDate"
                    key="checkOutDate"
                    render={(value) => (
                        <DateField value={value} format="DD/MM/YYYY" />
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
                    title="Tổng tiền"
                    dataIndex="totalAmount"
                    key="totalAmount"
                    render={(value: number) => (
                        <span>{value?.toLocaleString("vi-VN")} VNĐ</span>
                    )}
                />
                <Table.Column
                    title="Thao tác"
                    key="actions"
                    render={(_, record: any) => (
                        <Space>
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => show("reservations", record.id)}
                            >
                                Xem
                            </Button>
                            {canEdit?.can && record.status !== "cancelled" && (
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => edit("reservations", record.id)}
                                >
                                    Sửa
                                </Button>
                            )}
                            {canCancel?.can &&
                                record.status !== "cancelled" &&
                                record.status !== "checked_out" && (
                                    <Button
                                        size="small"
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => handleCancelClick(record)}
                                    >
                                        Hủy
                                    </Button>
                                )}
                        </Space>
                    )}
                />
            </Table>

            {/* Cancel Confirmation Modal */}
            <Modal
                title="Xác nhận hủy đặt phòng"
                open={cancelModalVisible}
                onOk={handleConfirmCancel}
                onCancel={() => {
                    setCancelModalVisible(false);
                    setSelectedReservation(null);
                }}
                okText="Xác nhận hủy"
                okButtonProps={{ danger: true }}
                cancelText="Đóng"
            >
                <div style={{ marginBottom: 16 }}>
                    <Text>Bạn có chắc chắn muốn hủy đặt phòng này?</Text>
                </div>
                {selectedReservation && (
                    <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                        <div><Text strong>Mã đặt phòng:</Text> {selectedReservation.confirmationCode}</div>
                        <div><Text strong>Khách hàng:</Text> {selectedReservation.guest?.fullName}</div>
                        <div><Text strong>Phòng:</Text> {selectedReservation.roomType?.name}</div>
                    </div>
                )}
                <div style={{ marginTop: 16, padding: 12, background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 4 }}>
                    <Text type="warning">
                        ⚠️ Hành động này không thể hoàn tác. Đặt phòng sẽ bị hủy vĩnh viễn.
                    </Text>
                </div>
            </Modal>
        </List>
    );
};
