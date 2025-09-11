"use client";

import { useShow, useList, useUpdate } from "@refinedev/core";
import { Card, Row, Col, Typography, Button, List, Tag, Space, message } from "antd";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ReservationBreadcrumb } from "@/components/ReservationBreadcrumb";

const { Title, Text } = Typography;

export default function AssignRoom() {
  const params = useParams();
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { queryResult } = useShow({
    resource: "reservations",
    id: params.id as string,
  });

  const reservation = queryResult?.data?.data;

  // Get available rooms for the reservation dates and room type
  const { data: availableRooms, isLoading: roomsLoading } = useList({
    resource: "rooms",
    filters: [
      { field: "roomTypeId", operator: "eq", value: reservation?.roomTypeId },
      { field: "operationalStatus", operator: "eq", value: "available" },
      // In a real app, you'd also check room availability for the date range
    ],
  });

  const { mutate: updateReservation } = useUpdate();

  const handleAssignRoom = async () => {
    if (!selectedRoom) {
      message.error("Please select a room");
      return;
    }

    setLoading(true);
    try {
      updateReservation({
        resource: "reservations",
        id: params.id as string,
        values: {
          assigned_room_id: selectedRoom,
          status: "confirmed", // Ensure status is confirmed when room is assigned
        },
      });
      message.success("Room assigned successfully");
      router.push(`/reservations/show/${params.id}`);
    } catch (error) {
      message.error("Failed to assign room");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      clean: "green",
      dirty: "orange",
      inspected: "blue",
    };
    return colors[status as keyof typeof colors] || "default";
  };

  if (!reservation) return <div>Loading...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <ReservationBreadcrumb 
        reservationId={params.id as string}
        confirmationCode={reservation?.confirmation_code}
        currentPage="Assign Room"
      />
      
      <Card title="Assign Room to Reservation" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Title level={5}>Reservation Details</Title>
            <p><strong>Confirmation:</strong> {reservation.confirmation_code}</p>
            <p><strong>Guest:</strong> {reservation.contact_name}</p>
            <p><strong>Check-in:</strong> {new Date(reservation.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(reservation.checkOut).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> {reservation.adults} adults, {reservation.children || 0} children</p>
          </Col>
          <Col span={12}>
            {selectedRoom && (
              <Card size="small" title="Selected Room">
                <Text strong>Room: {availableRooms?.data?.find(r => r.id === selectedRoom)?.number}</Text>
                <br />
                <Text>Floor: {availableRooms?.data?.find(r => r.id === selectedRoom)?.floor}</Text>
                <br />
                <Text>View: {availableRooms?.data?.find(r => r.id === selectedRoom)?.view_type}</Text>
                <br />
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary" onClick={handleAssignRoom} loading={loading}>
                    Confirm Assignment
                  </Button>
                  <Button onClick={() => setSelectedRoom(null)}>
                    Cancel
                  </Button>
                </Space>
              </Card>
            )}
          </Col>
        </Row>
      </Card>

      <Card title="Available Rooms" loading={roomsLoading}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={availableRooms?.data || []}
          renderItem={(room: any) => (
            <List.Item>
              <Card
                size="small"
                hoverable
                onClick={() => setSelectedRoom(room.id)}
                style={{
                  border: selectedRoom === room.id ? "2px solid #1890ff" : "1px solid #d9d9d9",
                  cursor: "pointer"
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Room {room.number}
                  </Title>
                  <Text type="secondary">Floor {room.floor}</Text>
                  <Text type="secondary">{room.view_type} view</Text>
                  <Tag color={getStatusColor(room.housekeepingStatus)}>
                    {room.housekeepingStatus}
                  </Tag>
                  {room.housekeeperNotes && (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Note: {room.housekeeperNotes}
                    </Text>
                  )}
                </Space>
              </Card>
            </List.Item>
          )}
        />
        
        {availableRooms?.data?.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">
              No rooms available for this room type and date range.
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}
