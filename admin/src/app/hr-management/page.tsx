"use client";

import React, { useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Avatar, List, Tag, Statistic, Progress, message } from 'antd';
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
import { Employee, getMockEmployees } from '../../data/mockEmployees';
import { getMockLeaveRequests, getMockAttendance } from '../../data/mockAttendance';
import { getMockPayrollRecords } from '../../data/mockPayroll';
import { getMockEvaluations } from '../../data/mockEvaluations';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function HRManagementHub() {
  const router = useRouter();
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = React.useState<any[]>([]);
  const [attendance, setAttendance] = React.useState<any[]>([]);
  const [payroll, setPayroll] = React.useState<any[]>([]);
  const [evaluations, setEvaluations] = React.useState<any[]>([]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/employees`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.data || []);
      } else {
        message.error('Failed to fetch employees');
      }
    } catch (error) {
      message.error('Error fetching employees');
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/leaves/get-all-leaves`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched leave requests:', data);
        setLeaveRequests(data.data || []);
      } else {
        message.error('Failed to fetch leave requests');
      }
    } catch (error) {
      message.error('Error fetching leave requests');
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/attendance/get-all-attendances`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched attendance:', data);
        setAttendance(data.data || []);
      } else {
        message.error('Failed to fetch attendance');
      }
    } catch (error) {
      message.error('Error fetching attendance');
    }
  };

  const fetchPayroll = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/payroll/get-all-payrolls`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched payroll:', data);
        setPayroll(data.data || []);
      } else {
        message.error('Failed to fetch payroll');
      }
    } catch (error) {
      message.error('Error fetching payroll');
    }
  };

  const fetchEvaluations = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/employee-evaluations/get-all-evaluations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched evaluations:', data);
        setEvaluations(data.data || []);
      } else {
        message.error('Failed to fetch evaluations');
      }
    } catch (error) {
      message.error('Error fetching evaluations');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
    fetchAttendance();
    fetchPayroll();
    fetchEvaluations();
  }, [])

  // Calculate quick stats
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length;

  // For attendance: check if date field exists, handle both date formats
  const today = dayjs().format('YYYY-MM-DD');
  const todayAttendance = attendance.filter(att => {
    if (att.date) return att.date === today;
    if (att.checkInTime) {
      return dayjs(att.checkInTime).format('YYYY-MM-DD') === today;
    }
    return false;
  });
  const presentToday = todayAttendance.filter(att => att.status === 'present' || att.status === 'late').length;

  // For payroll: handle period format (YYYY-MM)
  const currentPeriod = `${dayjs().year()}-${dayjs().format('MM')}`;
  const monthlyPayroll = payroll.filter(p => {
    if (p.period) return p.period === currentPeriod;
    return p.month === dayjs().format('MM') && p.year === dayjs().year();
  });

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

  // Generate recent activities from real data
  const recentActivities = React.useMemo(() => {
    const activities: any[] = [];

    // Add recent leave requests
    leaveRequests.slice(0, 2).forEach(leave => {
      activities.push({
        id: `leave-${leave.id}`,
        type: 'leave',
        message: `${leave.employee?.fullName || 'Employee'} applied for ${leave.leaveType || 'leave'}`,
        time: dayjs(leave.createdAt || leave.appliedDate).fromNow(),
        status: leave.status === 'pending' ? 'pending' : leave.status === 'approved' ? 'success' : 'info',
      });
    });

    // Add recent attendance (today's late arrivals)
    const lateToday = attendance.filter(att => {
      const attDate = att.date || (att.checkInTime ? dayjs(att.checkInTime).format('YYYY-MM-DD') : null);
      return attDate === today && att.status === 'late';
    }).slice(0, 1);

    lateToday.forEach(att => {
      activities.push({
        id: `att-${att.id}`,
        type: 'attendance',
        message: `${att.employee?.fullName || 'Employee'} marked as late today`,
        time: att.checkInTime ? dayjs(att.checkInTime).fromNow() : 'Today',
        status: 'info',
      });
    });

    // Add recent payroll
    const recentPayroll = payroll.filter(p => p.status === 'paid').slice(0, 1);
    recentPayroll.forEach(p => {
      const period = p.period || `${p.year}-${p.month}`;
      activities.push({
        id: `payroll-${p.id}`,
        type: 'payroll',
        message: `${period} payroll processed for ${p.employee?.fullName || 'employee'}`,
        time: p.paidDate ? dayjs(p.paidDate).fromNow() : dayjs(p.updatedAt).fromNow(),
        status: 'success',
      });
    });

    // Add new employees
    const recentEmployees = employees.filter(emp => emp.hireDate).slice(0, 1);
    recentEmployees.forEach(emp => {
      activities.push({
        id: `emp-${emp.id}`,
        type: 'employee',
        message: `${emp.fullName} joined as ${emp.position}`,
        time: dayjs(emp.hireDate).fromNow(),
        status: 'success',
      });
    });

    // Sort by time (most recent first) and return top 4
    return activities.slice(0, 4);
  }, [leaveRequests, attendance, payroll, employees, today]);

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
          <Card title="Recent Activities">
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
    </div >
  );
}
