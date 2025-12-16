import { TOKEN_KEY, USER_KEY } from "../authProvider";
import { User } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

const fetchUserPermissionsFromAPI = async (userId: string): Promise<string[]> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return [];
    const employeeResponse = await fetch(
      `${API_URL}/employees/get-employee-by-user-id/${userId}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!employeeResponse.ok) {
      console.error("Failed to fetch employee");
      return [];
    }
    const employeeData = await employeeResponse.json();
    if (!employeeData) {
      console.warn("No employee found for user");
      return [];
    }
    const employeeId = employeeData.id;
    const employeeRoleResponse = await fetch(
      `${API_URL}/employee-roles?employeeId=${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!employeeRoleResponse.ok) {
      console.error("Failed to fetch employee roles");
      return [];
    }
    const employeeRoleData = await employeeRoleResponse.json();
    if (!employeeRoleData || employeeRoleData.length === 0) {
      console.warn("No roles assigned to employee");
      return [];
    }
    const roleIds = employeeRoleData.map((er: any) => er.roleId);
    const permissionIds: string[] = [];
    const permissions: string[] = [];
    for (const roleId of roleIds) {
      const rolePermissionResponse = await fetch(
        `${API_URL}/roles/${roleId}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (rolePermissionResponse.ok) {
        const rolePermissionData = await rolePermissionResponse.json();
        console.log("RolePermission data for roleId", roleId, ":", rolePermissionData);
        if (rolePermissionData && rolePermissionData.length > 0) {
          const pIds = rolePermissionData.map((rp: any) => rp.permissionId);
          const slugs = rolePermissionData.map((rp: any) => rp.permission?.slug).filter((slug: string) => slug);
          permissions.push(...slugs);
          permissionIds.push(...pIds);
        }
      }
    }
    return permissions;
  } catch (error) {
    console.error("Error fetching user permissions from API:", error);
    return [];
  }
};

/**
 * Fetch roles từ backend
 */
// const fetchUserRolesFromAPI = async (userId: string): Promise<string[]> => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) return [];

//     // Step 1: Get Employee ID
//     const employeeResponse = await fetch(
//       `${API_URL}/employees?filters[userId]=${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!employeeResponse.ok) return [];

//     const employeeData = await employeeResponse.json();
//     if (!employeeData.data || employeeData.data.length === 0) return [];

//     const employeeId = employeeData.data[0].id;

//     // Step 2: Get Role IDs từ EmployeeRole
//     const employeeRoleResponse = await fetch(
//       `${API_URL}/employee-roles?filters[employeeId]=${employeeId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!employeeRoleResponse.ok) return [];

//     const employeeRoleData = await employeeRoleResponse.json();
//     if (!employeeRoleData.data || employeeRoleData.data.length === 0) return [];

//     const roleIds = employeeRoleData.data.map((er: any) => er.roleId);

//     // Step 3: Get Role names
//     const roles: string[] = [];

//     for (const roleId of roleIds) {
//       const roleResponse = await fetch(`${API_URL}/roles/${roleId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (roleResponse.ok) {
//         const roleData = await roleResponse.json();
//         if (roleData.data?.name) {
//           roles.push(roleData.data.name);
//         }
//       }
//     }

//     return roles;
//   } catch (error) {
//     console.error("Error fetching user roles from API:", error);
//     return [];
//   }
// };

/**
 * Get permissions - ưu tiên từ cache, fallback query API
 */
// export const getCurrentUserPermissions = (): string[] => {
//   try {
//     const userStr = localStorage.getItem(USER_KEY);
//     if (!userStr) return [];
    
//     const user: User = JSON.parse(userStr);

//     // Nếu đã có permissions trong cache (từ authProvider)
//     if (user.permissions && user.permissions.length > 0) {
//       return user.permissions;
//     }

//     // Fallback: Extract từ nested structure nếu có
//     if (user.employee?.employeeRoles) {
//       const permissions: string[] = [];
//       user.employee.employeeRoles.forEach((employeeRole) => {
//         if (employeeRole.role?.rolePermissions) {
//           employeeRole.role.rolePermissions.forEach((rolePermission) => {
//             if (rolePermission.permission?.slug) {
//               permissions.push(rolePermission.permission.slug);
//             }
//           });
//         }
//       });
//       return [...new Set(permissions)];
//     }

//     return [];
//   } catch (error) {
//     console.error("Error getting user permissions:", error);
//     return [];
//   }
// };

/**
 * Refresh permissions bằng cách query lại từ API
 */
// export const refreshUserPermissions = async (): Promise<boolean> => {
//   try {
//     const userStr = localStorage.getItem(USER_KEY);
//     if (!userStr) return false;
//     return true;
//   } catch (error) {
//     console.error("Error refreshing user permissions:", error);
//     return false;
//   }
// };

// /**
//  * Get roles - ưu tiên từ cache
//  */
// export const getCurrentUserRoles = (): string[] => {
//   try {
//     const userStr = localStorage.getItem(USER_KEY);
//     if (!userStr) return [];
    
//     const user: User = JSON.parse(userStr);

//     // Nếu đã có roles trong cache
//     if (user.roles && user.roles.length > 0) {
//       return user.roles;
//     }

//     // Fallback: Extract từ nested structure
//     if (user.employee?.employeeRoles) {
//       const roles: string[] = [];
//       user.employee.employeeRoles.forEach((employeeRole) => {
//         if (employeeRole.role?.name) {
//           roles.push(employeeRole.role.name);
//         }
//       });
//       return [...new Set(roles)];
//     }

//     return [];
//   } catch (error) {
//     console.error("Error getting user roles:", error);
//     return [];
//   }
// };

// export const hasPermission = (permission: string): boolean => {
//   const permissions = getCurrentUserPermissions();
//   return permissions.includes(permission);
// };

// export const hasAnyPermission = (permissions: string[]): boolean => {
//   const userPermissions = getCurrentUserPermissions();
//   return permissions.some(p => userPermissions.includes(p));
// };

// export const hasAllPermissions = (permissions: string[]): boolean => {
//   const userPermissions = getCurrentUserPermissions();
//   return permissions.every(p => userPermissions.includes(p));
// };

// export const hasModulePermission = (module: string): boolean => {
//   const permissions = getCurrentUserPermissions();
//   return permissions.some(p => p.startsWith(`${module}.`));
// };

// export const getModulePermissions = (module: string): string[] => {
//   const permissions = getCurrentUserPermissions();
//   return permissions.filter(p => p.startsWith(`${module}.`));
// };

// export const hasRole = (roleName: string): boolean => {
//   const roles = getCurrentUserRoles();
//   return roles.includes(roleName);
// };

// export const hasAnyRole = (roleNames: string[]): boolean => {
//   const roles = getCurrentUserRoles();
//   return roleNames.some(r => roles.includes(r));
// };

// export const getCurrentUser = (): User | null => {
//   try {
//     const userStr = localStorage.getItem(USER_KEY);
//     if (!userStr) return null;
//     return JSON.parse(userStr);
//   } catch (error) {
//     console.error("Error getting current user:", error);
//     return null;
//   }
// };

export const PERMISSIONS = {
  RESERVATION_VIEW: "reservation.view",
  RESERVATION_CREATE: "reservation.create",
  RESERVATION_EDIT: "reservation.edit",
  RESERVATION_CANCEL: "reservation.cancel",
  RESERVATION_CHECKIN: "reservation.checkin",
  RESERVATION_CHECKOUT: "reservation.checkout",
  
  GUEST_VIEW: "guest.view",
  GUEST_EDIT: "guest.edit",
  
  ROOM_VIEW: "room.view",
  ROOM_EDIT: "room.edit",
  ROOMTYPE_MANAGE: "roomtype.manage",
  
  PAYMENT_VIEW: "payment.view",
  PAYMENT_PROCESS: "payment.process",
  PAYMENT_REFUND: "payment.refund",
  
  PROPERTY_VIEW: "property.view",
  PROPERTY_EDIT: "property.edit",
  
  RESTAURANT_VIEW: "restaurant.view",
  RESTAURANT_MANAGE: "restaurant.manage",
  
  TABLE_BOOKING_VIEW: "tablebooking.view",
  TABLE_BOOKING_CREATE: "tablebooking.create",
  TABLE_BOOKING_EDIT: "tablebooking.edit",
  
  HOUSEKEEPING_VIEW: "housekeeping.view",
  HOUSEKEEPING_UPDATE: "housekeeping.update",
  
  EMPLOYEE_VIEW: "employee.view",
  EMPLOYEE_MANAGE: "employee.manage",
  
  ATTENDANCE_VIEW: "attendance.view",
  ATTENDANCE_MANAGE: "attendance.manage",
  
  LEAVE_VIEW: "leave.view",
  LEAVE_APPROVE: "leave.approve",
  
  PAYROLL_VIEW: "payroll.view",
  PAYROLL_PROCESS: "payroll.process",
  
  REPORT_REVENUE: "report.revenue",
  REPORT_OCCUPANCY: "report.occupancy",
  REPORT_STAFF: "report.staff",
  REPORT_GUEST: "report.guest",
  
  USER_VIEW: "user.view",
  USER_CREATE: "user.create",
  USER_EDIT: "user.edit",
  USER_DELETE: "user.delete",
  
  ROLE_VIEW: "role.view",
  ROLE_MANAGE: "role.manage",
  
  PERMISSION_ASSIGN: "permission.assign",
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];