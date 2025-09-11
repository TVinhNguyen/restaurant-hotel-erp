"use client";

import { useShow, useUpdate } from "@refinedev/core";
import { Card, Row, Col, Typography, Button, Form, Input, message, Space, Divider, InputNumber } from "antd";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ReservationBreadcrumb } from "@/components/ReservationBreadcrumb";

const { Title, Text } = Typography;

export default function CheckOut() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { queryResult } = useShow({
    resource: "reservations",
    id: params.id as string,
  });

  const reservation = queryResult?.data?.data;

  const { mutate: updateReservation } = useUpdate();

  const handleCheckOut = async (values: any) => {
    if (!reservation) return;
    
    setLoading(true);
    try {
      // Calculate any final charges
      const finalAmount = reservation.totalAmount + (values.additionalCharges || 0);
      const outstandingBalance = finalAmount - reservation.amountPaid;

      updateReservation({
        resource: "reservations",
        id: params.id as string,
        values: {
          status: "checked_out",
          checkOutTime: new Date().toISOString(),
          checkOutNotes: values.notes,
          serviceAmount: (reservation.serviceAmount || 0) + (values.additionalCharges || 0),
          totalAmount: finalAmount,
        },
      });
      
      // Update room status to dirty/needs cleaning
      // In a real app, you'd call another API to update room status
      
      // Create final payment record if there's outstanding balance
      if (outstandingBalance > 0 && values.finalPayment) {
        // Create payment record
        console.log("Creating final payment:", values.finalPayment);
      }
      
      message.success("Guest checked out successfully");
      router.push(`/reservations/show/${params.id}`);
    } catch (error) {
      message.error("Failed to check out guest");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!reservation) return <div>Loading...</div>;

  const canCheckOut = reservation.status === 'checked_in';
  const outstandingBalance = reservation.totalAmount - (reservation.amountPaid || 0);

  if (!canCheckOut) {
    return (
      <div style={{ padding: "24px" }}>
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Title level={3}>Cannot Check Out</Title>
            <Text type="secondary">
              Guest must be checked in before check-out
            </Text>
            <br />
            <Button 
              type="primary" 
              onClick={() => router.push(`/reservations/show/${params.id}`)}
              style={{ marginTop: 16 }}
            >
              Back to Reservation
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <ReservationBreadcrumb 
        reservationId={params.id as string}
        confirmationCode={reservation?.confirmation_code}
        currentPage="Check Out"
      />
      
      <Card title="Guest Check-Out">
        <Row gutter={24}>
          <Col span={12}>
            <Title level={5}>Reservation Details</Title>
            <p><strong>Confirmation:</strong> {reservation.confirmation_code}</p>
            <p><strong>Guest:</strong> {reservation.contact_name}</p>
            <p><strong>Room:</strong> {reservation.assigned_room_number || reservation.assigned_room_id}</p>
            <p><strong>Check-in Date:</strong> {new Date(reservation.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> {new Date(reservation.checkOut).toLocaleDateString()}</p>
            
            <Divider />
            
            <Title level={5}>Financial Summary</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Text>Room Total:</Text>
                <br />
                <Text strong>{reservation.totalAmount} {reservation.currency}</Text>
              </Col>
              <Col span={12}>
                <Text>Amount Paid:</Text>
                <br />
                <Text>{reservation.amountPaid} {reservation.currency}</Text>
              </Col>
            </Row>
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <Text>Services:</Text>
                <br />
                <Text>{reservation.serviceAmount || 0} {reservation.currency}</Text>
              </Col>
              <Col span={12}>
                <Text>Outstanding:</Text>
                <br />
                <Text strong style={{ color: outstandingBalance > 0 ? 'red' : 'green' }}>
                  {outstandingBalance.toFixed(2)} {reservation.currency}
                </Text>
              </Col>
            </Row>
          </Col>
          
          <Col span={12}>
            <Card size="small" title="Check-Out Process">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleCheckOut}
              >
                <Form.Item
                  label="Additional Charges"
                  name="additionalCharges"
                  help="Mini-bar, damages, extra services, etc."
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    style={{ width: "100%" }}
                    prefix={reservation.currency}
                  />
                </Form.Item>

                {outstandingBalance > 0 && (
                  <Form.Item
                    label="Final Payment Amount"
                    name="finalPayment"
                    help="Payment for outstanding balance"
                  >
                    <InputNumber
                      min={0}
                      max={outstandingBalance}
                      step={0.01}
                      style={{ width: "100%" }}
                      prefix={reservation.currency}
                      placeholder={`Max: ${outstandingBalance.toFixed(2)}`}
                    />
                  </Form.Item>
                )}

                <Form.Item
                  label="Check-Out Notes"
                  name="notes"
                  help="Record room condition, feedback, or issues"
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="e.g., Room in good condition, guest satisfied with stay..."
                  />
                </Form.Item>

                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <Button 
                    onClick={() => router.push(`/reservations/show/${params.id}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    size="large"
                  >
                    Confirm Check-Out
                  </Button>
                </Space>
              </Form>
            </Card>

            <Card size="small" title="Checklist" style={{ marginTop: 16 }}>
              <div style={{ fontSize: "14px" }}>
                <p>✓ Collect room keys</p>
                <p>✓ Check mini-bar usage</p>
                <p>✓ Inspect room condition</p>
                <p>✓ Process final payment</p>
                <p>✓ Provide receipt/invoice</p>
                <p>✓ Request feedback</p>
                <p>✓ Update loyalty points</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
