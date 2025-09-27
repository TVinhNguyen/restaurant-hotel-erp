"use client";

import React from 'react';
import { Card, Row, Col, Statistic, Button, Typography, Progress, Space, Tag } from 'antd';
import { 
    HomeOutlined,
    AppstoreOutlined,
    ToolOutlined,
    PlusOutlined,
    EyeOutlined,
    SettingOutlined,
    PictureOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { 
    getMockRooms,
    getMockRoomTypes,
    getMockAmenities,
    getMockProperties,
    getMockPhotos,
    getMockRoomStatusHistory 
} from '../../data/mockInventory';

const { Title, Text } = Typography;

export default function InventoryManagementHub() {
    const router = useRouter();
    const rooms = getMockRooms();
    const roomTypes = getMockRoomTypes();
    const amenities = getMockAmenities();
    const properties = getMockProperties();
    const photos = getMockPhotos();
    const statusHistory = getMockRoomStatusHistory();

    // Calculate quick stats
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(room => room.operationalStatus === 'available').length;
    const outOfServiceRooms = rooms.filter(room => room.operationalStatus === 'out_of_service').length;
    const cleanRooms = rooms.filter(room => room.housekeepingStatus === 'clean').length;
    const dirtyRooms = rooms.filter(room => room.housekeepingStatus === 'dirty').length;
    const inspectedRooms = rooms.filter(room => room.housekeepingStatus === 'inspected').length;

    const occupancyRate = Math.round((availableRooms / totalRooms) * 100);

    const quickActions = [
        {
            title: 'Room Types Management',
            description: 'Manage room categories, pricing, and amenities',
            icon: <AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
            path: '/inventory-management/room-types',
            color: '#1890ff'
        },
        {
            title: 'Rooms Management',
            description: 'Manage individual rooms, status, and maintenance',
            icon: <HomeOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
            path: '/inventory-management/rooms',
            color: '#52c41a'
        },
        {
            title: 'Amenities Management',
            description: 'Manage hotel facilities and room amenities',
            icon: <ToolOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
            path: '/inventory-management/amenities',
            color: '#faad14'
        },
        {
            title: 'Photos Management',
            description: 'Manage room type photos and galleries',
            icon: <PictureOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
            path: '/inventory-management/photos',
            color: '#722ed1'
        },
        {
            title: 'Status History',
            description: 'Track room status changes and maintenance history',
            icon: <HistoryOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
            path: '/inventory-management/room-status-history',
            color: '#eb2f96'
        },
        {
            title: 'Room Maintenance',
            description: 'Manage maintenance requests and track progress',
            icon: <ToolOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
            path: '/inventory-management/room-maintenance',
            color: '#52c41a'
        }
    ];

    const handleQuickAction = (path: string) => {
        router.push(path);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <HomeOutlined style={{ marginRight: '8px' }} />
                        Inventory Management
                    </Title>
                    <Text type="secondary">Manage room types, rooms, and amenities</Text>
                </Col>
            </Row>

            {/* Quick Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Rooms"
                            value={totalRooms}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Available Rooms"
                            value={availableRooms}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Room Types"
                            value={roomTypes.length}
                            prefix={<AppstoreOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Amenities"
                            value={amenities.length}
                            prefix={<ToolOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Additional Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Photos"
                            value={photos.length}
                            prefix={<PictureOutlined />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Status Changes Today"
                            value={statusHistory.filter(h => {
                                const today = new Date();
                                const historyDate = new Date(h.changedAt);
                                return historyDate.toDateString() === today.toDateString();
                            }).length}
                            prefix={<HistoryOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Properties"
                            value={properties.length}
                            prefix={<SettingOutlined />}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Out of Service"
                            value={outOfServiceRooms}
                            prefix={<ToolOutlined />}
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {quickActions.slice(0, 3).map((action, index) => (
                    <Col xs={24} md={8} key={index}>
                        <Card
                            hoverable
                            onClick={() => handleQuickAction(action.path)}
                            style={{ height: '100%' }}
                        >
                            <Row align="middle" gutter={16}>
                                <Col flex="none">
                                    {action.icon}
                                </Col>
                                <Col flex="auto">
                                    <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                        {action.title}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                        {action.description}
                                    </Text>
                                </Col>
                                <Col flex="none">
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        style={{ backgroundColor: action.color, borderColor: action.color }}
                                    >
                                        Manage
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Additional Actions */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {quickActions.slice(3).map((action, index) => (
                    <Col xs={24} sm={12} md={8} key={index + 3}>
                        <Card
                            hoverable
                            onClick={() => handleQuickAction(action.path)}
                            style={{ height: '100%', textAlign: 'center' }}
                        >
                            <Space direction="vertical" size="small">
                                {action.icon}
                                <Title level={5} style={{ margin: 0 }}>
                                    {action.title}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {action.description}
                                </Text>
                                <Button 
                                    size="small"
                                    type="primary" 
                                    style={{ backgroundColor: action.color, borderColor: action.color }}
                                >
                                    Access
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Status Overview */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Room Operational Status" extra={<SettingOutlined />}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <Progress
                                        type="circle"
                                        percent={Math.round((availableRooms / totalRooms) * 100)}
                                        strokeColor="#52c41a"
                                        size={80}
                                    />
                                    <div style={{ marginTop: '8px' }}>
                                        <Text strong>Available</Text>
                                        <br />
                                        <Text type="secondary">{availableRooms} rooms</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <Progress
                                        type="circle"
                                        percent={Math.round((outOfServiceRooms / totalRooms) * 100)}
                                        strokeColor="#f5222d"
                                        size={80}
                                    />
                                    <div style={{ marginTop: '8px' }}>
                                        <Text strong>Out of Service</Text>
                                        <br />
                                        <Text type="secondary">{outOfServiceRooms} rooms</Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Housekeeping Status" extra={<ToolOutlined />}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <Row justify="space-between" style={{ marginBottom: '4px' }}>
                                    <Col>
                                        <Tag color="green">Clean</Tag>
                                    </Col>
                                    <Col>{cleanRooms} rooms</Col>
                                </Row>
                                <Progress
                                    percent={Math.round((cleanRooms / totalRooms) * 100)}
                                    showInfo={false}
                                    strokeColor="#52c41a"
                                />
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <Row justify="space-between" style={{ marginBottom: '4px' }}>
                                    <Col>
                                        <Tag color="red">Dirty</Tag>
                                    </Col>
                                    <Col>{dirtyRooms} rooms</Col>
                                </Row>
                                <Progress
                                    percent={Math.round((dirtyRooms / totalRooms) * 100)}
                                    showInfo={false}
                                    strokeColor="#f5222d"
                                />
                            </div>
                            
                            <div>
                                <Row justify="space-between" style={{ marginBottom: '4px' }}>
                                    <Col>
                                        <Tag color="blue">Inspected</Tag>
                                    </Col>
                                    <Col>{inspectedRooms} rooms</Col>
                                </Row>
                                <Progress
                                    percent={Math.round((inspectedRooms / totalRooms) * 100)}
                                    showInfo={false}
                                    strokeColor="#1890ff"
                                />
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
