import { List, DateField, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Typography, Modal, Form, Input, Select, InputNumber } from "antd";
import { DollarOutlined, EyeOutlined, CheckCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigation, useCan } from "@refinedev/core";
import { useState } from "react";

const { Text } = Typography;

export const ThanhToanList: React.FC = () => {
    const { show } = useNavigation();
    const [form] = Form.useForm();
    const [processModalVisible, setProcessModalVisible] = useState(false);
    const [refundModalVisible, setRefundModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);

    // Check permissions
    const { data: canProcess } = useCan({
        resource: "thanh-toan",
        action: "create",
    });

    const { data: canRefund } = useCan({
        resource: "thanh-toan",
        action: "delete",
    });

    const { tableProps } = useTable({
        resource: "payments",
        syncWithLocation: true,
    });

    const handleProcessPayment = (record: any) => {
        setSelectedPayment(record);
        setProcessModalVisible(true);
        form.setFieldsValue({
            reservationId: record.reservation?.id,
            amount: record.amount,
            paymentMethod: "cash",
        });
    };

    const handleRefund = (record: any) => {
        setSelectedPayment(record);
        setRefundModalVisible(true);
        form.setFieldsValue({
            refundAmount: record.amount,
            refundReason: "",
        });
    };

    const handleConfirmProcess = async () => {
        const values = await form.validateFields();
        console.log("Process payment:", values);
        setProcessModalVisible(false);
        form.resetFields();
    };

    const handleConfirmRefund = async () => {
        const values = await form.validateFields();
        console.log("Refund payment:", values);
        setRefundModalVisible(false);
        form.resetFields();
    };

    const paymentStatusConfig: Record<string, { label: string; color: string }> = {
        pending: { label: "Chờ thanh toán", color: "orange" },
        paid: { label: "Đã thanh toán", color: "success" },
        partial: { label: "Thanh toán một phần", color: "processing" },
        refunded: { label: "Đã hoàn tiền", color: "default" },
        failed: { label: "Thất bại", color: "error" },
    };

    const paymentMethodLabels: Record<string, string> = {
        cash: "Tiền mặt",
        credit_card: "Thẻ tín dụng",
        debit_card: "Thẻ ghi nợ",
        bank_transfer: "Chuyển khoản",
        e_wallet: "Ví điện tử",
    };

    return (
        <div>
            <List
                title="Danh sách thanh toán"
                canCreate={canProcess?.can}
                createButtonProps={{
                    children: "Tạo thanh toán mới",
                }}
            >
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        title="Mã thanh toán"
                        dataIndex="id"
                        key="id"
                        render={(value) => (
                            <Text code>{value?.substring(0, 8)}</Text>
                        )}
                    />
                    <Table.Column
                        title="Mã đặt phòng"
                        dataIndex={["reservation", "confirmationCode"]}
                        key="reservationCode"
                        render={(value) => (
                            <Text strong>{value}</Text>
                        )}
                    />
                    <Table.Column
                        title="Khách hàng"
                        dataIndex={["reservation", "guest", "fullName"]}
                        key="guestName"
                    />
                    <Table.Column
                        title="Số tiền"
                        dataIndex="amount"
                        key="amount"
                        render={(value: number) => (
                            <Text strong style={{ color: "#3f8600", fontSize: 16 }}>
                                {value?.toLocaleString("vi-VN")} VNĐ
                            </Text>
                        )}
                        sorter
                    />
                    <Table.Column
                        title="Phương thức"
                        dataIndex="paymentMethod"
                        key="paymentMethod"
                        render={(method: string) => (
                            <Tag>{paymentMethodLabels[method] || method}</Tag>
                        )}
                        filters={[
                            { text: "Tiền mặt", value: "cash" },
                            { text: "Thẻ tín dụng", value: "credit_card" },
                            { text: "Thẻ ghi nợ", value: "debit_card" },
                            { text: "Chuyển khoản", value: "bank_transfer" },
                            { text: "Ví điện tử", value: "e_wallet" },
                        ]}
                    />
                    <Table.Column
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(status: string) => {
                            const config = paymentStatusConfig[status] || {
                                label: status,
                                color: "default",
                            };
                            return <Tag color={config.color}>{config.label}</Tag>;
                        }}
                        filters={[
                            { text: "Chờ thanh toán", value: "pending" },
                            { text: "Đã thanh toán", value: "paid" },
                            { text: "Thanh toán một phần", value: "partial" },
                            { text: "Đã hoàn tiền", value: "refunded" },
                            { text: "Thất bại", value: "failed" },
                        ]}
                    />
                    <Table.Column
                        title="Ngày thanh toán"
                        dataIndex="paidAt"
                        key="paidAt"
                        render={(value) =>
                            value ? <DateField value={value} format="DD/MM/YYYY HH:mm" /> : "-"
                        }
                        sorter
                    />
                    <Table.Column
                        title="Ghi chú"
                        dataIndex="notes"
                        key="notes"
                        render={(value) => (
                            <Text type="secondary" ellipsis style={{ maxWidth: 150 }}>
                                {value || "-"}
                            </Text>
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
                                    onClick={() => show("payments", record.id)}
                                >
                                    Xem
                                </Button>
                                {canProcess?.can && record.status === "pending" && (
                                    <Button
                                        size="small"
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => handleProcessPayment(record)}
                                    >
                                        Thanh toán
                                    </Button>
                                )}
                                {canRefund?.can && record.status === "paid" && (
                                    <Button
                                        size="small"
                                        danger
                                        icon={<RollbackOutlined />}
                                        onClick={() => handleRefund(record)}
                                    >
                                        Hoàn tiền
                                    </Button>
                                )}
                            </Space>
                        )}
                    />
                </Table>
            </List>

            {/* Process Payment Modal */}
            <Modal
                title="Xử lý thanh toán"
                open={processModalVisible}
                onOk={handleConfirmProcess}
                onCancel={() => {
                    setProcessModalVisible(false);
                    form.resetFields();
                }}
                okText="Xác nhận thanh toán"
                cancelText="Hủy"
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="amount"
                        label="Số tiền"
                        rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                            addonAfter="VNĐ"
                        />
                    </Form.Item>
                    <Form.Item
                        name="paymentMethod"
                        label="Phương thức thanh toán"
                        rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
                    >
                        <Select>
                            <Select.Option value="cash">💵 Tiền mặt</Select.Option>
                            <Select.Option value="credit_card">💳 Thẻ tín dụng</Select.Option>
                            <Select.Option value="debit_card">💳 Thẻ ghi nợ</Select.Option>
                            <Select.Option value="bank_transfer">🏦 Chuyển khoản</Select.Option>
                            <Select.Option value="e_wallet">📱 Ví điện tử</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="notes" label="Ghi chú">
                        <Input.TextArea rows={3} placeholder="Ghi chú thêm về thanh toán..." />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Refund Modal */}
            <Modal
                title="Hoàn tiền"
                open={refundModalVisible}
                onOk={handleConfirmRefund}
                onCancel={() => {
                    setRefundModalVisible(false);
                    form.resetFields();
                }}
                okText="Xác nhận hoàn tiền"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="refundAmount"
                        label="Số tiền hoàn lại"
                        rules={[{ required: true, message: "Vui lòng nhập số tiền hoàn lại" }]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                            addonAfter="VNĐ"
                        />
                    </Form.Item>
                    <Form.Item
                        name="refundReason"
                        label="Lý do hoàn tiền"
                        rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập lý do hoàn tiền..." />
                    </Form.Item>
                </Form>
                <div style={{ padding: 12, background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 4 }}>
                    <Text type="warning">
                        ⚠️ Hành động này không thể hoàn tác. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                    </Text>
                </div>
            </Modal>
        </div>
    );
};
