"use client";

import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag } from "antd";
import { useEffect, useState } from "react";
import { getMockEmployees, deleteMockEmployee, type Employee } from "../../../data/mockEmployees";
import { PlusOutlined, SearchOutlined, UserOutlined, StarOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const { Title } = Typography;
const { Search } = Input;

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>(getMockEmployees());
    const [employees2, setEmployees2] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(getMockEmployees());
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const router = useRouter();
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

    useEffect(() => {
        const getAllEmployees = async () => {
            const employeesResponse = await fetch(`${API_ENDPOINT}/employees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            }).then()
            if (employeesResponse.ok) {
                const employeesData = await employeesResponse.json();
                const formattedEmployees = employeesData.data.map((employee: any, index: number) => {
                    console.log(`Employee ${index + 1}:`, employee);
                    return {
                        id: employee.id || `emp-${index}`,
                        userId: employeesData.userId || employeesData.data?.userId || 'Unknown',
                        fullName: employee.fullName || employee.full_name || 'Unknown',
                        email: employee.email || employee.user?.email || 'No email',
                        position: employee.position || 'Not specified',
                        department: employee.department || 'Unassigned',
                        phone: employee.phone || employee.user?.phone || 'No phone',
                        hireDate: employee.hireDate || employee.hire_date || dayjs().format('YYYY-MM-DD'),
                        salary: employee.salary || 0,
                        status: employee.status || 'active',
                        employeeCode: employee.employeeCode || employee.employee_code,
                        terminationDate: employee.terminationDate || employee.termination_date,
                    };
                });
                console.log(formattedEmployees);
                setEmployees2(formattedEmployees);
                setFilteredEmployees(formattedEmployees);
            }
        }
        getAllEmployees();
    }, [])

    const handleDelete = async (id: string, userId: string) => {
        console.log(id, userId);
        try {
            if (id) {
                await fetch(`${API_ENDPOINT}/employees/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                if (userId !== 'Unknown') {
                    await fetch(`${API_ENDPOINT}/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    });
                }
            }
            message.success('Employee deleted successfully!');
            const updatedEmployees = employees2.filter(emp => emp.id !== id);
            setEmployees2(updatedEmployees);
            setFilteredEmployees(updatedEmployees);
        } catch (error) {
            message.error('Error deleting employee!');
        }
        // if (deleteMockEmployee(id)) {
        //     const updatedEmployees = getMockEmployees();
        //     setEmployees(updatedEmployees);
        //     setFilteredEmployees(updatedEmployees);
        //     message.success('Employee deleted successfully!');
        // } else {
        //     message.error('Error deleting employee!');
        // }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        filterEmployees(value, statusFilter, departmentFilter);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        filterEmployees(searchText, value, departmentFilter);
    };

    const handleDepartmentFilter = (value: string) => {
        setDepartmentFilter(value);
        filterEmployees(searchText, statusFilter, value);
    };

    const filterEmployees = (search: string, status: string, department: string) => {
        // let filtered = employees;
        console.log('come here to filter!');
        let filtered = employees2;

        if (search) {
            filtered = filtered.filter(emp =>
                emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
                emp.position.toLowerCase().includes(search.toLowerCase()) ||
                emp.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (status !== 'all') {
            filtered = filtered.filter(emp => emp.status === status);
        }

        if (department !== 'all') {
            filtered = filtered.filter(emp => emp.department === department);
        }

        setFilteredEmployees(filtered);
    };

    const departments = Array.from(new Set(employees.map(emp => emp.department)));

    const tableProps = {
        dataSource: filteredEmployees,
        pagination: {
            pageSize: 10,
            total: filteredEmployees.length,
            showSizeChanger: true,
            showQuickJumper: true,
        },
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        Employee Management
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/hr-management/create')}
                    >
                        Add Employee
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search employees..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            placeholder="Status"
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={handleStatusFilter}
                        >
                            <Select.Option value="all">All Status</Select.Option>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={6} md={6}>
                        <Select
                            placeholder="Department"
                            style={{ width: '100%' }}
                            value={departmentFilter}
                            onChange={handleDepartmentFilter}
                        >
                            <Select.Option value="all">All Departments</Select.Option>
                            {departments.map(dept => (
                                <Select.Option key={dept} value={dept}>{dept}</Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={6}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#666' }}>
                                Showing {filteredEmployees.length} of {employees.length} employees
                            </span>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Employee Table */}
            <Card>
                <List>
                    <Table {...tableProps} rowKey="id" scroll={{ x: 800 }}>
                        <Table.Column
                            dataIndex="id"
                            title="ID"
                            width={60}
                            render={(_, record, index) => index + 1}
                            sorter={(a: Employee, b: Employee) => parseInt(a.id) - parseInt(b.id)}
                        />
                        <Table.Column
                            dataIndex="fullName"
                            title="Name"
                            sorter={(a: Employee, b: Employee) => a.fullName.localeCompare(b.fullName)}
                            render={(fullName: string, record: Employee) => (
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{fullName}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
                                </div>
                            )}
                        />
                        <Table.Column
                            dataIndex="position"
                            title="Position"
                            sorter={(a: Employee, b: Employee) => a.position.localeCompare(b.position)}
                        />
                        <Table.Column
                            dataIndex="department"
                            title="Department"
                            filters={departments.map(dept => ({ text: dept, value: dept }))}
                            onFilter={(value: any, record: Employee) => record.department === value}
                        />
                        <Table.Column
                            dataIndex="phone"
                            title="Phone"
                            responsive={['md']}
                        />
                        <Table.Column
                            dataIndex="startDate"
                            title="Start Date"
                            responsive={['lg']}
                            sorter={(a: Employee, b: Employee) => new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime()}
                            render={(date: string) => dayjs(date).format('DD/MM/YYYY')}
                        />
                        <Table.Column
                            dataIndex="salary"
                            title="Salary"
                            responsive={['lg']}
                            sorter={(a: Employee, b: Employee) => (a.salary || 0) - (b.salary || 0)}
                            render={(salary: number) => `${salary?.toLocaleString() || 0} VNĐ`}
                        />
                        <Table.Column
                            dataIndex="status"
                            title="Status"
                            render={(status: string) => (
                                <Tag color={status === 'active' ? 'green' : 'red'}>
                                    {status === 'active' ? 'Active' : 'Inactive'}
                                </Tag>
                            )}
                            filters={[
                                { text: 'Active', value: 'active' },
                                { text: 'Inactive', value: 'inactive' },
                            ]}
                            onFilter={(value: any, record: Employee) => record.status === value}
                        />
                        <Table.Column
                            title="Actions"
                            dataIndex="actions"
                            fixed="right"
                            width={160}
                            render={(_, record: BaseRecord) => (
                                <Space direction="vertical" size="small">
                                    <Space size="small">
                                        <ShowButton hideText size="small" recordItemId={record.id} />
                                        <EditButton hideText size="small" recordItemId={record.id} />
                                        <DeleteButton
                                            hideText
                                            size="small"
                                            recordItemId={record.id}
                                            onSuccess={() => handleDelete(String(record.id), String(record.userId))}
                                        />
                                    </Space>
                                    <Button
                                        size="small"
                                        type="link"
                                        icon={<StarOutlined />}
                                        onClick={() => router.push(`/hr-management/evaluations?employee=${record.id}`)}
                                        style={{ padding: '0', height: 'auto' }}
                                    >
                                        Evaluate
                                    </Button>
                                </Space>
                            )}
                        />
                    </Table>
                </List>
            </Card>
        </div>
    );
}
