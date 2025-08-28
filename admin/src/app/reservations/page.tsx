"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table, Tag, Button, Select, DatePicker, Input, Dropdown, MenuProps } from "antd";
import { DownOutlined, MoreOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;

export default function ReservationList() {
  const router = useRouter();
  const [filters, setFilters] = useState<{
    status?: string;
    channel?: string;
    dateRange?: any;
    search?: string;
  }>({});

  const { tableProps } = useTable({
    syncWithLocation: true,
    filters: {
      permanent: [
        ...(filters.status ? [{ field: "status", operator: "eq" as const, value: filters.status }] : []),
        ...(filters.channel ? [{ field: "channel", operator: "eq" as const, value: filters.channel }] : []),
        ...(filters.dateRange ? [
          { field: "checkIn", operator: "gte" as const, value: filters.dateRange[0] },
          { field: "checkOut", operator: "lte" as const, value: filters.dateRange[1] },
        ] : []),
        ...(filters.search ? [
          { field: "confirmation_code", operator: "contains" as const, value: filters.search },
        ] : []),
      ],
    },
  });

  const { data: guestData, isLoading: guestIsLoading } = useMany({
    resource: "guests",
    ids: tableProps?.dataSource?.map((item) => item?.guestId).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { data: roomTypeData, isLoading: roomTypeIsLoading } = useMany({
    resource: "roomTypes",
    ids: tableProps?.dataSource?.map((item) => item?.roomTypeId).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
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

  const channelLabels = {
    ota: "OTA",
    website: "Website",
    walkin: "Walk-in",
    phone: "Phone",
  };

  return (
    <List
      headerButtons={({ defaultButtons }) => (
        <>
          <Space wrap>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "checked_in", label: "Checked In" },
                { value: "checked_out", label: "Checked Out" },
                { value: "cancelled", label: "Cancelled" },
                { value: "no_show", label: "No Show" },
              ]}
            />
            <Select
              placeholder="Filter by Channel"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => setFilters({ ...filters, channel: value })}
              options={[
                { value: "ota", label: "OTA" },
                { value: "website", label: "Website" },
                { value: "walkin", label: "Walk-in" },
                { value: "phone", label: "Phone" },
              ]}
            />
            <RangePicker
              placeholder={["Check-in", "Check-out"]}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            />
            <Input.Search
              placeholder="Search by confirmation code"
              allowClear
              style={{ width: 200 }}
              onSearch={(value) => setFilters({ ...filters, search: value })}
            />
          </Space>
          {defaultButtons}
        </>
      )}
    >
      <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
        <Table.Column dataIndex="confirmation_code" title="Confirmation" width={120} />
        <Table.Column
          dataIndex="guestId"
          title="Guest"
          width={150}
          render={(value) =>
            guestIsLoading ? (
              "Loading..."
            ) : (
              guestData?.data?.find((item) => item.id === value)?.name || "-"
            )
          }
        />
        <Table.Column
          dataIndex="checkIn"
          title="Check-in"
          width={100}
          render={(value) => <DateField value={value} format="DD/MM/YY" />}
        />
        <Table.Column
          dataIndex="checkOut"
          title="Check-out"
          width={100}
          render={(value) => <DateField value={value} format="DD/MM/YY" />}
        />
        <Table.Column
          dataIndex="roomTypeId"
          title="Room Type"
          width={120}
          render={(value) =>
            roomTypeIsLoading ? (
              "Loading..."
            ) : (
              roomTypeData?.data?.find((item) => item.id === value)?.name || "-"
            )
          }
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          width={110}
          render={(value) => (
            <Tag color={statusColors[value as keyof typeof statusColors]}>
              {value?.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="channel"
          title="Channel"
          width={80}
          render={(value) => channelLabels[value as keyof typeof channelLabels] || value}
        />
        <Table.Column
          dataIndex="adults"
          title="Pax"
          width={60}
          render={(value, record: any) => `${value}+${record.children || 0}`}
        />
        <Table.Column
          dataIndex="totalAmount"
          title="Total"
          width={100}
          render={(value, record: any) => `${value} ${record.currency || 'USD'}`}
        />
        <Table.Column
          dataIndex="paymentStatus"
          title="Payment"
          width={100}
          render={(value) => (
            <Tag color={value === 'paid' ? 'green' : value === 'partial' ? 'orange' : 'red'}>
              {value?.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          width={200}
          fixed="right"
          render={(_, record: BaseRecord) => {
            const getQuickActions = (record: any): MenuProps['items'] => [
              {
                key: 'payments',
                label: 'Manage Payments',
                onClick: () => router.push(`/reservations/payments/${record.id}`),
              },
              {
                key: 'services', 
                label: 'Manage Services',
                onClick: () => router.push(`/reservations/services/${record.id}`),
              },
              ...(record.status === 'confirmed' && !record.assigned_room_id ? [{
                key: 'assign',
                label: 'Assign Room',
                onClick: () => router.push(`/reservations/assign-room/${record.id}`),
              }] : []),
              ...(record.status === 'confirmed' && record.assigned_room_id ? [{
                key: 'checkin',
                label: 'Check In Guest',
                onClick: () => router.push(`/reservations/check-in/${record.id}`),
              }] : []),
              ...(record.status === 'checked_in' ? [{
                key: 'checkout',
                label: 'Check Out Guest', 
                onClick: () => router.push(`/reservations/check-out/${record.id}`),
              }] : []),
            ];

            return (
              <Space wrap size="small">
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
                
                {/* Primary action button based on status */}
                {record.status === 'confirmed' && !record.assigned_room_id && (
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={() => router.push(`/reservations/assign-room/${record.id}`)}
                  >
                    Assign Room
                  </Button>
                )}
                
                {record.status === 'confirmed' && record.assigned_room_id && (
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={() => router.push(`/reservations/check-in/${record.id}`)}
                  >
                    Check In
                  </Button>
                )}
                
                {record.status === 'checked_in' && (
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={() => router.push(`/reservations/check-out/${record.id}`)}
                  >
                    Check Out
                  </Button>
                )}

                {/* Quick Actions Dropdown */}
                <Dropdown 
                  menu={{ items: getQuickActions(record) }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button size="small" icon={<MoreOutlined />} />
                </Dropdown>
                
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
}
