"use client";

import { ColorModeContext } from "@contexts/color-mode";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  theme,
  Typography,
  Select,
} from "antd";
import React, { useContext, useEffect, useState } from "react";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

type Property = {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  propertyType: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/properties`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Handle different response formats - could be array or object with data property
          const propertiesArray = Array.isArray(data) ? data : (data.data || data.properties || []);
          setProperties(propertiesArray as Property[]);
          
          // Sau khi fetch properties, khôi phục selectedProperty từ localStorage nếu có
          const savedPropertyId = localStorage.getItem('selectedPropertyId');
          if (savedPropertyId) {
            const savedProperty = propertiesArray.find((p: Property) => p.id === parseInt(savedPropertyId));
            if (savedProperty) {
              setSelectedProperty(savedProperty);
            }
          }
        } else {
          console.error('Failed to fetch properties:', response.status, response.statusText);
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <div>
        <Select
          placeholder="Select a property"
          loading={loading}
          value={selectedProperty ? selectedProperty.id : undefined}
          onChange={(value) => {
            const prop = properties.find((p: Property) => p.id === value);
            setSelectedProperty(prop || null);
            // Lưu ID vào localStorage khi chọn
            if (prop) {
              localStorage.setItem('selectedPropertyId', prop.id.toString());
            } else {
              localStorage.removeItem('selectedPropertyId');
            }
          }}
          style={{ width: 300 }}
        >
          {Array.isArray(properties) && properties.map(property => (
            <Select.Option key={property.id} value={property.id}>
              {property.name} - {property.address}, {property.city}, {property.country}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Space>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        {(user?.name || user?.avatar) && (
          <Space style={{ marginLeft: "8px" }} size="middle">
            {user?.name && <Text strong>{user.name}</Text>}
            {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
          </Space>
        )}
      </Space>
    </AntdLayout.Header>
  );
};
