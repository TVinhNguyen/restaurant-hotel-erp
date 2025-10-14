"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Card,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Button,
    Space,
    message,
    Row,
    Col,
    Typography,
    Spin,
} from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;

interface Guest {
    id: string;
    name: string;
    email: string;
}

interface RoomType {
    id: string;
    name: string;
}

interface RatePlan {
    id: string;
    name: string;
    roomTypeId: string;
}

export default function EditReservationPage() {
    const [form] = Form.useForm();
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
    const [filteredRatePlans, setFilteredRatePlans] = useState<RatePlan[]>([]);

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchGuests(),
                fetchRoomTypes(),
                fetchRatePlans(),
            ]);
            if (params.id) {
                await fetchReservation(params.id as string);
            }
        };
        loadData();
    }, [params.id]);

    // Filter rate plans when rate plans data is loaded
    useEffect(() => {
        const roomTypeId = form.getFieldValue('roomTypeId');
        if (roomTypeId && ratePlans.length > 0) {
            const filtered = ratePlans.filter(rp => rp.roomTypeId === roomTypeId);
            setFilteredRatePlans(filtered);
        }
    }, [ratePlans]);

    const fetchGuests = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        try {
            const response = await fetch(`${API_ENDPOINT}/guests?limit=1000`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                const result = await response.json();
                setGuests(result.data);
            }
        } catch (error) {
            console.error('Error fetching guests:', error);
        }
    };

    const fetchRoomTypes = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        try {
            const response = await fetch(`${API_ENDPOINT}/room-types?propertyId=${propertyId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                const result = await response.json();
                setRoomTypes(result.data);
            }
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

    const fetchRatePlans = async () => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        try {
            const response = await fetch(`${API_ENDPOINT}/rate-plans?propertyId=${propertyId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                const result = await response.json();
                setRatePlans(result.data);
            }
        } catch (error) {
            console.error('Error fetching rate plans:', error);
        }
    };

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

                form.setFieldsValue({
                    guestId: data.guestId,
                    roomTypeId: data.roomTypeId,
                    ratePlanId: data.ratePlanId,
                    checkIn: dayjs(data.checkIn),
                    checkOut: dayjs(data.checkOut),
                    adults: data.adults,
                    children: data.children || 0,
                    contactName: data.contactName,
                    contactEmail: data.contactEmail,
                    contactPhone: data.contactPhone,
                    channel: data.channel,
                    guestNotes: data.guestNotes || '',
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

    const handleRoomTypeChange = (roomTypeId: string) => {
        const filtered = ratePlans.filter(rp => rp.roomTypeId === roomTypeId);
        setFilteredRatePlans(filtered);
        form.setFieldsValue({ ratePlanId: undefined });
    };

    const onFinish = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        setSaving(true);

        try {
            const payload = {
                guestId: values.guestId,
                roomTypeId: values.roomTypeId,
                ratePlanId: values.ratePlanId,
                checkIn: values.checkIn.format('YYYY-MM-DD'),
                checkOut: values.checkOut.format('YYYY-MM-DD'),
                adults: values.adults,
                children: values.children || 0,
                contactName: values.contactName,
                contactEmail: values.contactEmail,
                contactPhone: values.contactPhone,
                channel: values.channel,
                guestNotes: values.guestNotes || '',
            };

            const response = await fetch(`${API_ENDPOINT}/reservations/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success('Reservation updated successfully!');
                router.push(`/reservations/${params.id}`);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error updating reservation');
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
            message.error('Error updating reservation');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                    <Col>
                        <Title level={3}>Edit Reservation</Title>
                    </Col>
                    <Col>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.push(`/reservations/${params.id}`)}
                        >
                            Back
                        </Button>
                    </Col>
                </Row>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Guest"
                                name="guestId"
                                rules={[{ required: true, message: 'Please select a guest!' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Search and select guest"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={guests.map(guest => ({
                                        value: guest.id,
                                        label: `${guest.name} - ${guest.email}`,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Channel"
                                name="channel"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="ota">OTA</Select.Option>
                                    <Select.Option value="website">Website</Select.Option>
                                    <Select.Option value="walkin">Walk-in</Select.Option>
                                    <Select.Option value="phone">Phone</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Check-in"
                                name="checkIn"
                                rules={[{ required: true, message: 'Please select check-in date!' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Check-out"
                                name="checkOut"
                                rules={[
                                    { required: true, message: 'Please select check-out date!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const checkIn = getFieldValue('checkIn');
                                            if (!value || !checkIn || value.isAfter(checkIn)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Check-out must be after check-in!'));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                    disabledDate={(current) => {
                                        const checkIn = form.getFieldValue('checkIn');
                                        return current && checkIn && current <= checkIn;
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={12} md={6}>
                            <Form.Item
                                label="Adults"
                                name="adults"
                                rules={[
                                    { required: true, message: 'Please enter number of adults!' },
                                    { type: 'number', min: 1, message: 'At least 1 adult required!' }
                                ]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Item
                                label="Children"
                                name="children"
                                rules={[
                                    { type: 'number', min: 0, message: 'Children must be 0 or more!' }
                                ]}
                            >
                                <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Room Type"
                                name="roomTypeId"
                                rules={[{ required: true, message: 'Please select room type!' }]}
                            >
                                <Select
                                    placeholder="Select room type"
                                    onChange={handleRoomTypeChange}
                                >
                                    {roomTypes.map(rt => (
                                        <Select.Option key={rt.id} value={rt.id}>
                                            {rt.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Rate Plan"
                                name="ratePlanId"
                                rules={[{ required: true, message: 'Please select rate plan!' }]}
                            >
                                <Select
                                    placeholder="Select rate plan"
                                >
                                    {filteredRatePlans.map(rp => (
                                        <Select.Option key={rp.id} value={rp.id}>
                                            {rp.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Contact Name"
                                name="contactName"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Full name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Contact Email"
                                name="contactEmail"
                                rules={[
                                    { required: true },
                                    { type: 'email', message: 'Invalid email!' }
                                ]}
                            >
                                <Input placeholder="email@example.com" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Contact Phone"
                                name="contactPhone"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="+1234567890" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label="Guest Notes"
                                name="guestNotes"
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Special requests, preferences, etc."
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="end">
                        <Space>
                            <Button onClick={() => router.push(`/reservations/${params.id}`)}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={saving}
                            >
                                Save Changes
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}
