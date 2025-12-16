import { useTable, List, DateField } from "@refinedev/antd";
import { Table, Space, Button } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigation, useCan } from "@refinedev/core";
import { useEffect, useState } from "react";

interface Guest {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    loyaltyTier?: string;
    passportId?: string;
    createdAt: string;
}

export const KhachHangList: React.FC = () => {
    const { show, edit } = useNavigation();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    // const { tableProps } = useTable({
    //     resource: "guests",
    //     syncWithLocation: true,
    // });

    const { data: canEdit } = useCan({
        resource: "khach-hang",
        action: "edit",
    });

    const { data: canCreate } = useCan({
        resource: "khach-hang",
        action: "create",
    });

    const fetchGuests = async (page: number = 1, limit: number = 10) => {
        setLoading(true);
        const token = localStorage.getItem("refine-auth");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(
                `${API_URL}/guests?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setGuests(data.data || []);
                setPagination({
                    current: page,
                    pageSize: limit,
                    total: data.total || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching guests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    const handleTableChange = (paginationConfig: any) => {
        fetchGuests(paginationConfig.current, paginationConfig.pageSize);
    };

    return (
        <List
            title="Danh sách khách hàng đã sử dụng dịch vụ"
            canCreate={canCreate?.can}
            createButtonProps={{
                children: "Thêm khách hàng mới",
            }}
        >
            {/* <Table {...tableProps} rowKey="id"> */}
            <Table
                dataSource={guests}
                loading={loading}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
            >
                <Table.Column
                    title="Họ và tên"
                    dataIndex="name"
                    key="name"
                />
                <Table.Column
                    title="Email"
                    dataIndex="email"
                    key="email"
                />
                <Table.Column
                    title="Số điện thoại"
                    dataIndex="phone"
                    key="phone"
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
                        <Space>
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => show("guests", record.id)}
                            >
                                Xem
                            </Button>
                            {canEdit?.can && (
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => edit("guests", record.id)}
                                >
                                    Sửa
                                </Button>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
