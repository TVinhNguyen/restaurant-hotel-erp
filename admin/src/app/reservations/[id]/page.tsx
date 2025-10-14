"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Card,
    Descriptions,
    Button,
    Space,
    message,
    Row,
    Col,
    Typography,
    Tag,
    Divider,
    Table,
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Spin,
} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    PrinterOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Payment {
    id: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    transactionId: string;
    paidAt: string;
    notes: string;
}

interface ReservationService {
    id: string;
    propertyServiceId: string;
    serviceName: string;
    quantity: number;
    totalPrice: number;
    dateProvided: string;
}

interface Reservation {
    id: string;
    propertyId: string;
    propertyName: string;
    guestId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomTypeId: string;
    roomTypeName: string;
    assignedRoomId: string | null;
    assignedRoomNumber: string | null;
    ratePlanId: string;
    ratePlanName: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    confirmationCode: string;
    channel: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    taxAmount: number;
    discountAmount: number;
    serviceAmount: number;
    amountPaid: number;
    currency: string;
    guestNotes: string;
    createdAt: string;
    updatedAt: string;
    payments: Payment[];
    services: ReservationService[];
}

const statusColors = {
    pending: 'orange',
    confirmed: 'blue',
    checked_in: 'green',
    checked_out: 'default',
    cancelled: 'red',
    no_show: 'red',
};

const paymentStatusColors = {
    unpaid: 'red',
    partial: 'orange',
    paid: 'green',
    refunded: 'purple',
};

