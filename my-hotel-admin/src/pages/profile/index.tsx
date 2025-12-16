import React, { useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import {
    Card,
    Descriptions,
    Avatar,
    Space,
    Typography,
    Spin,
    Button,
    Form,
    Input,
    Modal,
    message,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    IdcardOutlined,
    EditOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { DEPARTMENTMAP, ROLEMAP } from "../../language/language-map";

const { Title } = Typography;
const API_URL = import.meta.env.VITE_API_URL;

export const Profile: React.FC = () => {
    const { data: identity, isLoading } = useGetIdentity<{
        id: string;
        name: string;
        email: string;
        avatar?: string;
        phone?: string;
    }>();
    const [employeeData, setEmployeeData] = React.useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = React.useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    useEffect(() => {
        const getFullProfile = async () => {
            const userID = identity?.id;
            const localData = localStorage.getItem("refine-user");
            const userData = JSON.parse(localData || "{}");
            const employeeResponse = await fetch(`${API_URL}/employees/get-employee-by-user-id/${userID}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("refine-auth")}`,
                },
            });
            const employeeData = await employeeResponse.json();
            const data = { ...userData, ...identity, ...employeeData };
            console.log("Full profile data:", data);
            setEmployeeData(data);
        };
        if (identity?.id) {
            getFullProfile();
        }
    }, [identity]);

    // Mock user data - sẽ được lấy từ API thật
    const userData = {
        id: identity?.id,
        name: employeeData?.name,
        email: employeeData?.email,
        phone: employeeData?.phone,
        position: ROLEMAP[employeeData?.position],
        department: DEPARTMENTMAP[employeeData?.department],
        employeeCode: employeeData?.employeeCode,
        joinDate: employeeData?.hireDate,
        address: "",
        identityCard: "",
        dateOfBirth: "",
        gender: "",
    };

    const handleEditProfile = async (values: any) => {
        try {
            // update trong db:


            // console.log("Update profile:", values);
            // message.success("Cập nhật thông tin thành công!");
            // setIsEditModalOpen(false);
        } catch (error) {
            message.error("Cập nhật thất bại!");
        }
    };

    const handleChangePassword = async (values: any) => {
        try {
            // TODO: Call API to change password
            console.log("Change password:", values);
            message.success("Đổi mật khẩu thành công!");
            setIsChangePasswordModalOpen(false);
            passwordForm.resetFields();
        } catch (error) {
            message.error("Đổi mật khẩu thất bại!");
        }
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <Space align="start" size="large">
                        <Avatar
                            size={120}
                            src={identity?.avatar}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#1890ff" }}
                        />
                        <div>
                            <Title level={3} style={{ marginBottom: 8 }}>
                                {userData.name}
                            </Title>
                            <Space direction="vertical" size={4}>
                                <Space>
                                    <MailOutlined />
                                    <span>{userData.email}</span>
                                </Space>
                                <Space>
                                    <PhoneOutlined />
                                    <span>{userData.phone}</span>
                                </Space>
                                <Space>
                                    <IdcardOutlined />
                                    <span>Mã NV: {userData.employeeCode}</span>
                                </Space>
                            </Space>
                            <Space style={{ marginTop: 16, marginLeft: 70 }}>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        form.setFieldsValue(userData);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    Chỉnh sửa
                                </Button>
                                <Button
                                    icon={<LockOutlined />}
                                    onClick={() => setIsChangePasswordModalOpen(true)}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Space>
                        </div>
                    </Space>
                </Card>

                <Card title="Thông tin cá nhân" bordered={false}>
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Họ và tên">
                            {userData.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {userData.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {userData.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {userData.dateOfBirth}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            {userData.gender}
                        </Descriptions.Item>
                        <Descriptions.Item label="CMND/CCCD">
                            {userData.identityCard}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {userData.address}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Thông tin công việc" bordered={false}>
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Mã nhân viên">
                            {userData.employeeCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chức vụ">
                            {userData.position}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phòng ban">
                            {userData.department}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày vào làm">
                            {userData.joinDate}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>

            {/* Modal chỉnh sửa thông tin */}
            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditProfile}
                    initialValues={userData}
                >
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                            <Button onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal đổi mật khẩu */}
            <Modal
                title="Đổi mật khẩu"
                open={isChangePasswordModalOpen}
                onCancel={() => {
                    setIsChangePasswordModalOpen(false);
                    passwordForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Đổi mật khẩu
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsChangePasswordModalOpen(false);
                                    passwordForm.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};