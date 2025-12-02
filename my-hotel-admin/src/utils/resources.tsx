import { ResourceProps } from "@refinedev/core";
import { 
    BarChartOutlined, 
    HomeOutlined, 
    ScheduleOutlined, 
    TeamOutlined,
    BankOutlined,
    UserOutlined,
} from "@ant-design/icons";

export const getResourcesByPermissions = (_permissions: string[]): ResourceProps[] => {
    return [
        {
            name: "dashboard",
            list: "/",
            meta: { label: "Tổng quan", icon: <BarChartOutlined /> },
        },
        {
            name: "reservations",
            list: "/dat-phong",
            meta: { label: "Đặt phòng", icon: <ScheduleOutlined /> },
        },
        {
            name: "rooms",
            list: "/phong",
            meta: { label: "Phòng", icon: <HomeOutlined /> },
        },
        {
            name: "employees-view",
            list: "/nhan-vien",
            meta: { label: "Nhân viên", icon: <TeamOutlined /> },
        },
        {
            name: "guests",
            list: "/khach-hang",
            meta: { label: "Khách hàng", icon: <UserOutlined /> },
        },
        {
            name: "property",
            list: "/property",
            meta: { label: "Cơ sở", icon: <BankOutlined /> },
        },
    ];
};

export const getResourcesByRole = (_roles: string[]): ResourceProps[] => {
    return getResourcesByPermissions([]);
};