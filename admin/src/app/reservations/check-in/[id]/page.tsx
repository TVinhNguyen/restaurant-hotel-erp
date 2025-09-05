"use client";

import { useShow, useUpdate } from "@refinedev/core";
import { Card, Row, Col, Typography, Button, Form, Input, message, Space, Divider } from "antd";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ReservationBreadcrumb } from "@/components/ReservationBreadcrumb";

const { Title, Text } = Typography;

export default function CheckIn() {
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

  const handleCheckIn = async (values: any) => {
    setLoading(true);
    try {
      updateReservation({
        resource: "reservations",
        id: params.id as string,
        values: {
          status: "checked_in",
          // You might want to record check-in time, staff member, etc.
          checkInTime: new Date().toISOString(),
          checkInNotes: values.notes,
        },
      });
      
      // Update room status to occupied
      // In a real app, you'd call another API to update room status
      
      message.success("Guest checked in successfully");
      router.push(`/reservations/show/${params.id}`);
    } catch (error) {
      message.error("Failed to check in guest");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!reservation) return <div>Loading...</div>;

  const canCheckIn = reservation.status === 'confirmed' && reservation.assigned_room_id;

  if (!canCheckIn) {
    return (
      <div style={{ padding: "24px" }}>
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Title level={3}>Cannot Check In</Title>
            <Text type="secondary">
              {!reservation.assigned_room_id 
                ? "Room must be assigned before check-in" 
                : "Reservation status does not allow check-in"
              }
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
        currentPage="Check In"
      />
      
      <Card title="Guest Check-In">
        <Row gutter={24}>
          <Col span={12}>
            <Title level={5}>Reservation Details</Title>
            <p><strong>Confirmation:</strong> {reservation.confirmation_code}</p>
            <p><strong>Guest:</strong> {reservation.contact_name}</p>
            <p><strong>Room:</strong> {reservation.assigned_room_number || reservation.assigned_room_id}</p>
            <p><strong>Check-in Date:</strong> {new Date(reservation.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> {new Date(reservation.checkOut).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> {reservation.adults} adults, {reservation.children || 0} children</p>
            
            <Divider />
            
            <Title level={5}>Contact Information</Title>
            <p><strong>Email:</strong> {reservation.contact_email}</p>
            <p><strong>Phone:</strong> {reservation.contact_phone}</p>
            
            {reservation.guestNotes && (
              <>
                <Divider />
                <Title level={5}>Guest Notes</Title>
                <Text>{reservation.guestNotes}</Text>
              </>
            )}
          </Col>
          
          <Col span={12}>
            <Card size="small" title="Check-In Process">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleCheckIn}
              >
                <Form.Item
                  label="Check-In Notes"
                  name="notes"
                  help="Record any observations, requests, or issues during check-in"
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="e.g., Guest requested late check-out, provided additional amenities..."
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
                    Confirm Check-In
                  </Button>
                </Space>
              </Form>
            </Card>

            <Card size="small" title="Checklist" style={{ marginTop: 16 }}>
              <div style={{ fontSize: "14px" }}>
                <p>✓ Verify guest identity</p>
                <p>✓ Confirm room assignment</p>
                <p>✓ Collect payment (if required)</p>
                <p>✓ Provide room keys</p>
                <p>✓ Explain hotel facilities</p>
                <p>✓ Record any special requests</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
