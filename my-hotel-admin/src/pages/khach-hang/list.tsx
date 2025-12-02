import { useTable, List, DateField } from "@refinedev/antd";
import { Table, Space, Button, Card, Row, Col, Statistic, Input, Spin, Avatar, Typography, Modal, Descriptions, Divider, Tag } from "antd";
import { EyeOutlined, UserOutlined, SearchOutlined, GlobalOutlined, PhoneOutlined, MailOutlined, IdcardOutlined, CalendarOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const TOKEN_KEY = "refine-auth";
const USER_KEY = "refine-user";
const API_URL = "http://34.151.224.213:4000/api/v1";

export const KhachHangList: React.FC = () => {
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [propertyName, setPropertyName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [allGuests, setAllGuests] = useState<any[]>([]); // For stats
    
    // View modal
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<any>(null);

    const getAuthHeader = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchPropertyId = async () => {
            try {
                const userStr = localStorage.getItem(USER_KEY);
                if (!userStr) return;
                
                const userData = JSON.parse(userStr);
                const userId = userData.id;

                const empResponse = await fetch(`${API_URL}/employees/get-employee-by-user-id/${userId}`, {
                    headers: getAuthHeader(),
                });
                const empData = await empResponse.json();

                if (empData?.id) {
                    const roleResponse = await fetch(`${API_URL}/employee-roles?employeeId=${empData.id}`, {
                        headers: getAuthHeader(),
                    });
                    const roleData = await roleResponse.json();

                    if (roleData?.length > 0 && roleData[0]?.propertyId) {
                        setPropertyId(roleData[0].propertyId);

                        const propResponse = await fetch(`${API_URL}/properties/${roleData[0].propertyId}`, {
                            headers: getAuthHeader(),
                        });
                        const propData = await propResponse.json();
                        setPropertyName(propData?.name || "");
                    }
                }
            } catch (error) {
                console.error("Error fetching propertyId:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPropertyId();
    }, []);

    // Fetch all guests for stats
    useEffect(() => {
        const fetchAllGuests = async () => {
            try {
                const response = await fetch(`${API_URL}/guests`, {
                    headers: getAuthHeader(),
                });
                const data = await response.json();
                // API returns {data: [], total: number} or array
                const guestsArray = Array.isArray(data) ? data : (data?.data || []);
                setAllGuests(guestsArray);
            } catch (error) {
                console.error("Error fetching guests:", error);
            }
        };

        fetchAllGuests();
    }, []);

    const { tableProps } = useTable({
        resource: "guests",
        syncWithLocation: true,
    });

    const guests = (tableProps.dataSource as any[]) || [];
    
    // Get unique nationalities from ALL guests
    const nationalities = [...new Set(allGuests.map((g) => g.nationality).filter(Boolean))];

    // Filter by search
    const filteredData = guests.filter((g) => {
        if (!searchText) return true;
        const search = searchText.toLowerCase();
        return (
            g.fullName?.toLowerCase().includes(search) ||
            g.email?.toLowerCase().includes(search) ||
            g.phone?.includes(search)
        );
    });

    const handleView = (record: any) => {
        setSelectedGuest(record);
        setViewModalVisible(true);
    };

    const genderLabels: Record<string, string> = {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Stats - Always show total stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={8} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="Tổng khách hàng"
                            value={allGuests.length}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#1890ff", fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="Quốc tịch"
                            value={nationalities.length}
                            prefix={<GlobalOutlined />}
                            valueStyle={{ color: "#722ed1", fontSize: 24 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm kiếm theo tên, email, SĐT..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                </Row>
            </Card>

            <List
                title={`Danh sách khách hàng - ${propertyName}`}
                canCreate={false}
            >
                <Table 
                    {...tableProps} 
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    pagination={{ pageSize: 10, showTotal: (total) => `Tổng: ${total} khách hàng` }}
                >
                    <Table.Column
                        title="Khách hàng"
                        key="customer"
                        render={(_, record: any) => (
                            <Space>
                                <Avatar icon={<UserOutlined />} size="large" />
                                <div>
                                    <Text strong style={{ fontSize: 14 }}>{record.fullName}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        <MailOutlined /> {record.email}
                                    </Text>
                                </div>
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Số điện thoại"
                        dataIndex="phone"
                        key="phone"
                        render={(phone: string) => (
                            <Space>
                                <PhoneOutlined />
                                {phone || "-"}
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Quốc tịch"
                        dataIndex="nationality"
                        key="nationality"
                        render={(nationality: string) => (
                            <Space>
                                <GlobalOutlined />
                                {nationality || "-"}
                            </Space>
                        )}
                    />
                    <Table.Column
                        title="Ngày tạo"
                        dataIndex="createdAt"
                        key="createdAt"
                        render={(value) => (
                            <DateField value={value} format="DD/MM/YYYY" />
                        )}
                    />
                    <Table.Column
                        title="Thao tác"
                        key="actions"
                        render={(_, record: any) => (
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleView(record)}
                            >
                                Xem
                            </Button>
                        )}
                    />
                </Table>
            </List>

            {/* View Guest Modal */}
            <Modal
                title={
                    <Space>
                        <Avatar icon={<UserOutlined />} size={48} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>{selectedGuest?.fullName}</Title>
                            <Text type="secondary">{selectedGuest?.nationality || "Khách hàng"}</Text>
                        </div>
                    </Space>
                }
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedGuest(null);
                }}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedGuest && (
                    <>
                        <Divider orientation="left"><UserOutlined /> Thông tin cá nhân</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Họ và tên" span={2}>
                                <Text strong>{selectedGuest.fullName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                <Space>
                                    <MailOutlined />
                                    {selectedGuest.email || "-"}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                <Space>
                                    <PhoneOutlined />
                                    {selectedGuest.phone || "-"}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                                {genderLabels[selectedGuest.gender] || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">
                                {selectedGuest.dateOfBirth ? dayjs(selectedGuest.dateOfBirth).format("DD/MM/YYYY") : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>
                                {selectedGuest.address || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left"><IdcardOutlined /> Thông tin giấy tờ</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Quốc tịch">
                                <Space>
                                    <GlobalOutlined />
                                    {selectedGuest.nationality || "-"}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại giấy tờ">
                                {selectedGuest.idType || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số giấy tờ">
                                {selectedGuest.idNumber || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày cấp">
                                {selectedGuest.idIssueDate ? dayjs(selectedGuest.idIssueDate).format("DD/MM/YYYY") : "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left"><CalendarOutlined /> Thông tin hệ thống</Divider>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Ngày tạo">
                                {selectedGuest.createdAt ? dayjs(selectedGuest.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cập nhật lần cuối">
                                {selectedGuest.updatedAt ? dayjs(selectedGuest.updatedAt).format("DD/MM/YYYY HH:mm") : "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        {selectedGuest.notes && (
                            <>
                                <Divider orientation="left">Ghi chú</Divider>
                                <Card size="small" style={{ background: "#f5f5f5" }}>
                                    {selectedGuest.notes}
                                </Card>
                            </>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};
