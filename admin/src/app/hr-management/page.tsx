"use client";

import React from 'react';
import { Card, Row, Col, Button, Typography, Space, Avatar, List, Tag, Statistic, Progress } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getMockEmployees } from '../../data/mockEmployees';
import { getMockLeaveRequests, getMockAttendance } from '../../data/mockAttendance';
import { getMockPayrollRecords } from '../../data/mockPayroll';
import { getMockEvaluations } from '../../data/mockEvaluations';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export default function HRManagementHub() {
  const router = useRouter();
  const employees = getMockEmployees();
  const leaveRequests = getMockLeaveRequests();
  const attendance = getMockAttendance();
  const payroll = getMockPayrollRecords();
  const evaluations = getMockEvaluations();

  // Calculate quick stats
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length;
  const todayAttendance = attendance.filter(att => att.date === dayjs().format('YYYY-MM-DD'));
  const presentToday = todayAttendance.filter(att => att.status === 'present' || att.status === 'late').length;
  const monthlyPayroll = payroll.filter(p => p.month === dayjs().format('MM') && p.year === dayjs().year());
  const pendingEvaluations = evaluations.filter(evaluation => evaluation.status === 'draft').length;

  const quickActions = [
    {
      title: 'Employee Management',
      description: 'Manage employee information, add new employees, update details',
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/hr-management/employees',
      color: '#1890ff',
      stats: `${employees.length} Total Employees`,
    },
    {
      title: 'Employee Evaluations',
      description: 'Conduct performance reviews, rate employees, track development',
      icon: <StarOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      path: '/hr-management/evaluations',
      color: '#eb2f96',
      stats: `${pendingEvaluations} Pending Reviews`,
    },
    {
      title: 'Attendance Tracking',
      description: 'Track daily attendance, manage working hours and overtime',
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      path: '/hr-management/attendance',
      color: '#52c41a',
      stats: `${presentToday}/${employees.filter(e => e.status === 'active').length} Present Today`,
    },
    {
      title: 'Leave Management',
      description: 'Handle leave requests, approve/reject applications',
      icon: <CalendarOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      path: '/hr-management/leaves',
      color: '#faad14',
      stats: `${pendingLeaves} Pending Requests`,
    },
    {
      title: 'Payroll Management',
      description: 'Process salaries, calculate overtime, manage payments',
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/hr-management/payroll',
      color: '#722ed1',
      stats: `${monthlyPayroll.length} Records This Month`,
    },
    {
      title: 'HR Dashboard',
      description: 'View comprehensive HR analytics and insights',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      path: '/hr-management/dashboard',
      color: '#13c2c2',
      stats: 'Analytics & Reports',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'leave',
      message: 'Lê Minh Cường applied for annual leave',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'attendance',
      message: 'Trần Thị Bình marked as late today',
      time: '4 hours ago',
      status: 'info',
    },
    {
      id: '3',
      type: 'payroll',
      message: 'August payroll processed for 3 employees',
      time: '1 day ago',
      status: 'success',
    },
    {
      id: '4',
      type: 'employee',
      message: 'New employee onboarding completed',
      time: '2 days ago',
      status: 'success',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>HR Management System</Title>
          <Paragraph style={{ margin: 0, color: '#666' }}>
            Comprehensive human resource management for your organization
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button icon={<BellOutlined />}>
              Notifications {pendingLeaves > 0 && <span style={{ color: '#ff4d4f' }}>({pendingLeaves})</span>}
            </Button>
            <Button icon={<SettingOutlined />}>Settings</Button>
          </Space>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Employees"
              value={employees.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Employees"
              value={activeEmployees}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Present Today"
              value={presentToday}
              suffix={`/ ${activeEmployees}`}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Leaves"
              value={pendingLeaves}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {quickActions.map((action, index) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={8} key={index}>
            <Card
              hoverable
              style={{
                height: '160px',
                cursor: 'pointer',
                border: `2px solid ${action.color}20`,
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ padding: '20px' }}
              onClick={() => router.push(action.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${action.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Row align="middle" style={{ height: '100%' }}>
                <Col span={6}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: `${action.color}15`,
                  }}>
                    {action.icon}
                  </div>
                </Col>
                <Col span={18}>
                  <div style={{ paddingLeft: '16px' }}>
                    <Title level={5} style={{ margin: 0, color: action.color }}>
                      {action.title}
                    </Title>
                    <Paragraph
                      style={{
                        margin: '4px 0',
                        fontSize: '12px',
                        color: '#666',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {action.description}
                    </Paragraph>
                    <Text style={{ fontSize: '11px', color: action.color, fontWeight: 'bold' }}>
                      {action.stats}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activities and Quick Info */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Recent Activities" extra={<Button type="link">View All</Button>}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: item.status === 'pending' ? '#faad14' :
                            item.status === 'success' ? '#52c41a' : '#1890ff'
                        }}
                        icon={
                          item.type === 'leave' ? <CalendarOutlined /> :
                            item.type === 'attendance' ? <ClockCircleOutlined /> :
                              item.type === 'payroll' ? <DollarOutlined /> :
                                <UserOutlined />
                        }
                      />
                    }
                    title={item.message}
                    description={item.time}
                  />
                  <Tag color={
                    item.status === 'pending' ? 'warning' :
                      item.status === 'success' ? 'success' : 'processing'
                  }>
                    {item.status}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Department Overview">
            {Object.entries(
              employees.reduce((acc, emp) => {
                acc[emp.department] = (acc[emp.department] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([dept, count]) => (
              <div key={dept} style={{ marginBottom: '16px' }}>
                <Row justify="space-between" style={{ marginBottom: '4px' }}>
                  <Col>{dept}</Col>
                  <Col>{count} employees</Col>
                </Row>
                <Progress
                  percent={(count / employees.length) * 100}
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
      </Row>
    </div>
  );
}
