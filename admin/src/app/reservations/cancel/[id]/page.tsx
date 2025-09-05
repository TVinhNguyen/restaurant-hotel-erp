"use client";

import { useShow, useUpdate } from "@refinedev/core";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Form, 
  Input, 
  message, 
  Space, 
  Divider, 
  Alert,
  Radio,
  InputNumber,
  Table,
  Tag,
  Modal,
  Descriptions
} from "antd";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ReservationBreadcrumb } from "@/components/ReservationBreadcrumb";
import {
  WarningOutlined,
  DollarOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function ReservationCancellation() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [cancellationType, setCancellationType] = useState<'cancellation' | 'no_show'>('cancellation');

  const { queryResult } = useShow({
    resource: "reservations",
    id: params.id as string,
  });

  const reservation = queryResult?.data?.data;
  const { mutate: updateReservation } = useUpdate();

  // Mock cancellation policies based on rate plan
  const cancellationPolicies = {
    'best-available': {
      name: 'Best Available Rate',
      freeUntil: 24, // hours before arrival
      earlyFee: 0,
      lateFee: 50, // percentage of total amount
      noShowFee: 100,
    },
    'early-bird': {
      name: 'Early Bird Rate',
      freeUntil: 0, // Non-refundable
      earlyFee: 100,
      lateFee: 100,
      noShowFee: 100,
    },
    'flexible': {
      name: 'Flexible Rate',
      freeUntil: 48,
      earlyFee: 0,
      lateFee: 25,
      noShowFee: 75,
    },
  };

  const getCurrentPolicy = () => {
    // Mock policy selection based on reservation data
    return cancellationPolicies['best-available'];
  };

  const calculateCancellationFee = (type: 'cancellation' | 'no_show') => {
    if (!reservation) return 0;
    
    const policy = getCurrentPolicy();
    const totalAmount = reservation.totalAmount || 0;
    const hoursUntilArrival = new Date(reservation.checkIn).getTime() - new Date().getTime();
    const hoursRemaining = hoursUntilArrival / (1000 * 60 * 60);

    if (type === 'no_show') {
      return Math.round(totalAmount * policy.noShowFee / 100);
    }

    if (hoursRemaining > policy.freeUntil) {
      return Math.round(totalAmount * policy.earlyFee / 100);
    } else {
      return Math.round(totalAmount * policy.lateFee / 100);
    }
  };

  const handleCancellation = async (values: any) => {
    if (!reservation) return;
    
    setLoading(true);
    try {
      const cancellationFee = calculateCancellationFee(cancellationType);
      const refundAmount = Math.max(0, (reservation.amountPaid || 0) - cancellationFee);

      updateReservation({
        resource: "reservations",
        id: params.id as string,
        values: {
          status: cancellationType === 'no_show' ? 'no_show' : 'cancelled',
          cancellationDate: new Date().toISOString(),
          cancellationReason: values.reason,
          cancellationNotes: values.notes,
          cancellationFee: cancellationFee,
          refundAmount: refundAmount,
          cancellationType: cancellationType,
        },
      });

      message.success(`Reservation ${cancellationType === 'no_show' ? 'marked as no-show' : 'cancelled'} successfully`);
      router.push(`/reservations/show/${params.id}`);
    } catch (error) {
      message.error(`Failed to ${cancellationType === 'no_show' ? 'mark as no-show' : 'cancel'} reservation`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmModal = (values: any) => {
    const cancellationFee = calculateCancellationFee(cancellationType);
    const refundAmount = Math.max(0, (reservation?.amountPaid || 0) - cancellationFee);

    Modal.confirm({
      title: `Confirm ${cancellationType === 'no_show' ? 'No-Show' : 'Cancellation'}`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to {cancellationType === 'no_show' ? 'mark this reservation as no-show' : 'cancel this reservation'}?</p>
          <Divider />
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Cancellation Fee">
              {cancellationFee.toLocaleString()} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Refund Amount">
              {refundAmount.toLocaleString()} VNĐ
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
      okText: 'Confirm',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleCancellation(values),
    });
  };

  if (!reservation) return <div>Loading...</div>;

  const policy = getCurrentPolicy();
  const cancellationFee = calculateCancellationFee(cancellationType);
  const refundAmount = Math.max(0, (reservation.amountPaid || 0) - cancellationFee);
  const hoursUntilArrival = Math.max(0, (new Date(reservation.checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60));

  return (
    <div style={{ padding: "24px" }}>
      <ReservationBreadcrumb
        reservationId={params.id as string}
        confirmationCode={reservation?.confirmation_code}
        currentPage="Cancellation"
      />

      <Row gutter={24}>
        <Col span={16}>
          <Card title="Cancellation & No-Show Processing">
            <Alert
              message="Warning"
              description="This action will change the reservation status and may incur cancellation fees according to the rate plan policy."
              type="warning"
              icon={<WarningOutlined />}
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={showConfirmModal}
            >
              <Form.Item label="Action Type">
                <Radio.Group 
                  value={cancellationType} 
                  onChange={(e) => setCancellationType(e.target.value)}
                >
                  <Radio.Button value="cancellation">Cancellation</Radio.Button>
                  <Radio.Button value="no_show">No-Show</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Reason"
                name="reason"
                rules={[{ required: true, message: "Please select a reason" }]}
              >
                <Radio.Group>
                  {cancellationType === 'cancellation' ? (
                    <>
                      <Radio value="guest_request">Guest Request</Radio>
                      <Radio value="payment_failed">Payment Failed</Radio>
                      <Radio value="overbooking">Overbooking</Radio>
                      <Radio value="force_majeure">Force Majeure</Radio>
                      <Radio value="other">Other</Radio>
                    </>
                  ) : (
                    <>
                      <Radio value="no_contact">No Contact from Guest</Radio>
                      <Radio value="late_arrival">Late Arrival (No Room)</Radio>
                      <Radio value="invalid_payment">Invalid Payment Method</Radio>
                      <Radio value="other">Other</Radio>
                    </>
                  )}
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Additional Notes"
                name="notes"
                help="Record any additional information about the cancellation/no-show"
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Enter details about the cancellation or no-show situation..."
                />
              </Form.Item>

              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Button onClick={() => router.push(`/reservations/show/${params.id}`)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  danger
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  {cancellationType === 'no_show' ? 'Mark as No-Show' : 'Cancel Reservation'}
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Reservation Summary */}
            <Card size="small" title="Reservation Summary">
              <div style={{ marginBottom: 8 }}>
                <Text strong>Confirmation:</Text> {reservation.confirmation_code}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Guest:</Text> {reservation.contact_name}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Dates:</Text> {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Room:</Text> {reservation.room_type_name || 'Not assigned'}
              </div>
              <div>
                <Text strong>Status:</Text> <Tag color="blue">{reservation.status?.toUpperCase()}</Tag>
              </div>
            </Card>

            {/* Policy Information */}
            <Card size="small" title="Cancellation Policy">
              <div style={{ marginBottom: 8 }}>
                <Text strong>Rate Plan:</Text> {policy.name}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Free Cancellation:</Text> {policy.freeUntil > 0 ? `${policy.freeUntil} hours before arrival` : 'Non-refundable'}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Time Remaining:</Text> {Math.round(hoursUntilArrival)} hours
              </div>
              <div>
                <Text strong>Policy Status:</Text> 
                <Tag color={hoursUntilArrival > policy.freeUntil ? 'green' : 'red'}>
                  {hoursUntilArrival > policy.freeUntil ? 'Free Cancellation Period' : 'Cancellation Fee Applies'}
                </Tag>
              </div>
            </Card>

            {/* Financial Impact */}
            <Card size="small" title="Financial Impact">
              <div style={{ marginBottom: 8 }}>
                <Text>Total Amount:</Text>
                <br />
                <Text strong>{reservation.totalAmount?.toLocaleString()} VNĐ</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>Amount Paid:</Text>
                <br />
                <Text strong>{reservation.amountPaid?.toLocaleString() || 0} VNĐ</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ marginBottom: 8 }}>
                <Text>Cancellation Fee:</Text>
                <br />
                <Text strong style={{ color: '#ff4d4f' }}>
                  {cancellationFee.toLocaleString()} VNĐ
                </Text>
              </div>
              <div>
                <Text>Refund Amount:</Text>
                <br />
                <Text strong style={{ color: refundAmount > 0 ? '#52c41a' : '#ff4d4f' }}>
                  {refundAmount.toLocaleString()} VNĐ
                </Text>
              </div>
            </Card>

            {/* Fee Breakdown */}
            <Card size="small" title="Fee Breakdown">
              <Table
                size="small"
                showHeader={false}
                pagination={false}
                dataSource={[
                  {
                    key: 'early',
                    desc: 'Early Cancellation Fee',
                    rate: `${policy.earlyFee}%`,
                    applicable: hoursUntilArrival > policy.freeUntil
                  },
                  {
                    key: 'late',
                    desc: 'Late Cancellation Fee',
                    rate: `${policy.lateFee}%`,
                    applicable: hoursUntilArrival <= policy.freeUntil && cancellationType === 'cancellation'
                  },
                  {
                    key: 'noshow',
                    desc: 'No-Show Fee',
                    rate: `${policy.noShowFee}%`,
                    applicable: cancellationType === 'no_show'
                  },
                ]}
                columns={[
                  {
                    dataIndex: 'desc',
                    render: (text, record) => (
                      <Text style={{ 
                        fontWeight: record.applicable ? 'bold' : 'normal',
                        color: record.applicable ? '#1890ff' : '#bfbfbf'
                      }}>
                        {text}
                      </Text>
                    )
                  },
                  {
                    dataIndex: 'rate',
                    render: (text, record) => (
                      <Text style={{ 
                        fontWeight: record.applicable ? 'bold' : 'normal',
                        color: record.applicable ? '#1890ff' : '#bfbfbf'
                      }}>
                        {text}
                      </Text>
                    )
                  },
                ]}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