export default function ViewReservationPage() {
    const params = useParams();
    const router = useRouter();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [assignRoomModalVisible, setAssignRoomModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [paymentForm] = Form.useForm();

    useEffect(() => {
        if (params.id) {
            fetchReservation(params.id as string);
        }
    }, [params.id]);

    const fetchReservation = async (id: string) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        setLoading(true);

        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                setReservation({
                    id: data.id,
                    propertyId: data.propertyId,
                    propertyName: data.property?.name || '',
                    guestId: data.guestId,
                    guestName: data.guest?.name || '',
                    guestEmail: data.guest?.email || '',
                    guestPhone: data.guest?.phone || '',
                    roomTypeId: data.roomTypeId,
                    roomTypeName: data.roomType?.name || '',
                    assignedRoomId: data.assignedRoomId,
                    assignedRoomNumber: data.assignedRoom?.number || null,
                    ratePlanId: data.ratePlanId,
                    ratePlanName: data.ratePlan?.name || '',
                    checkIn: data.checkIn,
                    checkOut: data.checkOut,
                    adults: data.adults,
                    children: data.children,
                    contactName: data.contactName,
                    contactEmail: data.contactEmail,
                    contactPhone: data.contactPhone,
                    confirmationCode: data.confirmationCode,
                    channel: data.channel,
                    status: data.status,
                    paymentStatus: data.paymentStatus,
                    totalAmount: parseFloat(data.totalAmount || 0),
                    taxAmount: parseFloat(data.taxAmount || 0),
                    discountAmount: parseFloat(data.discountAmount || 0),
                    serviceAmount: parseFloat(data.serviceAmount || 0),
                    amountPaid: parseFloat(data.amountPaid || 0),
                    currency: data.currency,
                    guestNotes: data.guestNotes,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    payments: data.payments || [],
                    services: data.reservationServices || [],
                });
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error loading reservation');
                router.push('/reservations');
            }
        } catch (error) {
            console.error('Error fetching reservation:', error);
            message.error('Error loading reservation');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

        // If no room assigned, show modal to assign room first
        if (!reservation?.assignedRoomId) {
            Modal.confirm({
                title: 'Room Assignment Required',
                content: 'Please assign a room before checking in. Would you like to assign a room now?',
                okText: 'Assign Room',
                cancelText: 'Cancel',
                onOk: () => {
                    showAssignRoomModal();
                }
            });
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${params.id}/checkin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    roomId: reservation.assignedRoomId 
                })
            });

            if (response.ok) {
                message.success('Check-in successful!');
                fetchReservation(params.id as string);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error during check-in!');
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            message.error('Error during check-in!');
        }
    };

    const handleCheckOut = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${params.id}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                message.success('Check-out successful!');
                fetchReservation(params.id as string);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error during check-out!');
            }
        } catch (error) {
            console.error('Error during check-out:', error);
            message.error('Error during check-out!');
        }
    };

    const handleCancel = async () => {
        Modal.confirm({
            title: 'Cancel Reservation',
            content: 'Are you sure you want to cancel this reservation?',
            okText: 'Yes, Cancel',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

                try {
                    const response = await fetch(`${API_ENDPOINT}/reservations/${params.id}/cancel`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        message.success('Reservation cancelled successfully!');
                        fetchReservation(params.id as string);
                    } else {
                        const errorData = await response.json();
                        message.error(errorData.message || 'Error cancelling reservation!');
                    }
                } catch (error) {
                    console.error('Error cancelling reservation:', error);
                    message.error('Error cancelling reservation!');
                }
            },
        });
    };

    const showAssignRoomModal = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            // Fetch available rooms for the room type
            const response = await fetch(
                `${API_ENDPOINT}/rooms?propertyId=${reservation?.propertyId}&roomTypeId=${reservation?.roomTypeId}&operationalStatus=available`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                setAvailableRooms(result.data);
                setAssignRoomModalVisible(true);
            } else {
                message.error('Error loading available rooms');
            }
        } catch (error) {
            console.error('Error fetching available rooms:', error);
            message.error('Error loading available rooms');
        }
    };

    const handleAssignRoom = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

        try {
            const response = await fetch(`${API_ENDPOINT}/reservations/${params.id}/room`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId: values.roomId }),
            });

            if (response.ok) {
                message.success('Room assigned successfully!');
                setAssignRoomModalVisible(false);
                form.resetFields();
                fetchReservation(params.id as string);
                
                // If reservation is confirmed, suggest check-in
                if (reservation?.status === 'confirmed') {
                    Modal.confirm({
                        title: 'Check-in Now?',
                        content: 'Room assigned successfully. Would you like to check-in this guest now?',
                        okText: 'Yes, Check-in',
                        cancelText: 'Not Now',
                        onOk: () => {
                            handleCheckIn();
                        }
                    });
                }
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error assigning room!');
            }
        } catch (error) {
            console.error('Error assigning room:', error);
            message.error('Error assigning room!');
        }
    };

    const handleAddPayment = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

        try {
            const response = await fetch(`${API_ENDPOINT}/payments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservationId: params.id,
                    amount: values.amount,
                    currency: reservation?.currency,
                    method: values.method,
                    status: 'captured',
                    notes: values.notes,
                }),
            });

            if (response.ok) {
                message.success('Payment added successfully!');
                setPaymentModalVisible(false);
                paymentForm.resetFields();
                fetchReservation(params.id as string);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error adding payment!');
            }
        } catch (error) {
            console.error('Error adding payment:', error);
            message.error('Error adding payment!');
        }
    };

    const paymentColumns = [
        {
            title: 'Date',
            dataIndex: 'paidAt',
            key: 'paidAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record: Payment) => `${amount.toFixed(2)} ${record.currency}`,
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            render: (method: string) => <Tag>{method.toUpperCase()}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color="green">{status.toUpperCase()}</Tag>,
        },
        {
            title: 'Transaction ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
        },
    ];

    const serviceColumns = [
        {
            title: 'Service',
            dataIndex: 'serviceName',
            key: 'serviceName',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price: number) => `${price.toFixed(2)} ${reservation?.currency}`,
        },
        {
            title: 'Date Provided',
            dataIndex: 'dateProvided',
            key: 'dateProvided',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
    ];

    if (loading || !reservation) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    const nights = dayjs(reservation.checkOut).diff(dayjs(reservation.checkIn), 'days');
    const balance = reservation.totalAmount - reservation.amountPaid;

    return (
        <div>
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                    <Col>
                        <Title level={3}>
                            Reservation Details
                        </Title>
                        <Text type="secondary">Confirmation Code: {reservation.confirmationCode}</Text>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push('/reservations')}
                            >
                                Back
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => router.push(`/reservations/${params.id}/edit`)}
                            >
                                Edit
                            </Button>
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={() => window.print()}
                            >
                                Print
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Status and Action Buttons */}
                <Card style={{ marginBottom: 16, backgroundColor: '#f0f2f5' }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space size="large">
                                <div>
                                    <Text type="secondary">Status:</Text>
                                    <br />
                                    <Tag color={statusColors[reservation.status as keyof typeof statusColors]} style={{ fontSize: 14 }}>
                                        {reservation.status.toUpperCase().replace('_', ' ')}
                                    </Tag>
                                </div>
                                <div>
                                    <Text type="secondary">Payment Status:</Text>
                                    <br />
                                    <Tag color={paymentStatusColors[reservation.paymentStatus as keyof typeof paymentStatusColors]} style={{ fontSize: 14 }}>
                                        {reservation.paymentStatus.toUpperCase()}
                                    </Tag>
                                </div>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                {reservation.status === 'confirmed' && (
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={handleCheckIn}
                                    >
                                        Check-in
                                    </Button>
                                )}
                                {reservation.status === 'checked_in' && (
                                    <Button
                                        type="primary"
                                        onClick={handleCheckOut}
                                    >
                                        Check-out
                                    </Button>
                                )}
                                {!reservation.assignedRoomId && ['confirmed', 'checked_in'].includes(reservation.status) && (
                                    <Button
                                        icon={<HomeOutlined />}
                                        onClick={showAssignRoomModal}
                                    >
                                        Assign Room
                                    </Button>
                                )}
                                {['pending', 'confirmed'].includes(reservation.status) && (
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                {reservation.paymentStatus !== 'paid' && reservation.status !== 'cancelled' && (
                                    <Button
                                        type="primary"
                                        icon={<DollarOutlined />}
                                        onClick={() => setPaymentModalVisible(true)}
                                    >
                                        Add Payment
                                    </Button>
                                )}
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Guest Information */}
                <Divider orientation="left">Guest Information</Divider>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Guest Name">{reservation.guestName}</Descriptions.Item>
                    <Descriptions.Item label="Channel">
                        <Tag>{reservation.channel.toUpperCase()}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">{reservation.guestEmail}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{reservation.guestPhone}</Descriptions.Item>
                    <Descriptions.Item label="Contact Name">{reservation.contactName}</Descriptions.Item>
                    <Descriptions.Item label="Contact Email">{reservation.contactEmail}</Descriptions.Item>
                    <Descriptions.Item label="Contact Phone" span={2}>{reservation.contactPhone}</Descriptions.Item>
                </Descriptions>

                {/* Booking Information */}
                <Divider orientation="left">Booking Information</Divider>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Property">{reservation.propertyName}</Descriptions.Item>
                    <Descriptions.Item label="Room Type">{reservation.roomTypeName}</Descriptions.Item>
                    <Descriptions.Item label="Assigned Room">
                        {reservation.assignedRoomNumber ? (
                            <Text strong>{reservation.assignedRoomNumber}</Text>
                        ) : (
                            <Text type="secondary">Not assigned</Text>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Rate Plan">{reservation.ratePlanName}</Descriptions.Item>
                    <Descriptions.Item label="Check-in">
                        {dayjs(reservation.checkIn).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Check-out">
                        {dayjs(reservation.checkOut).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nights">
                        <Text strong>{nights} night(s)</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Guests">
                        {reservation.adults} Adult(s) + {reservation.children} Child(ren)
                    </Descriptions.Item>
                    {reservation.guestNotes && (
                        <Descriptions.Item label="Guest Notes" span={2}>
                            {reservation.guestNotes}
                        </Descriptions.Item>
                    )}
                </Descriptions>

                {/* Financial Information */}
                <Divider orientation="left">Financial Information</Divider>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Total Amount">
                        <Text strong style={{ fontSize: 16 }}>
                            {reservation.totalAmount.toFixed(2)} {reservation.currency}
                        </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tax Amount">
                        {reservation.taxAmount.toFixed(2)} {reservation.currency}
                    </Descriptions.Item>
                    <Descriptions.Item label="Discount Amount">
                        {reservation.discountAmount.toFixed(2)} {reservation.currency}
                    </Descriptions.Item>
                    <Descriptions.Item label="Service Amount">
                        {reservation.serviceAmount.toFixed(2)} {reservation.currency}
                    </Descriptions.Item>
                    <Descriptions.Item label="Amount Paid">
                        <Text type="success" strong style={{ fontSize: 16 }}>
                            {reservation.amountPaid.toFixed(2)} {reservation.currency}
                        </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Balance">
                        <Text type={balance > 0 ? "danger" : "success"} strong style={{ fontSize: 16 }}>
                            {balance.toFixed(2)} {reservation.currency}
                        </Text>
                    </Descriptions.Item>
                </Descriptions>

                {/* Payment History */}
                {reservation.payments && reservation.payments.length > 0 && (
                    <>
                        <Divider orientation="left">Payment History</Divider>
                        <Table
                            columns={paymentColumns}
                            dataSource={reservation.payments}
                            rowKey="id"
                            pagination={false}
                        />
                    </>
                )}

                {/* Services */}
                {reservation.services && reservation.services.length > 0 && (
                    <>
                        <Divider orientation="left">Additional Services</Divider>
                        <Table
                            columns={serviceColumns}
                            dataSource={reservation.services}
                            rowKey="id"
                            pagination={false}
                        />
                    </>
                )}

                {/* System Information */}
                <Divider orientation="left">System Information</Divider>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Created At">
                        {dayjs(reservation.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(reservation.updatedAt).format('DD/MM/YYYY HH:mm')}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Assign Room Modal */}
            <Modal
                title="Assign Room"
                open={assignRoomModalVisible}
                onCancel={() => setAssignRoomModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAssignRoom} layout="vertical">
                    <Form.Item
                        label="Select Room"
                        name="roomId"
                        rules={[{ required: true, message: 'Please select a room!' }]}
                    >
                        <Select placeholder="Select available room">
                            {availableRooms.map(room => (
                                <Select.Option key={room.id} value={room.id}>
                                    Room {room.number} - Floor {room.floor} ({room.viewType})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Assign
                            </Button>
                            <Button onClick={() => setAssignRoomModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Payment Modal */}
            <Modal
                title="Add Payment"
                open={paymentModalVisible}
                onCancel={() => setPaymentModalVisible(false)}
                footer={null}
            >
                <Form
                    form={paymentForm}
                    onFinish={handleAddPayment}
                    layout="vertical"
                    initialValues={{
                        method: 'cash',
                    }}
                >
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[
                            { required: true, message: 'Please enter amount!' },
                            { type: 'number', min: 0.01, message: 'Amount must be greater than 0!' }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            max={balance}
                            precision={2}
                            addonAfter={reservation.currency}
                        />
                    </Form.Item>
                    <Text type="secondary">Remaining balance: {balance.toFixed(2)} {reservation.currency}</Text>
                    
                    <Form.Item
                        label="Payment Method"
                        name="method"
                        rules={[{ required: true }]}
                        style={{ marginTop: 16 }}
                    >
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="card">Card</Select.Option>
                            <Select.Option value="bank">Bank Transfer</Select.Option>
                            <Select.Option value="e_wallet">E-Wallet</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label="Notes" name="notes">
                        <TextArea rows={3} />
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<DollarOutlined />}>
                                Add Payment
                            </Button>
                            <Button onClick={() => setPaymentModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
