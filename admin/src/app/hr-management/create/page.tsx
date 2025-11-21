"use client";

import { Create } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, message } from "antd";
import { useState } from "react";
import { addMockEmployee } from "../../../data/mockEmployees";
import { useRouter } from "next/navigation";

export default function CategoryCreate() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
    try {
      const userResponse = await fetch(`${API_ENDPOINT}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: 'defaultPassword123!',
          name: values.fullName,
          phone: values.phone,
        }),
      });
      if (userResponse.ok) {
        const registerData = await userResponse.json();
        const apiUser = registerData.user || registerData;
        console.log('Registered user from API:', apiUser);
        const savedEmployee = {
          userId: apiUser.id,
          employeeCode: `EMP-${Date.now()}`,
          fullName: values.fullName,
          position: values.position,
          department: values.department,
          hireDate: values.hireDate.format('YYYY-MM-DD'),
          status: values.status,
        }
        const employeeResponse = await fetch(`${API_ENDPOINT}/employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(savedEmployee)
        });
        if (employeeResponse.ok) {
          const employeeData = await employeeResponse.json();
          console.log('Created employee from API:', employeeData);
          message.success('Thêm nhân viên thành công!');
          router.push('/hr-management');
          addMockEmployee({
            ...employeeData,
            email: values.email,
            phone: values.phone
          });
        } else {
          const errorData = await employeeResponse.json();
          console.error('Create employee API error:', errorData);
          message.error(errorData.message || 'Có lỗi xảy ra khi thêm nhân viên!');
        }
      } else {
        const errorData = await userResponse.json();
        console.error('Register API error:', errorData);
        message.error(errorData.message || 'Có lỗi xảy ra khi đăng ký tài khoản!');
      }
    } catch (error) {
      console.error('Network or other error:', error);
      message.error('Có lỗi xảy ra khi thêm nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Create
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
          name="hireDate"
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
          initialValue="active"
        >
          <Select>
            <Select.Option value="active">Đang làm việc</Select.Option>
            <Select.Option value="terminated">Nghỉ việc</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Create>
  );
}
