"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { GitHubBanner, Refine, type AuthProvider } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

import routerProvider from "@refinedev/nextjs-router";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";

type RefineContextProps = {
  defaultMode?: string;
};

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>
) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  );
};

type AppProps = {
  defaultMode?: string;
};

const App = (props: React.PropsWithChildren<AppProps>) => {
  const { data, status } = useSession();
  const to = usePathname();

  if (status === "loading") {
    return <span>loading...</span>;
  }

  const authProvider: AuthProvider = {
    login: async () => {
      signIn("auth0", {
        callbackUrl: to ? to.toString() : "/",
        redirect: true,
      });

      return {
        success: true,
      };
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: "/login",
      });

      return {
        success: true,
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return {
        error,
      };
    },
    check: async () => {
      if (status === "unauthenticated") {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    },
    getPermissions: async () => {
      return null;
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data;
        return {
          name: user.name,
          avatar: user.image,
        };
      }

      return null;
    },
  };

  const defaultMode = props?.defaultMode;

  return (
    <>
      <RefineKbarProvider>
        <AntdRegistry>
          <ColorModeContextProvider defaultMode={defaultMode}>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              resources={[
                {
                  name: "blog_posts",
                  list: "/blog-posts",
                  create: "/blog-posts/create",
                  edit: "/blog-posts/edit/:id",
                  show: "/blog-posts/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "categories",
                  list: "/categories",
                  create: "/categories/create",
                  edit: "/categories/edit/:id",
                  show: "/categories/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "hr-management",
                  list: "/hr-management",
                  meta: {
                    label: "HR Management",
                    icon: "👥",
                  },
                },
                {
                  name: "hr-dashboard",
                  list: "/hr-management/dashboard",
                  meta: {
                    label: "HR Dashboard",
                    parent: "hr-management",
                    icon: "📊",
                  },
                },
                {
                  name: "employees",
                  list: "/hr-management/employees",
                  create: "/hr-management/create",
                  edit: "/hr-management/edit/:id",
                  show: "/hr-management/show/:id",
                  meta: {
                    label: "Employee Management",
                    parent: "hr-management",
                    icon: "👤",
                    canDelete: true,
                  },
                },
                {
                  name: "attendance",
                  list: "/hr-management/attendance",
                  meta: {
                    label: "Attendance Tracking",
                    parent: "hr-management",
                    icon: "🕐",
                  },
                },
                {
                  name: "leaves",
                  list: "/hr-management/leaves",
                  meta: {
                    label: "Leave Management",
                    parent: "hr-management",
                    icon: "📅",
                  },
                },
                {
                  name: "payroll",
                  list: "/hr-management/payroll",
                  meta: {
                    label: "Payroll Management",
                    parent: "hr-management",
                    icon: "💰",
                  },
                },
                {
                  name: "evaluations",
                  list: "/hr-management/evaluations",
                  meta: {
                    label: "Employee Evaluations",
                    parent: "hr-management",
                    icon: "⭐",
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
              }}
            >
              {props.children}
              <RefineKbar />
            </Refine>
          </ColorModeContextProvider>
        </AntdRegistry>
      </RefineKbarProvider>
    </>
  );
};
