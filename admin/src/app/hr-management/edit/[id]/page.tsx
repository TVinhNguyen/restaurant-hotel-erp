"use client";

import { Edit } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, message } from "antd";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Employee, getMockEmployee, updateMockEmployee } from "../../../../data/mockEmployees";
import dayjs from "dayjs";

export default function CategoryEdit() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [emailEdit, setEmailEdit] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const getEmployee = async (id: string) => {
      try {
        setLoading(true);
        const employeesResponse = await fetch(`${API_ENDPOINT}/employees/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();

          const formattedEmployee = {
            id: employeesData.id || employeesData.data?.id,
            userId: employeesData.userId || employeesData.data?.userId || 'Unknown',
            fullName: employeesData.fullName || employeesData.full_name || employeesData.data?.fullName || employeesData.data?.full_name || 'Unknown',
            email: employeesData.email || employeesData.user?.email || employeesData.data?.email || employeesData.data?.user?.email || 'No email',
            position: employeesData.position || employeesData.data?.position || 'Not specified',
            department: employeesData.department || employeesData.data?.department || 'Unassigned',
            phone: employeesData.phone || employeesData.user?.phone || employeesData.data?.phone || employeesData.data?.user?.phone || 'No phone',
            hireDate: employeesData.hireDate || employeesData.hire_date || employeesData.data?.hireDate || employeesData.data?.hire_date || new Date().toISOString(),
            salary: employeesData.salary || employeesData.data?.salary || 0,
            status: employeesData.status || employeesData.data?.status || 'active',
            employeeCode: employeesData.employeeCode || employeesData.employee_code || employeesData.data?.employeeCode || employeesData.data?.employee_code,
            terminationDate: employeesData.terminationDate || employeesData.termination_date || employeesData.data?.terminationDate || employeesData.data?.termination_date,
          };
          console.log('Formatted employee:', formattedEmployee);
          setEmployee(formattedEmployee);
          if (formattedEmployee) {
            form.setFieldsValue({
              ...formattedEmployee,
              hireDate: formattedEmployee.hireDate ? dayjs(formattedEmployee.hireDate) : null
            });
          }
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEmployee(id);
    }
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    console.log(values);
    console.log(employee);
    setLoading(true);
    try {
      if (emailEdit || phoneEdit) {
        await fetch(`${API_ENDPOINT}/users/${employee?.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            email: emailEdit ? values.email : undefined,
            phone: phoneEdit ? values.phone : undefined,
          })
        });
      }
      await fetch(`${API_ENDPOINT}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fullName: values.fullName,
          department: values.department,
          position: values.position,
          hireDate: values.hireDate.format('YYYY-MM-DD'),
          status: values.status
        })
      });
      message.success('Cập nhật nhân viên thành công!');
      router.push('/hr-management');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật nhân viên!');
    } finally {
      setLoading(false);
    }
    // nên cân nhắc để có thể update cái mock data!
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
          <Input placeholder="example@company.com" onChange={() => setEmailEdit(true)} />
        </Form.Item>

        <Form.Item
          label={"Số điện thoại"}
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="0901234567" onChange={() => setPhoneEdit(true)} />
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
