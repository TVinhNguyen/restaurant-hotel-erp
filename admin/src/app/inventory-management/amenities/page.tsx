"use client";

import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, message, Button, Card, Row, Col, Input, Select, Typography, Tag } from "antd";
import { useState } from "react";
import { 
    getMockAmenities, 
    deleteMockAmenity,
    type Amenity 
} from "../../../data/mockInventory";
import { PlusOutlined, SearchOutlined, ToolOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Search } = Input;

export default function AmenitiesPage() {
    const [amenities, setAmenities] = useState<Amenity[]>(getMockAmenities());
    const [filteredAmenities, setFilteredAmenities] = useState<Amenity[]>(getMockAmenities());
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const router = useRouter();

    const handleDelete = (id: string) => {
        if (deleteMockAmenity(id)) {
            const updatedAmenities = getMockAmenities();
            setAmenities(updatedAmenities);
            setFilteredAmenities(updatedAmenities);
            message.success('Amenity deleted successfully!');
        } else {
            message.error('Error deleting amenity!');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        filterAmenities(value, categoryFilter);
    };

    const handleCategoryFilter = (value: string) => {
        setCategoryFilter(value);
        filterAmenities(searchText, value);
    };

    const filterAmenities = (search: string, category: string) => {
        let filtered = amenities;

        if (search) {
            filtered = filtered.filter(amenity =>
                amenity.name.toLowerCase().includes(search.toLowerCase()) ||
                (amenity.description && amenity.description.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (category !== 'all') {
            filtered = filtered.filter(amenity => amenity.category === category);
        }

        setFilteredAmenities(filtered);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'room': return 'blue';
            case 'facility': return 'green';
            default: return 'default';
        }
    };

    const tableProps = {
        dataSource: filteredAmenities,
        pagination: {
            pageSize: 10,
            total: filteredAmenities.length,
            showSizeChanger: true,
            showQuickJumper: true,
        },
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        <ToolOutlined style={{ marginRight: '8px' }} />
                        Amenities Management
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/inventory-management/amenities/create')}
                    >
                        Add Amenity
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search amenities..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={6} md={4}>
                        <Select
                            placeholder="Category"
                            style={{ width: '100%' }}
                            value={categoryFilter}
                            onChange={handleCategoryFilter}
                        >
                            <Select.Option value="all">All Categories</Select.Option>
                            <Select.Option value="room">Room</Select.Option>
                            <Select.Option value="facility">Facility</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#666' }}>
                                Showing {filteredAmenities.length} of {amenities.length} amenities
                            </span>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Amenities Table */}
            <Card>
                <List>
                    <Table {...tableProps} rowKey="id" scroll={{ x: 800 }}>
                        <Table.Column
                            dataIndex="id"
                            title="ID"
                            width={60}
                        />
                        <Table.Column
                            dataIndex="name"
                            title="Name"
                            sorter={(a: Amenity, b: Amenity) => a.name.localeCompare(b.name)}
                            render={(name: string, record: Amenity) => (
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                                    {record.description && (
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {record.description}
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                        <Table.Column
                            dataIndex="category"
                            title="Category"
                            render={(category: string) => (
                                <Tag color={getCategoryColor(category)}>
                                    {category === 'room' ? 'Room Amenity' : 'Facility'}
                                </Tag>
                            )}
                            filters={[
                                { text: 'Room Amenity', value: 'room' },
                                { text: 'Facility', value: 'facility' },
                            ]}
                            onFilter={(value: any, record: Amenity) => record.category === value}
                        />
                        <Table.Column
                            dataIndex="description"
                            title="Description"
                            responsive={['lg']}
                            render={(description: string) => (
                                <div style={{ maxWidth: '300px' }}>
                                    {description ? (
                                        <span style={{ fontSize: '14px' }}>
                                            {description.length > 80 ? `${description.substring(0, 80)}...` : description}
                                        </span>
                                    ) : '-'}
                                </div>
                            )}
                        />
                        <Table.Column
                            title="Actions"
                            dataIndex="actions"
                            fixed="right"
                            width={120}
                            render={(_, record: BaseRecord) => (
                                <Space size="small">
                                    <ShowButton hideText size="small" recordItemId={record.id} />
                                    <EditButton hideText size="small" recordItemId={record.id} />
                                    <DeleteButton
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                        onSuccess={() => handleDelete(String(record.id))}
                                    />
                                </Space>
                            )}
                        />
                    </Table>
                </List>
            </Card>
        </div>
    );
}
