"use client";

import React, { useState } from 'react';
import {
  Card,
  Steps,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Typography,
  Divider,
  Table,
  Tag,
  Alert,
  Checkbox,
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Step } = Steps;

export default function NewBooking() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchForm] = Form.useForm();
  const [guestForm] = Form.useForm();
  const [confirmForm] = Form.useForm();
  
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const roomTypes = [
    {
      id: '1',
      name: 'Standard Room',
      description: 'Comfortable room with city view',
      maxOccupancy: 2,
      amenities: ['Free WiFi', 'AC', 'TV', 'Mini Bar'],
      images: ['room1.jpg'],
    },
    {
      id: '2', 
      name: 'Superior Room',
      description: 'Spacious room with garden view',
      maxOccupancy: 3,
      amenities: ['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
      images: ['room2.jpg'],
    },
    {
      id: '3',
      name: 'Deluxe Room',
      description: 'Luxury room with ocean view',
      maxOccupancy: 4,
      amenities: ['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Bath Tub'],
      images: ['room3.jpg'],
    },
  ];

  const ratePlans = [
    {
      id: '1',
      name: 'Best Available Rate',
      description: 'Flexible rate with free cancellation',
      cancellationPolicy: 'Free cancellation until 24 hours before arrival',
      basePrice: 1200000,
      roomTypeId: '1',
    },
    {
      id: '2',
      name: 'Early Bird Rate',
      description: 'Book early and save 15%',
      cancellationPolicy: 'Non-refundable',
      basePrice: 1020000,
      roomTypeId: '1',
    },
  ];

  // Step 1: Availability Search
  const handleSearch = async (values: any) => {
    setLoading(true);
    
    // Mock search logic
    const checkIn = values.dates[0];
    const checkOut = values.dates[1];
    const nights = checkOut.diff(checkIn, 'days');
    
    const mockResults = roomTypes.map(roomType => {
      const availableRatePlans = ratePlans.filter(rp => rp.roomTypeId === roomType.id);
      return {
        roomType,
        nights,
        availableRatePlans: availableRatePlans.map(rp => ({
          ...rp,
          totalPrice: rp.basePrice * nights,
          avgNightlyRate: rp.basePrice,
        })),
        available: Math.floor(Math.random() * 5) + 1, // Mock availability
      };
    });

    setSearchResults(mockResults);
    setBookingData({ ...values, nights });
    setLoading(false);
    setCurrentStep(1);
  };

  // Step 2: Rate Selection
  const handleRateSelection = (roomType: any, ratePlan: any) => {
    setSelectedRate({
      roomType,
      ratePlan,
      totalAmount: ratePlan.totalPrice,
    });
    setBookingData({
      ...bookingData,
      roomTypeId: roomType.id,
      ratePlanId: ratePlan.id,
      totalAmount: ratePlan.totalPrice,
    });
    setCurrentStep(2);
  };

  // Step 3: Guest Information
  const handleGuestInfo = async (values: any) => {
    setBookingData({
      ...bookingData,
      ...values,
    });
    setCurrentStep(3);
  };

  // Step 4: Confirmation & Booking
  const handleBookingConfirmation = async (values: any) => {
    setLoading(true);
    
    const finalBookingData = {
      ...bookingData,
      ...values,
      checkIn: bookingData.dates[0].format('YYYY-MM-DD'),
      checkOut: bookingData.dates[1].format('YYYY-MM-DD'),
      status: 'pending',
      confirmationCode: `BK${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      // Here you would make the actual API call to create the reservation
      console.log('Creating booking:', finalBookingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push(`/reservations/show/${finalBookingData.confirmationCode}`);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Search Availability',
      content: (
        <Card title="Search Available Rooms">
          <Form form={searchForm} onFinish={handleSearch} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Check-in & Check-out Dates"
                  name="dates"
                  rules={[{ required: true, message: 'Please select dates' }]}
                >
                  <RangePicker
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().endOf('day')}
                    placeholder={['Check-in Date', 'Check-out Date']}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Adults"
                  name="adults"
                  initialValue={2}
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Children"
                  name="children"
                  initialValue={0}
                >
                  <InputNumber min={0} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                loading={loading}
                size="large"
              >
                Search Available Rooms
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      title: 'Select Room & Rate',
      content: (
        <Card title="Available Rooms & Rates">
          <Alert
            message={`Searching for ${bookingData.adults} adults${bookingData.children > 0 ? ` and ${bookingData.children} children` : ''} for ${bookingData.nights} nights`}
            type="info"
            style={{ marginBottom: 16 }}
          />
          
          {searchResults.map((result, index) => (
            <Card key={index} style={{ marginBottom: 16 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <div style={{ padding: '16px' }}>
                    <Title level={4}>{result.roomType.name}</Title>
                    <Paragraph>{result.roomType.description}</Paragraph>
                    <div>
                      <Text strong>Amenities: </Text>
                      {result.roomType.amenities.join(', ')}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text type="success">
                        {result.available} rooms available
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <div style={{ padding: '16px' }}>
                    <Title level={5}>Available Rate Plans</Title>
                    {result.availableRatePlans.map((ratePlan: any, rpIndex: number) => (
                      <Card 
                        key={rpIndex}
                        size="small" 
                        style={{ 
                          marginBottom: 8,
                          border: selectedRate?.ratePlan?.id === ratePlan.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        bodyStyle={{ padding: '12px' }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col span={12}>
                            <div>
                              <Text strong>{ratePlan.name}</Text>
                              <br />
                              <Text type="secondary">{ratePlan.description}</Text>
                              <br />
                              <Text style={{ fontSize: '12px' }}>{ratePlan.cancellationPolicy}</Text>
                            </div>
                          </Col>
                          <Col span={8} style={{ textAlign: 'right' }}>
                            <div>
                              <Text type="secondary">Average per night</Text>
                              <br />
                              <Text strong style={{ fontSize: '16px' }}>
                                {ratePlan.avgNightlyRate.toLocaleString()} VNĐ
                              </Text>
                              <br />
                              <Text style={{ fontSize: '18px', color: '#1890ff' }}>
                                Total: {ratePlan.totalPrice.toLocaleString()} VNĐ
                              </Text>
                            </div>
                          </Col>
                          <Col span={4} style={{ textAlign: 'right' }}>
                            <Button 
                              type="primary"
                              onClick={() => handleRateSelection(result.roomType, ratePlan)}
                            >
                              Select
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Card>
      ),
    },
    {
      title: 'Guest Information',
      content: (
        <Card title="Guest Information">
          {selectedRate && (
            <Alert
              message={`Selected: ${selectedRate.roomType.name} - ${selectedRate.ratePlan.name} for ${selectedRate.totalAmount.toLocaleString()} VNĐ`}
              type="success"
              style={{ marginBottom: 16 }}
            />
          )}
          
          <Form form={guestForm} onFinish={handleGuestInfo} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Guest Name"
                  name="contactName"
                  rules={[{ required: true, message: 'Please enter guest name' }]}
                >
                  <Input placeholder="Full name as per ID" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="contactEmail"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="guest@email.com" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="contactPhone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="+84 xxx xxx xxx" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nationality"
                  name="nationality"
                >
                  <Select placeholder="Select nationality">
                    <Select.Option value="VN">Vietnam</Select.Option>
                    <Select.Option value="US">United States</Select.Option>
                    <Select.Option value="UK">United Kingdom</Select.Option>
                    <Select.Option value="JP">Japan</Select.Option>
                    <Select.Option value="KR">South Korea</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              label="Special Requests"
              name="specialRequests"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Any special requirements or preferences..."
              />
            </Form.Item>
            
            <Form.Item
              name="marketingConsent"
              valuePropName="checked"
            >
              <Checkbox>
                I agree to receive promotional emails and offers
              </Checkbox>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Continue to Confirmation
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      title: 'Confirmation',
      content: (
        <Card title="Booking Confirmation">
          <Row gutter={24}>
            <Col span={16}>
              <Card size="small" title="Booking Details">
                <div style={{ marginBottom: 16 }}>
                  <Title level={5}>{selectedRate?.roomType?.name}</Title>
                  <Text>{selectedRate?.ratePlan?.name}</Text>
                </div>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Check-in:</Text>
                    <br />
                    <Text>{bookingData.dates?.[0]?.format('DD MMM YYYY')}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Check-out:</Text>
                    <br />
                    <Text>{bookingData.dates?.[1]?.format('DD MMM YYYY')}</Text>
                  </Col>
                </Row>
                
                <Divider />
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Guests:</Text>
                    <br />
                    <Text>{bookingData.adults} adults{bookingData.children > 0 && `, ${bookingData.children} children`}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Nights:</Text>
                    <br />
                    <Text>{bookingData.nights} nights</Text>
                  </Col>
                </Row>
                
                <Divider />
                
                <div>
                  <Text strong>Guest:</Text>
                  <br />
                  <Text>{bookingData.contactName}</Text>
                  <br />
                  <Text>{bookingData.contactEmail}</Text>
                  <br />
                  <Text>{bookingData.contactPhone}</Text>
                </div>
                
                {bookingData.specialRequests && (
                  <>
                    <Divider />
                    <div>
                      <Text strong>Special Requests:</Text>
                      <br />
                      <Text>{bookingData.specialRequests}</Text>
                    </div>
                  </>
                )}
              </Card>
            </Col>
            
            <Col span={8}>
              <Card size="small" title="Price Summary">
                <div style={{ marginBottom: 8 }}>
                  <Row justify="space-between">
                    <Text>Room Rate ({bookingData.nights} nights)</Text>
                    <Text>{selectedRate?.totalAmount?.toLocaleString()} VNĐ</Text>
                  </Row>
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Row justify="space-between">
                    <Text>Taxes & Fees</Text>
                    <Text>{Math.round(selectedRate?.totalAmount * 0.1)?.toLocaleString()} VNĐ</Text>
                  </Row>
                </div>
                
                <Divider />
                
                <div style={{ marginBottom: 16 }}>
                  <Row justify="space-between">
                    <Text strong>Total Amount</Text>
                    <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                      {Math.round(selectedRate?.totalAmount * 1.1)?.toLocaleString()} VNĐ
                    </Text>
                  </Row>
                </div>
                
                <Form form={confirmForm} onFinish={handleBookingConfirmation}>
                  <Form.Item
                    label="Deposit Amount"
                    name="depositAmount"
                    initialValue={Math.round(selectedRate?.totalAmount * 0.3)}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label="Payment Method"
                    name="paymentMethod"
                    initialValue="cash"
                  >
                    <Select>
                      <Select.Option value="cash">Cash</Select.Option>
                      <Select.Option value="card">Credit Card</Select.Option>
                      <Select.Option value="bank">Bank Transfer</Select.Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large" 
                      block
                      loading={loading}
                      icon={<CheckOutlined />}
                    >
                      Confirm Booking
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => {
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
              } else {
                router.push('/reservations');
              }
            }}
          >
            {currentStep > 0 ? 'Previous Step' : 'Back to Reservations'}
          </Button>
        </Col>
        <Col>
          <Title level={2} style={{ margin: 0 }}>New Booking Wizard</Title>
        </Col>
        <Col>
          <Text type="secondary">Step {currentStep + 1} of {steps.length}</Text>
        </Col>
      </Row>

      <Steps 
        current={currentStep} 
        style={{ marginBottom: '32px' }}
        items={steps.map(step => ({
          title: step.title,
          icon: currentStep === 0 ? <CalendarOutlined /> :
               currentStep === 1 ? <DollarOutlined /> :
               currentStep === 2 ? <UserOutlined /> :
               <CheckOutlined />
        }))}
      />

      <div>{steps[currentStep].content}</div>
    </div>
  );
}
