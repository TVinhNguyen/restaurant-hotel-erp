"use client";

import { Card, Row, Col, Button, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { 
  HomeOutlined, 
  CreditCardOutlined, 
  CustomerServiceOutlined,
  LoginOutlined,
  LogoutOutlined 
} from "@ant-design/icons";

const { Text } = Typography;

interface QuickActionsProps {
  reservationId: string;
  status: string;
  hasAssignedRoom: boolean;
}

export function QuickActions({ reservationId, status, hasAssignedRoom }: QuickActionsProps) {
  const router = useRouter();

  const getWorkflowActions = () => {
    const actions = [];
    
    if (status === 'confirmed' && !hasAssignedRoom) {
      actions.push({
        key: 'assign-room',
        title: 'Assign Room',
        description: 'Assign a room to this reservation',
        icon: <HomeOutlined />,
        type: 'primary' as const,
        onClick: () => router.push(`/reservations/assign-room/${reservationId}`)
      });
    }
    
    if (status === 'confirmed' && hasAssignedRoom) {
      actions.push({
        key: 'check-in',
        title: 'Check In Guest',
        description: 'Process guest check-in',
        icon: <LoginOutlined />,
        type: 'primary' as const,
        onClick: () => router.push(`/reservations/check-in/${reservationId}`)
      });
    }
    
    if (status === 'checked_in') {
      actions.push({
        key: 'check-out',
        title: 'Check Out Guest',
        description: 'Process guest check-out',
        icon: <LogoutOutlined />,
        type: 'primary' as const,
        onClick: () => router.push(`/reservations/check-out/${reservationId}`)
      });
    }
    
    return actions;
  };

  const managementActions = [
    {
      key: 'payments',
      title: 'Manage Payments',
      description: 'View and manage reservation payments',
      icon: <CreditCardOutlined />,
      type: 'default' as const,
      onClick: () => router.push(`/reservations/payments/${reservationId}`)
    },
    {
      key: 'services',
      title: 'Manage Services',
      description: 'Add and manage additional services',
      icon: <CustomerServiceOutlined />,
      type: 'default' as const,
      onClick: () => router.push(`/reservations/services/${reservationId}`)
    }
  ];

  const workflowActions = getWorkflowActions();

  return (
    <Card title="Quick Actions" size="small" style={{ marginTop: 16 }}>
      {workflowActions.length > 0 && (
        <>
          <Text strong style={{ color: '#1890ff' }}>Next Steps:</Text>
          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            {workflowActions.map((action) => (
              <Col span={24} key={action.key}>
                <Button
                  type={action.type}
                  icon={action.icon}
                  onClick={action.onClick}
                  block
                  size="large"
                >
                  <div style={{ textAlign: 'left' }}>
                    <div>{action.title}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {action.description}
                    </Text>
                  </div>
                </Button>
              </Col>
            ))}
          </Row>
        </>
      )}
      
      <Text strong style={{ color: '#666' }}>Management:</Text>
      <Row gutter={[16, 8]} style={{ marginTop: 12 }}>
        {managementActions.map((action) => (
          <Col span={12} key={action.key}>
            <Button
              type={action.type}
              icon={action.icon}
              onClick={action.onClick}
              block
            >
              {action.title}
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
