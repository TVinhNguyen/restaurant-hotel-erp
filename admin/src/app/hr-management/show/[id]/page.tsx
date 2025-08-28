"use client";

import { Show, TextField, NumberField } from "@refinedev/antd";
import { Typography, Tag } from "antd";
import { useParams } from "next/navigation";
import { getMockEmployee } from "../../../../data/mockEmployees";

const { Title } = Typography;

export default function CategoryShow() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const employee = getMockEmployee(id || '');

  if (!employee) {
    return (
      <Show>
        <Title level={3}>Không tìm thấy nhân viên</Title>
      </Show>
    );
  }

  return (
    <Show>
      <Title level={5}>{"ID"}</Title>
      <TextField value={employee.id} />

      <Title level={5}>{"Họ và tên"}</Title>
      <TextField value={employee.fullName} />

      <Title level={5}>{"Chức vụ"}</Title>
      <TextField value={employee.position} />

      <Title level={5}>{"Phòng ban"}</Title>
      <TextField value={employee.department} />

      <Title level={5}>{"Email"}</Title>
      <TextField value={employee.email} />

      <Title level={5}>{"Số điện thoại"}</Title>
      <TextField value={employee.phone} />

      <Title level={5}>{"Ngày bắt đầu làm việc"}</Title>
      <TextField value={employee.startDate} />

      <Title level={5}>{"Mức lương"}</Title>
      <NumberField
        value={employee.salary}
        options={{
          style: "currency",
          currency: "VND",
        }}
      />

      <Title level={5}>{"Trạng thái"}</Title>
      <Tag color={employee.status === 'active' ? 'green' : 'red'}>
        {employee.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
      </Tag>
    </Show>
  );
}
