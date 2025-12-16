import { ResourceProps } from "@refinedev/core";
import {
    CalendarOutlined,
    UserOutlined,
    HomeOutlined,
    TeamOutlined,
    BarChartOutlined,
    SettingOutlined,
    DollarOutlined,
    ShopOutlined,
    CheckSquareOutlined,
    FileTextOutlined,
    BankOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import { hasModuleAccess, getAccessibleResources } from "../accessControlProvider";

export const getResourcesByPermissions = (permissions: string[]): ResourceProps[] => {
    const resources: ResourceProps[] = [];
    const accessibleResources = new Set(getAccessibleResources());

    // Dashboard - luôn hiển thị
    resources.push({
        name: "dashboard",
        list: "/",
        meta: {
            label: "Tổng quan",
            icon: <BarChartOutlined />,
        },
    });

    // Thông tin cá nhân - Tất cả users đều có
    resources.push({
        name: "profile",
        list: "/profile",
        meta: {
            label: "Thông tin cá nhân",
            icon: <IdcardOutlined />,
            parent: undefined,
        },
    });

    // Thông tin cơ sở - Tất cả users đều có
    resources.push({
        name: "property",
        list: "/property",
        meta: {
            label: "Thông tin cơ sở",
            icon: <BankOutlined />,
            parent: undefined,
        },
    });

    // FrontDesk - Đặt phòng
    if (accessibleResources.has("dat-phong")) {
        resources.push({
            name: "dat-phong",
            list: "/dat-phong",
            create: permissions.includes("reservation.create") ? "/dat-phong/tao-moi" : undefined,
            edit: permissions.includes("reservation.edit") ? "/dat-phong/chinh-sua/:id" : undefined,
            show: "/dat-phong/chi-tiet/:id",
            meta: {
                label: "Đặt phòng",
                icon: <CalendarOutlined />,
                canDelete: permissions.includes("reservation.cancel"),
            },
        });
    }

    // FrontDesk - Khách hàng
    if (accessibleResources.has("khach-hang")) {
        resources.push({
            name: "khach-hang",
            list: "/khach-hang",
            create: permissions.includes("guest.edit") ? "/khach-hang/tao-moi" : undefined,
            edit: permissions.includes("guest.edit") ? "/khach-hang/chinh-sua/:id" : undefined,
            show: "/khach-hang/chi-tiet/:id",
            meta: {
                label: "Khách hàng",
                icon: <UserOutlined />,
                canDelete: false,
            },
        });
    }

    // FrontDesk - Phòng
    if (accessibleResources.has("phong")) {
        resources.push({
            name: "phong",
            list: "/phong",
            edit: permissions.includes("room.edit") ? "/phong/chinh-sua/:id" : undefined,
            show: "/phong/chi-tiet/:id",
            meta: {
                label: "Phòng",
                icon: <HomeOutlined />,
                canDelete: false,
            },
        });
    }

    // FrontDesk - Thanh toán
    if (accessibleResources.has("thanh-toan")) {
        resources.push({
            name: "thanh-toan",
            list: "/thanh-toan",
            create: permissions.includes("payment.process") ? "/thanh-toan/tao-moi" : undefined,
            show: "/thanh-toan/chi-tiet/:id",
            meta: {
                label: "Thanh toán",
                icon: <DollarOutlined />,
                canDelete: permissions.includes("payment.refund"),
            },
        });
    }

    // F&B - Nhà hàng
    if (accessibleResources.has("nha-hang")) {
        resources.push({
            name: "nha-hang",
            list: "/nha-hang",
            create: permissions.includes("restaurant.manage") ? "/nha-hang/tao-moi" : undefined,
            edit: permissions.includes("restaurant.manage") ? "/nha-hang/chinh-sua/:id" : undefined,
            show: "/nha-hang/chi-tiet/:id",
            meta: {
                label: "Nhà hàng",
                icon: <ShopOutlined />,
                canDelete: permissions.includes("restaurant.manage"),
            },
        });
    }

    // F&B - Đặt bàn
    if (accessibleResources.has("dat-ban")) {
        resources.push({
            name: "dat-ban",
            list: "/dat-ban",
            create: permissions.includes("tablebooking.create") ? "/dat-ban/tao-moi" : undefined,
            edit: permissions.includes("tablebooking.edit") ? "/dat-ban/chinh-sua/:id" : undefined,
            show: "/dat-ban/chi-tiet/:id",
            meta: {
                label: "Đặt bàn",
                icon: <CalendarOutlined />,
                canDelete: false,
            },
        });
    }

    // Housekeeping
    if (accessibleResources.has("phong-buong")) {
        resources.push({
            name: "phong-buong",
            list: "/phong-buong",
            edit: permissions.includes("housekeeping.update") ? "/phong-buong/cap-nhat/:id" : undefined,
            show: "/phong-buong/chi-tiet/:id",
            meta: {
                label: "Phòng buồng",
                icon: <CheckSquareOutlined />,
                canDelete: false,
            },
        });
    }

    // HR - Nhân viên
    if (accessibleResources.has("nhan-vien")) {
        resources.push({
            name: "nhan-vien",
            list: "/nhan-vien",
            create: permissions.includes("employee.manage") ? "/nhan-vien/tao-moi" : undefined,
            edit: permissions.includes("employee.manage") ? "/nhan-vien/chinh-sua/:id" : undefined,
            show: "/nhan-vien/chi-tiet/:id",
            meta: {
                label: "Nhân viên",
                icon: <TeamOutlined />,
                canDelete: permissions.includes("employee.manage"),
            },
        });
    }

    // HR - Điểm danh
    if (accessibleResources.has("diem-danh")) {
        resources.push({
            name: "diem-danh",
            list: "/diem-danh",
            create: permissions.includes("attendance.manage") ? "/diem-danh/tao-moi" : undefined,
            show: "/diem-danh/chi-tiet/:id",
            meta: {
                label: "Điểm danh",
                icon: <CheckSquareOutlined />,
                canDelete: false,
            },
        });
    }

    // HR - Lương
    if (accessibleResources.has("luong")) {
        resources.push({
            name: "luong",
            list: "/luong",
            create: permissions.includes("payroll.process") ? "/luong/xu-ly" : undefined,
            show: "/luong/chi-tiet/:id",
            meta: {
                label: "Lương",
                icon: <DollarOutlined />,
                canDelete: false,
            },
        });
    }

    // Reports - Báo cáo
    if (hasModuleAccess("report")) {
        resources.push({
            name: "bao-cao",
            list: "/bao-cao",
            meta: {
                label: "Báo cáo",
                icon: <FileTextOutlined />,
            },
        });
    }

    // System - Quản trị hệ thống
    if (hasModuleAccess("user") || hasModuleAccess("role") || hasModuleAccess("permission")) {
        resources.push({
            name: "quan-tri",
            list: "/quan-tri",
            meta: {
                label: "Quản trị hệ thống",
                icon: <SettingOutlined />,
            },
        });
    }

    return resources;
};

/**
 * Backward compatibility: Get resources by roles
 */
export const getResourcesByRole = (_roles: string[]): ResourceProps[] => {
    // Get user permissions from localStorage
    const userStr = localStorage.getItem("refine-user");
    if (!userStr) return [];

    const user = JSON.parse(userStr);
    const permissions = user.permissions || [];

    return getResourcesByPermissions(permissions);
};