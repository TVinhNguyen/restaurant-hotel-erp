"use client";

import { Show, TextField, NumberField } from "@refinedev/antd";
import { Typography, Tag } from "antd";
import { useParams } from "next/navigation";
import { Employee, getMockEmployee } from "../../../../data/mockEmployees";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function CategoryShow() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [employee2, setEmployee2] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

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
          setEmployee2(formattedEmployee);
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
  }, [id]);

  const employee = employee2 || getMockEmployee(id || '');

  if (loading) {
    return (
      <Show>
        <Title level={3}>Đang tải...</Title>
      </Show>
    );
  }


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
      <TextField value={employee.hireDate} />

      <Title level={5}>{"Mức lương"}</Title>
      <NumberField
        value={employee.salary || 0}
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
