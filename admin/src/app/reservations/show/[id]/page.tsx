"use client";

import { DateField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow, useMany } from "@refinedev/core";
import { Typography, Row, Col, Card, Tag, Divider, Space, Button } from "antd";
import { useRouter } from "next/navigation";
import { QuickActions } from "@/components/QuickActions";

const { Title, Text } = Typography;

export default function ReservationShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const router = useRouter();

  const record = data?.data;

  const { data: guestData, isLoading: guestIsLoading } = useOne({
    resource: "guests",
    id: record?.guestId || "",
    queryOptions: {
      enabled: !!record?.guestId,
    },
  });

  const { data: roomTypeData, isLoading: roomTypeIsLoading } = useOne({
    resource: "roomTypes",
    id: record?.roomTypeId || "",
    queryOptions: {
      enabled: !!record?.roomTypeId,
    },
  });

  const { data: ratePlanData, isLoading: ratePlanIsLoading } = useOne({
    resource: "ratePlans",
    id: record?.ratePlanId || "",
    queryOptions: {
      enabled: !!record?.ratePlanId,
    },
  });

  const { data: roomData, isLoading: roomIsLoading } = useOne({
    resource: "rooms",
    id: record?.assigned_room_id || "",
    queryOptions: {
      enabled: !!record?.assigned_room_id,
    },
  });

  const { data: promotionData, isLoading: promotionIsLoading } = useOne({
    resource: "promotions",
    id: record?.promotion_id || "",
    queryOptions: {
      enabled: !!record?.promotion_id,
    },
  });

  const statusColors = {
    pending: "orange",
    confirmed: "blue",
    checked_in: "green",
    checked_out: "gray",
    cancelled: "red",
    no_show: "volcano",
  };

  const paymentStatusColors = {
    unpaid: "red",
    partial: "orange",
    paid: "green",
    refunded: "purple",
  };

  const canAssignRoom = record?.status === 'confirmed' && !record?.assigned_room_id;
  const canCheckIn = record?.status === 'confirmed' && record?.assigned_room_id;
  const canCheckOut = record?.status === 'checked_in';

  return (
    <Show 
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <Space>
          {canAssignRoom && (
            <Button 
              type="primary"
              onClick={() => router.push(`/reservations/assign-room/${record?.id}`)}
            >
              Assign Room
            </Button>
          )}
          {canCheckIn && (
            <Button 
              type="primary"
              onClick={() => router.push(`/reservations/check-in/${record?.id}`)}
            >
              Check In
            </Button>
          )}
          {canCheckOut && (
            <Button 
              type="primary"
              onClick={() => router.push(`/reservations/check-out/${record?.id}`)}
            >
              Check Out
            </Button>
          )}
          <Button onClick={() => router.push(`/reservations/payments/${record?.id}`)}>
            Payments
          </Button>
          <Button onClick={() => router.push(`/reservations/services/${record?.id}`)}>
            Services
          </Button>
          {defaultButtons}
        </Space>
      )}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Reservation Details" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>ID</Title>
                <TextField value={record?.id} />
              </Col>
              <Col span={12}>
                <Title level={5}>Confirmation Code</Title>
                <TextField value={record?.confirmation_code} />
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>Status</Title>
                <Tag color={statusColors[record?.status as keyof typeof statusColors]}>
                  {record?.status?.toUpperCase()}
                </Tag>
              </Col>
              <Col span={12}>
                <Title level={5}>Channel</Title>
                <TextField value={record?.channel} />
              </Col>
            </Row>
            
            {record?.external_ref && (
              <>
                <Title level={5}>External Reference</Title>
                <TextField value={record?.external_ref} />
              </>
            )}
          </Card>

          <Card title="Guest Information" size="small" style={{ marginTop: 16 }}>
            <Title level={5}>Guest</Title>
            <TextField
              value={
                guestIsLoading ? "Loading..." : guestData?.data?.name
              }
            />
            
            <Title level={5}>Contact Name</Title>
            <TextField value={record?.contact_name} />
            
            <Title level={5}>Contact Email</Title>
            <TextField value={record?.contact_email} />
            
            <Title level={5}>Contact Phone</Title>
            <TextField value={record?.contact_phone} />
            
            {record?.guestNotes && (
              <>
                <Title level={5}>Guest Notes</Title>
                <TextField value={record?.guestNotes} />
              </>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Stay Details" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>Check-in</Title>
                <DateField value={record?.checkIn} />
              </Col>
              <Col span={12}>
                <Title level={5}>Check-out</Title>
                <DateField value={record?.checkOut} />
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>Adults</Title>
                <TextField value={record?.adults} />
              </Col>
              <Col span={12}>
                <Title level={5}>Children</Title>
                <TextField value={record?.children || 0} />
              </Col>
            </Row>
            
            <Divider />
            
            <Title level={5}>Room Type</Title>
            <TextField
              value={
                roomTypeIsLoading ? "Loading..." : roomTypeData?.data?.name
              }
            />
            
            <Title level={5}>Rate Plan</Title>
            <TextField
              value={
                ratePlanIsLoading ? "Loading..." : ratePlanData?.data?.name
              }
            />
            
            {record?.assigned_room_id && (
              <>
                <Title level={5}>Assigned Room</Title>
                <TextField
                  value={
                    roomIsLoading ? "Loading..." : roomData?.data?.number
                  }
                />
              </>
            )}
            
            {record?.promotion_id && (
              <>
                <Title level={5}>Promotion</Title>
                <TextField
                  value={
                    promotionIsLoading ? "Loading..." : promotionData?.data?.code
                  }
                />
              </>
            )}
          </Card>

          <Card title="Financial Summary" size="small" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>Total Amount</Title>
                <Text strong>{record?.totalAmount} {record?.currency}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Tax Amount</Title>
                <Text>{record?.taxAmount} {record?.currency}</Text>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>Discount Amount</Title>
                <Text>{record?.discountAmount} {record?.currency}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Service Amount</Title>
                <Text>{record?.serviceAmount} {record?.currency}</Text>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>Amount Paid</Title>
                <Text strong>{record?.amountPaid} {record?.currency}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Payment Status</Title>
                <Tag color={paymentStatusColors[record?.paymentStatus as keyof typeof paymentStatusColors]}>
                  {record?.paymentStatus?.toUpperCase()}
                </Tag>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>Outstanding Balance</Title>
                <Text strong style={{ color: (record?.totalAmount - record?.amountPaid) > 0 ? 'red' : 'green' }}>
                  {(record?.totalAmount - record?.amountPaid).toFixed(2)} {record?.currency}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={24}>
        <Col span={12}>
          <div>
            <Title level={5}>Created At</Title>
            <DateField value={record?.createdAt} />
          </div>
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Updated At</Title>
            <DateField value={record?.updatedAt} />
          </div>
        </Col>
        <Col span={12}>
          <QuickActions
            reservationId={String(record?.id || '')}
            status={record?.status || ''}
            hasAssignedRoom={!!record?.assigned_room_id}
          />
        </Col>
      </Row>
    </Show>
  );
}
