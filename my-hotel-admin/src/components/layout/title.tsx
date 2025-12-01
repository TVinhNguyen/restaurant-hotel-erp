import React from "react";
import { useLink } from "@refinedev/core";
import { Typography, Space, theme } from "antd";
import { ROLEMAP } from "../../language/language-map";

const { useToken } = theme;

type TitleProps = {
    collapsed: boolean;
    name?: string;
    role?: string;
};

export const Title: React.FC<TitleProps> = ({ collapsed, name, role }) => {
    const { token } = useToken();
    const Link = useLink();

    return (
        <Link
            to="/"
            style={{
                display: "block",
                textDecoration: "none",
                width: "100%",
            }}
        >
            <Space
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "inherit",
                    padding: "12px 16px",
                    width: "100%",
                }}
            >
                {!collapsed && (
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <Typography.Title
                            level={4}
                            style={{
                                fontSize: "14px",
                                marginBottom: 0,
                                fontWeight: 700,
                                color: token.colorPrimary,
                            }}
                        >
                            {name}
                            <br />
                            {role ? `${ROLEMAP[role as keyof typeof ROLEMAP] ?? role}` : ""}
                        </Typography.Title>
                    </div>
                )}
            </Space>
        </Link>
    );
};