"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Row, Col, Divider, Card, Button, Space } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function ReservationEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const router = useRouter();
  
  const reservationData = queryResult?.data?.data;
  const [selectedRoomType, setSelectedRoomType] = useState(reservationData?.roomTypeId);

  const { selectProps: guestSelectProps } = useSelect({
    resource: "guests",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: reservationData?.guestId,
  });

  const { selectProps: roomTypeSelectProps } = useSelect({
    resource: "roomTypes",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: reservationData?.roomTypeId,
  });

  const { selectProps: ratePlanSelectProps } = useSelect({
    resource: "ratePlans",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: reservationData?.ratePlanId,
    filters: selectedRoomType ? [{ field: "roomTypeId", operator: "eq", value: selectedRoomType }] : [],
  });

  const { selectProps: promotionSelectProps } = useSelect({
    resource: "promotions",
    optionLabel: "code",
    optionValue: "id",
    defaultValue: reservationData?.promotion_id,
  });

  const canEdit = reservationData?.status !== 'checked_out' && reservationData?.status !== 'cancelled';
  const canAssignRoom = reservationData?.status === 'confirmed' && !reservationData?.assigned_room_id;
  const canCheckIn = reservationData?.status === 'confirmed' && reservationData?.assigned_room_id;
  const canCheckOut = reservationData?.status === 'checked_in';

  return (
    <Edit 
      saveButtonProps={canEdit ? saveButtonProps : { style: { display: 'none' } }}
      headerButtons={({ defaultButtons }) => (
        <Space>
          {canAssignRoom && (
            <Button 
              type="primary"
              onClick={() => router.push(`/reservations/assign-room/${reservationData?.id}`)}
            >
              Assign Room
            </Button>
          )}
          {canCheckIn && (
            <Button 
              type="primary"
              onClick={() => router.push(`/reservations/check-in/${reservationData?.id}`)}
            >
              Check In
            </Button>
          )}
          {canCheckOut && (
            <Button 
              type="primary"
              onClick={() => router.push(`/reservations/check-out/${reservationData?.id}`)}
            >
              Check Out
            </Button>
          )}
          <Button onClick={() => router.push(`/reservations/payments/${reservationData?.id}`)}>
            Payments
          </Button>
          <Button onClick={() => router.push(`/reservations/services/${reservationData?.id}`)}>
            Services
          </Button>
          {defaultButtons}
        </Space>
      )}
    >
      <Form {...formProps} layout="vertical" disabled={!canEdit}>
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Guest Information" size="small">
              <Form.Item
                label="Guest"
                name="guestId"
                rules={[{ required: true }]}
              >
                <Select {...guestSelectProps} showSearch />
              </Form.Item>
              
              <Form.Item
                label="Contact Name (Snapshot)"
                name="contact_name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                label="Contact Email (Snapshot)"
                name="contact_email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                label="Contact Phone (Snapshot)"
                name="contact_phone"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                label="Confirmation Code"
                name="confirmation_code"
              >
                <Input disabled />
              </Form.Item>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="Booking Details" size="small">
              <Form.Item
                label="Check-in Date"
                name="checkIn"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              
              <Form.Item
                label="Check-out Date"
                name="checkOut"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Adults"
                    name="adults"
                    rules={[{ required: true, min: 1 }]}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Children"
                    name="children"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                label="Channel"
                name="channel"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "website", label: "Website" },
                    { value: "ota", label: "OTA" },
                    { value: "walkin", label: "Walk-in" },
                    { value: "phone", label: "Phone" },
                  ]}
                />
              </Form.Item>
              
              <Form.Item
                label="External Reference"
                name="external_ref"
              >
                <Input />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Room & Rate" size="small">
              <Form.Item
                label="Room Type"
                name="roomTypeId"
                rules={[{ required: true }]}
              >
                <Select
                  {...roomTypeSelectProps}
                  onChange={(value) => setSelectedRoomType(value)}
                />
              </Form.Item>
              
              <Form.Item
                label="Rate Plan"
                name="ratePlanId"
                rules={[{ required: true }]}
              >
                <Select {...ratePlanSelectProps} />
              </Form.Item>
              
              <Form.Item
                label="Assigned Room"
                name="assigned_room_id"
              >
                <Input disabled placeholder="Room will be assigned separately" />
              </Form.Item>
              
              <Form.Item
                label="Promotion"
                name="promotion_id"
              >
                <Select {...promotionSelectProps} allowClear />
              </Form.Item>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="Pricing" size="small">
              <Form.Item
                label="Total Amount"
                name="totalAmount"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  prefix="$"
                />
              </Form.Item>
              
              <Form.Item
                label="Tax Amount"
                name="taxAmount"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  prefix="$"
                />
              </Form.Item>
              
              <Form.Item
                label="Discount Amount"
                name="discountAmount"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  prefix="$"
                />
              </Form.Item>
              
              <Form.Item
                label="Service Amount"
                name="serviceAmount"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  prefix="$"
                  disabled
                />
              </Form.Item>
              
              <Form.Item
                label="Amount Paid"
                name="amountPaid"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  prefix="$"
                  disabled
                />
              </Form.Item>
              
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "USD", label: "USD" },
                    { value: "VND", label: "VND" },
                    { value: "EUR", label: "EUR" },
                  ]}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <Form.Item
          label="Guest Notes"
          name="guestNotes"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "checked_in", label: "Checked In" },
                  { value: "checked_out", label: "Checked Out" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "no_show", label: "No Show" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Payment Status"
              name="paymentStatus"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "unpaid", label: "Unpaid" },
                  { value: "partial", label: "Partial" },
                  { value: "paid", label: "Paid" },
                  { value: "refunded", label: "Refunded" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
