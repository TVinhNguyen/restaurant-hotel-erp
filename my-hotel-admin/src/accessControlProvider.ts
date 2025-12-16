import type { AccessControlProvider } from "@refinedev/core";

/**
 * Map permissions slug to resource and action
 * Format: module.action -> { resource, action }
 */
const permissionMapping: Record<string, { resource: string; actions: string[] }> = {
  // FrontDesk - Reservations
  "reservation.view": { resource: "dat-phong", actions: ["list", "show"] },
  "reservation.create": { resource: "dat-phong", actions: ["create"] },
  "reservation.edit": { resource: "dat-phong", actions: ["edit"] },
  "reservation.cancel": { resource: "dat-phong", actions: ["delete"] },
  "reservation.checkin": { resource: "check-in", actions: ["list", "create"] },
  "reservation.checkout": { resource: "check-out", actions: ["list", "create"] },
  
  // FrontDesk - Guests
  "guest.view": { resource: "khach-hang", actions: ["list", "show"] },
  "guest.edit": { resource: "khach-hang", actions: ["create", "edit"] },
  
  // FrontDesk - Rooms
  "room.view": { resource: "phong", actions: ["list", "show"] },
  "room.edit": { resource: "phong", actions: ["edit"] },
  "roomtype.manage": { resource: "loai-phong", actions: ["list", "create", "edit", "show", "delete"] },
  
  // FrontDesk - Payments
  "payment.view": { resource: "thanh-toan", actions: ["list", "show"] },
  "payment.process": { resource: "thanh-toan", actions: ["create", "edit"] },
  "payment.refund": { resource: "thanh-toan", actions: ["delete"] },
  
  // FrontDesk - Properties
  "property.view": { resource: "co-so", actions: ["list", "show"] },
  "property.edit": { resource: "co-so", actions: ["edit"] },
  
  // F&B
  "restaurant.view": { resource: "nha-hang", actions: ["list", "show"] },
  "restaurant.manage": { resource: "nha-hang", actions: ["create", "edit", "delete"] },
  "tablebooking.view": { resource: "dat-ban", actions: ["list", "show"] },
  "tablebooking.create": { resource: "dat-ban", actions: ["create"] },
  "tablebooking.edit": { resource: "dat-ban", actions: ["edit"] },
  
  // Housekeeping
  "housekeeping.view": { resource: "phong-buong", actions: ["list", "show"] },
  "housekeeping.update": { resource: "phong-buong", actions: ["edit"] },
  
  // HR
  "employee.view": { resource: "nhan-vien", actions: ["list", "show"] },
  "employee.manage": { resource: "nhan-vien", actions: ["create", "edit", "delete"] },
  "attendance.view": { resource: "diem-danh", actions: ["list", "show"] },
  "attendance.manage": { resource: "diem-danh", actions: ["create", "edit"] },
  "leave.view": { resource: "nghi-phep", actions: ["list", "show"] },
  "leave.approve": { resource: "nghi-phep", actions: ["edit"] },
  "payroll.view": { resource: "luong", actions: ["list", "show"] },
  "payroll.process": { resource: "luong", actions: ["create", "edit"] },
  
  // Reports
  "report.revenue": { resource: "bao-cao-doanh-thu", actions: ["list", "show"] },
  "report.occupancy": { resource: "bao-cao-lap-day", actions: ["list", "show"] },
  "report.guest": { resource: "bao-cao-khach-hang", actions: ["list", "show"] },
  "report.staff": { resource: "bao-cao-nhan-vien", actions: ["list", "show"] },
  
  // System
  "user.view": { resource: "nguoi-dung", actions: ["list", "show"] },
  "user.create": { resource: "nguoi-dung", actions: ["create"] },
  "user.edit": { resource: "nguoi-dung", actions: ["edit"] },
  "user.delete": { resource: "nguoi-dung", actions: ["delete"] },
  "role.view": { resource: "vai-tro", actions: ["list", "show"] },
  "role.manage": { resource: "vai-tro", actions: ["create", "edit", "delete"] },
  "permission.assign": { resource: "phan-quyen", actions: ["edit"] },
};

/**
 * Check if user has specific permission
 */
function hasPermission(
  userPermissions: string[],
  resource: string,
  action: string
): boolean {
  // Check each permission
  for (const permSlug of userPermissions) {
    const mapping = permissionMapping[permSlug];
    if (!mapping) continue;

    // Check if permission matches resource and action
    if (mapping.resource === resource && mapping.actions.includes(action)) {
      return true;
    }
  }

  return false;
}

/**
 * Get user permissions from localStorage
 */
function getUserPermissions(): string[] {
  const userStr = localStorage.getItem("refine-user");
  if (!userStr) return [];

  try {
    const user = JSON.parse(userStr);
    // Permissions should be stored as array of permission slugs
    return user.permissions || [];
  } catch {
    return [];
  }
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    // Allow access to profile and property for all authenticated users
    if (resource === "profile" || resource === "property" || resource === "dashboard") {
      return { can: true };
    }

    // Get user permissions
    const userPermissions = getUserPermissions();

    if (userPermissions.length === 0) {
      return { 
        can: false, 
        reason: "Bạn chưa được cấp quyền truy cập" 
      };
    }

    // Check if user has permission for this resource and action
    const hasAccess = hasPermission(userPermissions, resource || '', action);

    return {
      can: hasAccess,
      reason: hasAccess 
        ? undefined 
        : `Bạn không có quyền ${action === 'create' ? 'tạo' : action === 'edit' ? 'sửa' : action === 'delete' ? 'xóa' : 'xem'} ${resource}`,
    };
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
    queryOptions: {
      enabled: true,
    },
  },
};

/**
 * Helper function to check permissions outside of Refine hooks
 */
export function checkPermission(resource: string, action: string): boolean {
  const userPermissions = getUserPermissions();
  return hasPermission(userPermissions, resource, action);
}

/**
 * Get all accessible resources for current user
 */
export function getAccessibleResources(): string[] {
  const userPermissions = getUserPermissions();
  const resources = new Set<string>();

  for (const permSlug of userPermissions) {
    const mapping = permissionMapping[permSlug];
    if (mapping) {
      resources.add(mapping.resource);
    }
  }

  return Array.from(resources);
}

/**
 * Check if user has any permission from a module
 */
export function hasModuleAccess(module: string): boolean {
  const userPermissions = getUserPermissions();
  return userPermissions.some(perm => {
    const [permModule] = perm.split('.');
    return permModule.toLowerCase() === module.toLowerCase();
  });
}
