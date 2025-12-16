import type { AuthProvider } from "@refinedev/core";
import { loginApi, getCurrentUser } from "./utils/api";
import type { User } from "./types/auth";

export const TOKEN_KEY = "refine-auth";
export const USER_KEY = "refine-user";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchUserPermissionsFromAPI = async (userId: string): Promise<{permissions: string[]; roleNames: string[]}> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return {permissions: [], roleNames: []};
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
      return {permissions: [], roleNames: []};
    }
    const employeeData = await employeeResponse.json();
    if (!employeeData) {
      console.warn("No employee found for user");
      return {permissions: [], roleNames: []};
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
      return {permissions: [], roleNames: []};
    }
    const employeeRoleData = await employeeRoleResponse.json();
    if (!employeeRoleData || employeeRoleData.length === 0) {
      console.warn("No roles assigned to employee");
      return {permissions: [], roleNames: []};
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
    return {permissions: [...new Set(permissions)], roleNames: employeeRoleData.map((er: any) => er.role?.name)};
  } catch (error) {
    console.error("Error fetching user permissions from API:", error);
    return {permissions: [], roleNames: []};
  }
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await loginApi(email, password);
      localStorage.setItem(TOKEN_KEY, response.access_token);
      const userResponse = await getCurrentUser();
      const user = userResponse.user || userResponse;
      console.log("Fetched user profile:", user);
      const permissions = await fetchUserPermissionsFromAPI(user.id);
      console.log("Fetched permissions from API:", permissions);
      const userWithPermissions = {
        ...user,
        roles: permissions.roleNames || [],
        permissions: permissions.permissions || [],
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userWithPermissions));
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.message || "Invalid email or password",
        },
      };
    }
  },
  
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        // const userResponse = await getCurrentUser();
        // const user = userResponse.user || userResponse;

        // console.log("Fetched user profile:", user);

        // const permissionsFromAPI = await fetchUserPermissionsFromAPI(user.id);
        // console.log("Fetched permissions from API:", permissionsFromAPI);
        
        // // Extract permission slugs from employee roles
        // const permissions: string[] = [];
        // if (user.employee?.employeeRoles) {
        //   for (const employeeRole of user.employee.employeeRoles) {
        //     if (employeeRole.role?.rolePermissions) {
        //       for (const rolePerm of employeeRole.role.rolePermissions) {
        //         if (rolePerm.permission?.slug) {
        //           permissions.push(rolePerm.permission.slug);
        //         }
        //       }
        //     }
        //   }
        // }
        
        // // Also extract role names for backward compatibility
        // const roles = user.employee?.employeeRoles?.map((er: any) => er.role?.name) || [];
        // const userWithPermissions = {
        //   ...user,
        //   roles,
        //   permissions: [...new Set(permissions)], // Remove duplicates
        // };
        
        // // Store user info
        // localStorage.setItem(USER_KEY, JSON.stringify(userWithPermissions));
        await getCurrentUser();
        return {
          authenticated: true,
        };
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return {
          authenticated: false,
          redirectTo: "/login",
          error: {
            message: "Session expired",
            name: "Unauthorized",
          },
        };
      }
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  
  getPermissions: async () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      const user: User = JSON.parse(userStr);
      return {
        roles: user.roles || [],
        permissions: user.permissions || [],
      };
    }
    return null;
  },
  
  getIdentity: async () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      const user: User = JSON.parse(userStr);
      return {
        id: user.id,
        name: user.name || user.employee?.fullName || user.email,
        email: user.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=1890ff&color=fff`,
        roles: user.roles,
      };
    }
    return null;
  },
  
  onError: async (error) => {
    if (error.statusCode === 401 || error.statusCode === 403) {
      return {
        redirectTo: "/login",
        logout: true,
        error,
      };
    }
    return { error };
  },
};
