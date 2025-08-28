"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Row, Col, Divider, Card } from "antd";
import { useState } from "react";

export default function ReservationCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  const { selectProps: guestSelectProps } = useSelect({
    resource: "guests",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: roomTypeSelectProps } = useSelect({
    resource: "roomTypes",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: ratePlanSelectProps } = useSelect({
    resource: "ratePlans",
    optionLabel: "name",
    optionValue: "id",
    filters: selectedRoomType ? [{ field: "roomTypeId", operator: "eq", value: selectedRoomType }] : [],
  });

  const { selectProps: promotionSelectProps } = useSelect({
    resource: "promotions",
    optionLabel: "code",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
                    initialValue={1}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Children"
                    name="children"
                    initialValue={0}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                label="Channel"
                name="channel"
                rules={[{ required: true }]}
                initialValue="website"
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
                initialValue={0}
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
                initialValue={0}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  prefix="$"
                />
              </Form.Item>
              
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true }]}
                initialValue="USD"
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
              initialValue="pending"
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
              initialValue="unpaid"
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
    </Create>
  );
}