"use client";

import { Edit } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, message } from "antd";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMockEmployee, updateMockEmployee } from "../../../../data/mockEmployees";
import dayjs from "dayjs";

export default function CategoryEdit() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      const employee = getMockEmployee(id);
      if (employee) {
        form.setFieldsValue({
          ...employee,
          startDate: dayjs(employee.startDate),
        });
      }
    }
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    if (!id) return;

    setLoading(true);
    try {
      const updatedData = {
        ...values,
        title: values.position, // Sử dụng position làm title
        startDate: values.startDate.format('YYYY-MM-DD'),
      };

      const result = updateMockEmployee(id, updatedData);

      if (result) {
        message.success('Cập nhật nhân viên thành công!');
        router.push('/hr-management');
      } else {
        message.error('Không tìm thấy nhân viên để cập nhật!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Edit
      saveButtonProps={{
        loading,
        onClick: () => form.submit(),
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label={"Họ và tên"}
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label={"Chức vụ"}
          name="position"
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
        >
          <Input placeholder="Ví dụ: Senior Developer" />
        </Form.Item>

        <Form.Item
          label={"Phòng ban"}
          name="department"
          rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
        >
          <Select placeholder="Chọn phòng ban">
            <Select.Option value="IT Department">IT Department</Select.Option>
            <Select.Option value="Human Resources">Human Resources</Select.Option>
            <Select.Option value="Marketing">Marketing</Select.Option>
            <Select.Option value="Finance">Finance</Select.Option>
            <Select.Option value="Sales">Sales</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={"Email"}
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="example@company.com" />
        </Form.Item>

        <Form.Item
          label={"Số điện thoại"}
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="0901234567" />
        </Form.Item>

        <Form.Item
          label={"Ngày bắt đầu làm việc"}
          name="startDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Chọn ngày bắt đầu"
          />
        </Form.Item>

        <Form.Item
          label={"Mức lương (VNĐ)"}
          name="salary"
          rules={[{ required: true, message: 'Vui lòng nhập mức lương!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="25000000"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label={"Trạng thái"}
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Select.Option value="active">Đang làm việc</Select.Option>
            <Select.Option value="inactive">Nghỉ việc</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Edit>
  );
}
