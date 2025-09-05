"use client";

import { useList, useShow, useCreate, useUpdate, useDelete } from "@refinedev/core";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Form, 
  Select, 
  InputNumber, 
  message, 
  Space, 
  Table, 
  Modal,
  DatePicker,
  Divider,
  Tag
} from "antd";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";
import { ReservationBreadcrumb } from "@/components/ReservationBreadcrumb";

const { Title, Text } = Typography;

export default function ReservationServices() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { queryResult } = useShow({
    resource: "reservations",
    id: params.id as string,
  });

  const reservation = queryResult?.data?.data;

  // Get reservation services
  const { data: reservationServicesData, isLoading: servicesLoading, refetch: refetchServices } = useList({
    resource: "reservationServices",
    filters: [
      { field: "reservationId", operator: "eq", value: params.id },
    ],
    meta: {
      populate: ["property_service"],
    },
  });

  // Get available property services
  const { data: propertyServicesData } = useList({
    resource: "propertyServices",
    filters: [
      { field: "property_id", operator: "eq", value: reservation?.property_id },
    ],
    meta: {
      populate: ["service"],
    },
  });

  const { mutate: createReservationService } = useCreate();
  const { mutate: updateReservation } = useUpdate();
  const { mutate: deleteReservationService } = useDelete();

  const handleAddService = async (values: any) => {
    if (!reservation) return;
    
    setLoading(true);
    try {
      const selectedPropertyService = propertyServicesData?.data?.find(
        (ps: any) => ps.id === values.property_service_id
      );
      
      if (!selectedPropertyService) {
        message.error("Selected service not found");
        return;
      }
      
      const totalPrice = selectedPropertyService.price * values.quantity;
      const taxAmount = totalPrice * (selectedPropertyService.tax_rate || 0) / 100;
      const finalPrice = totalPrice + taxAmount;

      createReservationService({
        resource: "reservationServices",
        values: {
          reservationId: params.id,
          property_service_id: values.property_service_id,
          quantity: values.quantity,
          totalPrice: finalPrice,
          dateProvided: values.dateProvided,
        },
      });

      // Update reservation service amount
      const newServiceAmount = (reservation.serviceAmount || 0) + finalPrice;
      const newTotalAmount = reservation.totalAmount + finalPrice;

      updateReservation({
        resource: "reservations",
        id: params.id as string,
        values: {
          serviceAmount: newServiceAmount,
          totalAmount: newTotalAmount,
        },
      });

      message.success("Service added successfully");
      setServiceModalVisible(false);
      form.resetFields();
      refetchServices();
    } catch (error) {
      message.error("Failed to add service");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveService = async (serviceId: string, totalPrice: number) => {
    if (!reservation) return;
    
    try {
      deleteReservationService({
        resource: "reservationServices",
        id: serviceId,
      });

      // Update reservation amounts
      const newServiceAmount = (reservation.serviceAmount || 0) - totalPrice;
      const newTotalAmount = reservation.totalAmount - totalPrice;

      updateReservation({
        resource: "reservations",
        id: params.id as string,
        values: {
          serviceAmount: Math.max(0, newServiceAmount),
          totalAmount: newTotalAmount,
        },
      });

      message.success("Service removed successfully");
      refetchServices();
    } catch (error) {
      message.error("Failed to remove service");
      console.error(error);
    }
  };

  const serviceColumns = [
    {
      title: 'Service',
      key: 'service',
      render: (_: any, record: any) => record.property_service?.service?.name || record.property_service?.name,
    },
    {
      title: 'Unit Price',
      key: 'unitPrice',
      render: (_: any, record: any) => `$${record.property_service?.price} ${record.property_service?.currency}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tax Rate',
      key: 'taxRate',
      render: (_: any, record: any) => `${record.property_service?.tax_rate || 0}%`,
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value: number) => `$${value?.toFixed(2)} ${reservation?.currency}`,
    },
    {
      title: 'Date Provided',
      dataIndex: 'dateProvided',
      key: 'dateProvided',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button 
          size="small" 
          danger
          onClick={() => handleRemoveService(record.id, record.totalPrice)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const totalServiceAmount = reservationServicesData?.data?.reduce(
    (sum: number, service: any) => sum + (service.totalPrice || 0), 
    0
  ) || 0;

  if (!reservation) return <div>Loading...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <ReservationBreadcrumb 
        reservationId={params.id as string}
        confirmationCode={reservation?.confirmation_code}
        currentPage="Services"
      />
      
      <Card 
        title="Reservation Services"
        extra={
          <Space>
            <Button 
              type="primary"
              onClick={() => setServiceModalVisible(true)}
            >
              Add Service
            </Button>
            <Button onClick={() => router.push(`/reservations/show/${params.id}`)}>
              Back to Reservation
            </Button>
          </Space>
        }
      >
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card size="small">
              <Text type="secondary">Room Total</Text>
              <br />
              <Text strong style={{ fontSize: "18px" }}>
                ${(reservation.totalAmount - (reservation.serviceAmount || 0)).toFixed(2)} {reservation.currency}
              </Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Text type="secondary">Services Total</Text>
              <br />
              <Text strong style={{ fontSize: "18px", color: "blue" }}>
                ${totalServiceAmount.toFixed(2)} {reservation.currency}
              </Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Text type="secondary">Grand Total</Text>
              <br />
              <Text strong style={{ fontSize: "20px", color: "green" }}>
                ${reservation.totalAmount.toFixed(2)} {reservation.currency}
              </Text>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Table
          loading={servicesLoading}
          dataSource={reservationServicesData?.data || []}
          columns={serviceColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No services added yet" }}
        />
      </Card>

      {/* Add Service Modal */}
      <Modal
        title="Add Service to Reservation"
        open={serviceModalVisible}
        onCancel={() => {
          setServiceModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddService}
        >
          <Form.Item
            label="Service"
            name="property_service_id"
            rules={[{ required: true, message: "Please select a service" }]}
          >
            <Select
              showSearch
              placeholder="Select a service"
              optionFilterProp="children"
              options={propertyServicesData?.data?.map((ps: any) => ({
                value: ps.id,
                label: `${ps.service?.name || ps.name} - $${ps.price} ${ps.currency}`,
                service: ps,
              }))}
              onChange={(value, option: any) => {
                const service = option?.service;
                if (service) {
                  form.setFieldsValue({
                    unitPrice: service.price,
                    taxRate: service.tax_rate || 0,
                  });
                }
              }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Unit Price"
                name="unitPrice"
              >
                <InputNumber
                  disabled
                  style={{ width: "100%" }}
                  formatter={(value) => `$ ${value}`}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tax Rate"
                name="taxRate"
              >
                <InputNumber
                  disabled
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}%`}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Quantity"
                name="quantity"
                initialValue={1}
                rules={[
                  { required: true, message: "Please enter quantity" },
                  { type: "number", min: 1, message: "Quantity must be at least 1" }
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Date Provided"
            name="dateProvided"
            initialValue={dayjs()}
            rules={[{ required: true, message: "Please select service date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) => {
                // Disable dates outside reservation period
                const checkIn = dayjs(reservation.checkIn);
                const checkOut = dayjs(reservation.checkOut);
                return current && (current.isBefore(checkIn, 'day') || current.isAfter(checkOut, 'day'));
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setServiceModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Service
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
