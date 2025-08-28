"use client";

import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Tag, Typography } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    DollarOutlined,
    TrophyOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import { getMockEmployees } from '../../../data/mockEmployees';

const { Title, Text } = Typography;

export default function HRDashboard() {
    const employees = getMockEmployees();
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const inactiveEmployees = employees.filter(emp => emp.status === 'inactive');

    // Statistics calculations
    const totalEmployees = employees.length;
    const averageSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length;

    // Department breakdown
    const departments = employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Recent employees (last 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentEmployees = employees.filter(emp =>
        new Date(emp.startDate) > threeMonthsAgo
    ).slice(0, 5);

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>HR Management Dashboard</Title>

            {/* Overview Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Employees"
                            value={totalEmployees}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active Employees"
                            value={activeEmployees.length}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Average Salary"
                            value={averageSalary}
                            prefix={<DollarOutlined />}
                            formatter={value => `${Number(value).toLocaleString()} VNĐ`}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Departments"
                            value={Object.keys(departments).length}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Department Distribution */}
                <Col xs={24} md={12}>
                    <Card title="Department Distribution" style={{ height: '400px' }}>
                        {Object.entries(departments).map(([dept, count]) => (
                            <div key={dept} style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Text>{dept}</Text>
                                    <Text strong>{count} employees</Text>
                                </div>
                                <Progress
                                    percent={(count / totalEmployees) * 100}
                                    showInfo={false}
                                    strokeColor={
                                        dept === 'IT Department' ? '#1890ff' :
                                            dept === 'Human Resources' ? '#52c41a' :
                                                dept === 'Marketing' ? '#faad14' :
                                                    dept === 'Finance' ? '#f5222d' :
                                                        '#722ed1'
                                    }
                                />
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Recent Hires */}
                <Col xs={24} md={12}>
                    <Card title="Recent Hires" style={{ height: '400px' }}>
                        <List
                            dataSource={recentEmployees}
                            renderItem={(employee) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                style={{ backgroundColor: '#1890ff' }}
                                                icon={<UserOutlined />}
                                            />
                                        }
                                        title={employee.fullName}
                                        description={
                                            <div>
                                                <div>{employee.position}</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    <CalendarOutlined /> Started: {employee.startDate}
                                                </div>
                                            </div>
                                        }
                                    />
                                    <Tag color={employee.status === 'active' ? 'green' : 'red'}>
                                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                                    </Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Employee Status Overview */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card title="Employee Status Overview">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <Progress
                                        type="circle"
                                        percent={Math.round((activeEmployees.length / totalEmployees) * 100)}
                                        format={(percent) => `${activeEmployees.length}\nActive`}
                                        strokeColor="#52c41a"
                                        size={120}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <Progress
                                        type="circle"
                                        percent={Math.round((inactiveEmployees.length / totalEmployees) * 100)}
                                        format={(percent) => `${inactiveEmployees.length}\nInactive`}
                                        strokeColor="#f5222d"
                                        size={120}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card title="Quick Contact Info">
                        <Row gutter={[16, 16]}>
                            {activeEmployees.slice(0, 6).map((employee) => (
                                <Col xs={24} sm={12} md={8} key={employee.id}>
                                    <Card size="small" style={{ textAlign: 'center' }}>
                                        <Avatar
                                            size={48}
                                            style={{ backgroundColor: '#1890ff', marginBottom: '8px' }}
                                            icon={<UserOutlined />}
                                        />
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            {employee.fullName}
                                        </div>
                                        <div style={{ color: '#666', marginBottom: '8px' }}>
                                            {employee.position}
                                        </div>
                                        <div style={{ fontSize: '12px' }}>
                                            <div><MailOutlined /> {employee.email}</div>
                                            <div><PhoneOutlined /> {employee.phone}</div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
