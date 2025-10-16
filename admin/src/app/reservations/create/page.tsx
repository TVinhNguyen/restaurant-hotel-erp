"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    Divider,
    Steps,
    Radio,
} from "antd";
import { SaveOutlined, ArrowLeftOutlined, UserOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Guest {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface RoomType {
    id: string;
    name: string;
    basePrice: number;
    maxAdults: number;
    maxChildren: number;
}

interface RatePlan {
    id: string;
    name: string;
    roomTypeId: string;
    currency: string;
    isRefundable: boolean;
}

export default function CreateReservationPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
    const [filteredRatePlans, setFilteredRatePlans] = useState<RatePlan[]>([]);
    const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [guestMode, setGuestMode] = useState<'existing' | 'new'>('existing');

    useEffect(() => {
        fetchGuests();
        fetchRoomTypes();
        fetchRatePlans();
    }, []);

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

    const handleRoomTypeChange = (roomTypeId: string) => {
        const roomType = roomTypes.find(rt => rt.id === roomTypeId);
        setSelectedRoomType(roomType || null);
        
        // Filter rate plans by room type
        const filtered = ratePlans.filter(rp => rp.roomTypeId === roomTypeId);
        setFilteredRatePlans(filtered);
        
        // Reset rate plan selection
        form.setFieldsValue({ ratePlanId: undefined });
        
        // Calculate price
        calculatePrice();
    };

    const calculatePrice = () => {
        const values = form.getFieldsValue();
        const { checkIn, checkOut, roomTypeId } = values;
        
        if (checkIn && checkOut && roomTypeId) {
            const nights = checkOut.diff(checkIn, 'days');
            const roomType = roomTypes.find(rt => rt.id === roomTypeId);
            
            if (roomType && nights > 0) {
                const baseAmount = roomType.basePrice * nights;
                setCalculatedPrice(baseAmount);
            }
        }
    };

    const createGuest = async (guestData: any): Promise<string | null> => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        
        try {
            const response = await fetch(`${API_ENDPOINT}/guests`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: guestData.guestName,
                    email: guestData.guestEmail,
                    phone: guestData.guestPhone,
                    passportId: guestData.guestPassportId || null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                message.success('Guest created successfully!');
                return result.data.id;
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error creating guest');
                return null;
            }
        } catch (error) {
            console.error('Error creating guest:', error);
            message.error('Error creating guest');
            return null;
        }
    };

    const onFinish = async (values: any) => {
        const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const propertyId = localStorage.getItem('selectedPropertyId');
        
        setLoading(true);

        try {
            let guestId = values.guestId;

            // Step 1: If creating new guest, create guest first
            if (guestMode === 'new') {
                guestId = await createGuest(values);
                if (!guestId) {
                    setLoading(false);
                    return;
                }
            }

            // Step 2: Calculate total amount
            const nights = values.dateRange[1].diff(values.dateRange[0], 'days');
            const roomType = roomTypes.find(rt => rt.id === values.roomTypeId);
            const totalAmount = roomType ? roomType.basePrice * nights : 0;

            // Step 3: Create reservation with guestId and ALL required fields
            const payload = {
                propertyId,
                guestId,
                roomTypeId: values.roomTypeId,
                ratePlanId: values.ratePlanId,
                checkIn: values.dateRange[0].format('YYYY-MM-DD'),
                checkOut: values.dateRange[1].format('YYYY-MM-DD'),
                adults: values.adults,
                children: values.children || 0,
                contactName: values.contactName,
                contactEmail: values.contactEmail,
                contactPhone: values.contactPhone,
                channel: values.channel,
                guestNotes: values.guestNotes || '',
                currency: values.currency || 'VND',
                totalAmount: totalAmount,
                taxAmount: 0,
                discountAmount: 0,
                serviceAmount: 0,
                amountPaid: 0,
                paymentStatus: 'unpaid',
            };            const response = await fetch(`${API_ENDPOINT}/reservations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                message.success(`Reservation created successfully! Confirmation: ${result.data?.confirmationCode || result.confirmationCode || 'N/A'}`);
                router.push(`/reservations/${result.data?.id || result.id}`);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Error creating reservation');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            message.error('Error creating reservation');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'Guest Info',
            icon: <UserOutlined />,
        },
        {
            title: 'Booking Details',
            icon: <CalendarOutlined />,
        },
        {
            title: 'Contact & Notes',
            icon: <DollarOutlined />,
        },
    ];

    return (
        <div>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={3}>
                                <CalendarOutlined /> Create New Reservation
                            </Title>
                        </Col>
                        <Col>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push('/reservations')}
                            >
                                Back to List
                            </Button>
                        </Col>
                    </Row>

                    <Steps current={currentStep} items={steps} />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            adults: 1,
                            children: 0,
                            channel: 'website',
                            currency: 'VND',
                        }}
                    >
                        {/* Step 1: Guest Information */}
                        {currentStep === 0 && (
                            <>
                                <Divider>Guest Information</Divider>
                                
                                {/* Guest Mode Selection */}
                                <Row gutter={16} style={{ marginBottom: 16 }}>
                                    <Col xs={24}>
                                        <Form.Item label="Guest Type">
                                            <Radio.Group 
                                                value={guestMode} 
                                                onChange={(e) => {
                                                    setGuestMode(e.target.value);
                                                    // Clear guest-related fields when switching
                                                    if (e.target.value === 'new') {
                                                        form.setFieldsValue({ guestId: undefined });
                                                    } else {
                                                        form.setFieldsValue({ 
                                                            guestName: undefined,
                                                            guestEmail: undefined,
                                                            guestPhone: undefined,
                                                            guestPassportId: undefined,
                                                        });
                                                    }
                                                }}
                                            >
                                                <Radio.Button value="existing">Select Existing Guest</Radio.Button>
                                                <Radio.Button value="new">Create New Guest</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Existing Guest Selection */}
                                {guestMode === 'existing' && (
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Select Guest"
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
                                    </Row>
                                )}

                                {/* New Guest Form */}
                                {guestMode === 'new' && (
                                    <>
                                        <Row gutter={16}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Guest Name"
                                                    name="guestName"
                                                    rules={[{ required: true, message: 'Please enter guest name!' }]}
                                                >
                                                    <Input placeholder="Full name" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Guest Email"
                                                    name="guestEmail"
                                                    rules={[
                                                        { required: true, message: 'Please enter guest email!' },
                                                        { type: 'email', message: 'Invalid email format!' }
                                                    ]}
                                                >
                                                    <Input placeholder="email@example.com" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Guest Phone"
                                                    name="guestPhone"
                                                    rules={[{ required: true, message: 'Please enter guest phone!' }]}
                                                >
                                                    <Input placeholder="+84 123 456 789" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Passport ID (Optional)"
                                                    name="guestPassportId"
                                                >
                                                    <Input placeholder="Passport number" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                <Divider />

                                <Row gutter={16}>
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

                                <Row justify="end">
                                    <Button type="primary" onClick={() => setCurrentStep(1)}>
                                        Next
                                    </Button>
                                </Row>
                            </>
                        )}

                        {/* Step 2: Booking Details */}
                        {currentStep === 1 && (
                            <>
                                <Divider>Booking Details</Divider>
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Check-in / Check-out"
                                            name="dateRange"
                                            rules={[{ required: true, message: 'Please select dates!' }]}
                                        >
                                            <RangePicker
                                                style={{ width: '100%' }}
                                                format="DD/MM/YYYY"
                                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                                onChange={calculatePrice}
                                            />
                                        </Form.Item>
                                    </Col>
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
                                            <InputNumber min={0} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
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
                                                        {rt.name} - ${rt.basePrice}/night (Max: {rt.maxAdults}A + {rt.maxChildren}C)
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Rate Plan"
                                            name="ratePlanId"
                                            rules={[{ required: true, message: 'Please select rate plan!' }]}
                                        >
                                            <Select
                                                placeholder="Select rate plan"
                                                disabled={!selectedRoomType}
                                            >
                                                {filteredRatePlans.map(rp => (
                                                    <Select.Option key={rp.id} value={rp.id}>
                                                        {rp.name} ({rp.isRefundable ? 'Refundable' : 'Non-refundable'})
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {calculatedPrice > 0 && (
                                    <Card style={{ backgroundColor: '#f0f2f5', marginBottom: 16 }}>
                                        <Text strong>Estimated Price: ${calculatedPrice.toFixed(2)}</Text>
                                    </Card>
                                )}

                                <Row justify="space-between">
                                    <Button onClick={() => setCurrentStep(0)}>
                                        Previous
                                    </Button>
                                    <Button type="primary" onClick={() => setCurrentStep(2)}>
                                        Next
                                    </Button>
                                </Row>
                            </>
                        )}

                        {/* Step 3: Contact & Notes */}
                        {currentStep === 2 && (
                            <>
                                <Divider>Contact Information</Divider>
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

                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Currency"
                                            name="currency"
                                        >
                                            <Select>
                                                <Select.Option value="USD">USD</Select.Option>
                                                <Select.Option value="EUR">EUR</Select.Option>
                                                <Select.Option value="GBP">GBP</Select.Option>
                                                <Select.Option value="VND">VND</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row justify="space-between">
                                    <Button onClick={() => setCurrentStep(1)}>
                                        Previous
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                    >
                                        Create Reservation
                                    </Button>
                                </Row>
                            </>
                        )}
                    </Form>
                </Space>
            </Card>
        </div>
    );
}
