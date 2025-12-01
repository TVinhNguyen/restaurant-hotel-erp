import { useForgotPassword } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Title } from "../../components/layout/title";

const { Text, Link } = Typography;

export const ForgotPassword = () => {
  const { mutate: forgotPassword, isLoading } = useForgotPassword();
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = (values: any) => {
    forgotPassword(values, {
      onSuccess: () => {
        setEmailSent(true);
      },
    });
  };

  if (emailSent) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f0f2f5",
        }}
      >
        <Card style={{ width: 400, textAlign: "center" }}>
          <Result
            status="success"
            title="Email đã được gửi!"
            subTitle="Vui lòng kiểm tra hộp thư của bạn để đặt lại mật khẩu."
            extra={
              <Button type="primary" href="/login" size="large">
                Quay lại đăng nhập
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Typography.Title level={3} style={{ marginTop: 16, color: "#5B5FC7" }}>
            Quên mật khẩu?
          </Typography.Title>
          <Text type="secondary">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </Text>
        </div>

        <Form
          name="forgotPassword"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="email@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Gửi email đặt lại mật khẩu
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Link href="/login">
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};
