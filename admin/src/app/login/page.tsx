"use client";

import { ThemedTitleV2 } from "@refinedev/antd";
import { Button, Form, Input, Layout, Space, Typography, App } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:4000/api/v1";

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { message } = App.useApp();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu token và user info
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        message.success("Login successful!");
        router.push("/"); // Redirect về trang chính
      } else {
        message.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "400px"
      }}>
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <ThemedTitleV2
            collapsed={false}
            wrapperStyles={{
              fontSize: "22px",
              marginBottom: "36px",
            }}
          />

          <Form
            form={form}
            style={{ width: "100%" }}
            onFinish={handleLogin}
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" }
              ]}
            >
              <Input
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" }
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: "16px" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ width: "100%" }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Typography.Text type="secondary">
            Restaurant Hotel ERP System
          </Typography.Text>
        </Space>
      </div>
    </Layout>
  );
}

export default function Login() {
  return (
    <App>
      <LoginContent />
    </App>
  );
}
