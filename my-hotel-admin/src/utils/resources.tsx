import { ResourceProps } from "@refinedev/core";
import { 
    BarChartOutlined, 
    HomeOutlined, 
    ScheduleOutlined, 
    TeamOutlined,
    BankOutlined,
    UserOutlined,
} from "@ant-design/icons";

// Helper function to get user permissions from localStorage
const getUserPermissions = (): string[] => {
    try {
        const userStr = localStorage.getItem("refine-user");
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.permissions || [];
        }
    } catch (e) {
        console.error("Error getting user permissions", e);
    }
    return [];
};

export const getResourcesByPermissions = (_permissions: string[]): ResourceProps[] => {
    const permissions = _permissions.length > 0 ? _permissions : getUserPermissions();
    const resources: ResourceProps[] = [];

    // Dashboard - luôn hiển thị
    resources.push({
        name: "dashboard",
        list: "/",
        meta: { label: "Tổng quan", icon: <BarChartOutlined /> },
    });

    // Đặt phòng - cần reservation.view
    if (permissions.includes("reservation.view")) {
        resources.push({
            name: "reservations",
            list: "/dat-phong",
            meta: { label: "Đặt phòng", icon: <ScheduleOutlined /> },
        });
    }

    // Phòng - cần room.view
    if (permissions.includes("room.view")) {
        resources.push({
            name: "rooms",
            list: "/phong",
            meta: { label: "Phòng", icon: <HomeOutlined /> },
        });
    }

    // Nhân viên - cần employee.view (chỉ Admin/HR có quyền này)
    if (permissions.includes("employee.view")) {
        resources.push({
            name: "employees-view",
            list: "/nhan-vien",
            meta: { label: "Nhân viên", icon: <TeamOutlined /> },
        });
    }

    // Khách hàng - cần guest.view
    if (permissions.includes("guest.view")) {
        resources.push({
            name: "guests",
            list: "/khach-hang",
            meta: { label: "Khách hàng", icon: <UserOutlined /> },
        });
    }

    // Cơ sở - cần property.view
    if (permissions.includes("property.view")) {
        resources.push({
            name: "property",
            list: "/property",
            meta: { label: "Cơ sở", icon: <BankOutlined /> },
        });
    }

    return resources;
};

export const getResourcesByRole = (_roles: string[]): ResourceProps[] => {
    return getResourcesByPermissions([]);
};