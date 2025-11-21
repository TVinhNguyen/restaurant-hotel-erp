"use client";

import { Card, Row, Col, Typography, Button, Upload, Image, Space, Select, Tag, Modal, Form, Input, message } from "antd";
import { PictureOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { 
    getMockPhotos,
    getMockRoomTypes,
    getMockProperties,
    addMockPhoto,
    deleteMockPhoto 
} from "../../../data/mockInventory";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PhotosManagementPage() {
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [selectedRoomType, setSelectedRoomType] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<any>(null);
    const [form] = Form.useForm();

    const photos = getMockPhotos();
    const roomTypes = getMockRoomTypes();
    const properties = getMockProperties();

    // Filter photos based on selections
    const filteredPhotos = photos.filter(photo => {
        if (selectedRoomType && photo.roomTypeId !== selectedRoomType) return false;
        if (selectedProperty) {
            const roomType = roomTypes.find(rt => rt.id === photo.roomTypeId);
            if (!roomType || roomType.propertyId !== selectedProperty) return false;
        }
        return true;
    });

    const handleAddPhoto = () => {
        setEditingPhoto(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditPhoto = (photo: any) => {
        setEditingPhoto(photo);
        form.setFieldsValue(photo);
        setIsModalVisible(true);
    };

    const handleDeletePhoto = (photoId: string) => {
        Modal.confirm({
            title: 'Delete Photo',
            content: 'Are you sure you want to delete this photo?',
            okText: 'Delete',
            okType: 'danger',
            onOk: () => {
                if (deleteMockPhoto(photoId)) {
                    message.success('Photo deleted successfully');
                } else {
                    message.error('Failed to delete photo');
                }
            },
        });
    };

    const handleSubmit = (values: any) => {
        try {
            if (editingPhoto) {
                // Update logic would go here
                message.success('Photo updated successfully');
            } else {
                addMockPhoto({
                    roomTypeId: values.roomTypeId,
                    url: values.url,
                    caption: values.caption
                });
                message.success('Photo added successfully');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to save photo');
        }
    };

    const filteredRoomTypes = selectedProperty 
        ? roomTypes.filter(rt => rt.propertyId === selectedProperty)
        : roomTypes;

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <PictureOutlined style={{ marginRight: '8px' }} />
                        Photos Management
                    </Title>
                    <Text type="secondary">Manage room type photos and galleries</Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPhoto}>
                        Add Photo
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Property"
                            allowClear
                            value={selectedProperty || undefined}
                            onChange={(value) => {
                                setSelectedProperty(value || '');
                                setSelectedRoomType(''); // Reset room type when property changes
                            }}
                        >
                            {properties.map(property => (
                                <Select.Option key={property.id} value={property.id}>
                                    {property.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Filter by Room Type"
                            allowClear
                            value={selectedRoomType || undefined}
                            onChange={setSelectedRoomType}
                        >
                            {filteredRoomTypes.map(roomType => (
                                <Select.Option key={roomType.id} value={roomType.id}>
                                    {roomType.name} ({roomType.propertyName})
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                        <Button 
                            onClick={() => {
                                setSelectedProperty('');
                                setSelectedRoomType('');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Space>
                            <PictureOutlined style={{ color: '#1890ff' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{filteredPhotos.length}</div>
                                <div style={{ color: '#666' }}>Total Photos</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Space>
                            <EditOutlined style={{ color: '#52c41a' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                    {new Set(filteredPhotos.map(p => p.roomTypeId)).size}
                                </div>
                                <div style={{ color: '#666' }}>Room Types with Photos</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Space>
                            <UploadOutlined style={{ color: '#faad14' }} />
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                    {filteredPhotos.filter(p => p.caption).length}
                                </div>
                                <div style={{ color: '#666' }}>Photos with Captions</div>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Photos Grid */}
            <Row gutter={[16, 16]}>
                {filteredPhotos.map(photo => {
                    const roomType = roomTypes.find(rt => rt.id === photo.roomTypeId);
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={photo.id}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <Image
                                            alt={photo.caption || 'Room photo'}
                                            src={photo.url}
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover' 
                                            }}
                                            placeholder
                                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+B2kcgoQRBSuIQaNdgIgMEySCQhABBiMZGPkx8/H5dM2v3w80vNHe83YyOWi2+Ia7k6ePe2w=="
                                        />
                                    </div>
                                }
                                actions={[
                                    <EditOutlined key="edit" onClick={() => handleEditPhoto(photo)} />,
                                    <DeleteOutlined key="delete" onClick={() => handleDeletePhoto(photo.id)} />
                                ]}
                            >
                                <Card.Meta
                                    title={
                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                            <Tag color="blue">{roomType?.name}</Tag>
                                            <Text strong>{photo.caption || 'No caption'}</Text>
                                        </Space>
                                    }
                                    description={
                                        <Text type="secondary" ellipsis>
                                            {roomType?.propertyName}
                                        </Text>
                                    }
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {filteredPhotos.length === 0 && (
                <Card style={{ textAlign: 'center', padding: '48px' }}>
                    <PictureOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                    <Title level={4} type="secondary">No photos found</Title>
                    <Text type="secondary">Add some photos to get started</Text>
                </Card>
            )}

            {/* Add/Edit Photo Modal */}
            <Modal
                title={editingPhoto ? 'Edit Photo' : 'Add Photo'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Room Type"
                        name="roomTypeId"
                        rules={[{ required: true, message: 'Please select a room type!' }]}
                    >
                        <Select placeholder="Select room type">
                            {roomTypes.map(roomType => (
                                <Select.Option key={roomType.id} value={roomType.id}>
                                    {roomType.name} - {roomType.propertyName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Photo URL"
                        name="url"
                        rules={[{ required: true, message: 'Please enter photo URL!' }]}
                    >
                        <Input placeholder="https://example.com/photo.jpg" />
                    </Form.Item>

                    <Form.Item
                        label="Caption"
                        name="caption"
                    >
                        <TextArea rows={3} placeholder="Photo caption..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingPhoto ? 'Update' : 'Add'} Photo
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
