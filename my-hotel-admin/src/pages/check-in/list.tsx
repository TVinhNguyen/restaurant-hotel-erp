import { List, DateField, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Card, Row, Col, Typography } from "antd";
import { CheckCircleOutlined, UserOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigation, useCan } from "@refinedev/core";
import dayjs from "dayjs";

const { Text } = Typography;

export const CheckInList: React.FC = () => {
    const { show } = useNavigation();

    // Check permissions
    const { data: canCheckIn } = useCan({
        resource: "check-in",
        action: "create",
    });

    // Fetch reservations cần check-in hôm nay
    const { tableProps } = useTable({
        resource: "reservations",
        syncWithLocation: true,
        filters: {
            permanent: [
                {
                    field: "checkInDate",
                    operator: "eq",
                    value: dayjs().format("YYYY-MM-DD"),
                },
                {
                    field: "status",
                    operator: "in",
                    value: ["confirmed"],
                },
            ],
        },
    });

    const handleCheckIn = (record: any) => {
        // Navigate to check-in form
        show("reservations", record.id, "replace");
    };

    const statusColors: Record<string, string> = {
        pending: "orange",
        confirmed: "blue",
        checked_in: "green",
    };

    const statusLabels: Record<string, string> = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        checked_in: "Đã check-in",
    };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <CheckCircleOutlined style={{ fontSize: 32, color: "#52c41a" }} />
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Cần check-in hôm nay</Text>
                                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                                    {(tableProps.dataSource as any)?.length || 0}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <List
                title="Danh sách khách cần Check-in hôm nay"
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
                        title="Số điện thoại"
                        dataIndex={["guest", "phone"]}
                        key="phone"
                    />
                    <Table.Column
                        title="Loại phòng"
                        dataIndex={["roomType", "name"]}
                        key="roomType"
                        render={(value, record: any) => (
                            <Space direction="vertical" size={0}>
                                <Space>
                                    <HomeOutlined />
                                    <Text>{value}</Text>
                                </Space>
                                {record.room?.roomNumber && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Phòng số: {record.room.roomNumber}
                                    </Text>
                                )}
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Thời gian lưu trú"
                        key="duration"
                        render={(_, record: any) => (
                            <Space direction="vertical" size={0}>
                                <Text>
                                    Check-in: <DateField value={record.checkInDate} format="DD/MM/YYYY" />
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
                        title="Số khách"
                        key="guests"
                        render={(_, record: any) => (
                            <Text>
                                {record.numberOfAdults} người lớn
                                {record.numberOfChildren > 0 && `, ${record.numberOfChildren} trẻ em`}
                            </Text>
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
                                {canCheckIn?.can && record.status === "confirmed" && (
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => handleCheckIn(record)}
                                    >
                                        Check-in
                                    </Button>
                                )}
                                {record.status === "checked_in" && (
                                    <Tag color="success">Đã check-in</Tag>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </List>
        </div>
    );
};
