"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { GitHubBanner, Refine, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import React from "react";

import routerProvider from "@refinedev/nextjs-router";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
// import { mockDataProvider } from "@providers/data-provider/mockDataProvider";
import "@refinedev/antd/dist/reset.css";
import { authProvider } from "@providers/auth-provider/authProvider";


type RefineContextProps = {
  defaultMode?: string;
};

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>
) => {
  return <App {...props} />;
};

type AppProps = {
  defaultMode?: string;
};

const App = (props: React.PropsWithChildren<AppProps>) => {
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
                // {
                //   name: "blog_posts",
                //   list: "/blog-posts",
                //   create: "/blog-posts/create",
                //   edit: "/blog-posts/edit/:id",
                //   show: "/blog-posts/show/:id",
                //   meta: {
                //     canDelete: true,
                //   },
                // },
                // {
                //   name: "categories",
                //   list: "/categories",
                //   create: "/categories/create",
                //   edit: "/categories/edit/:id",
                //   show: "/categories/show/:id",
                //   meta: {
                //     canDelete: true,
                //   },
                // },
                {
                  name: "reservations",
                  list: "/reservations",
                  meta: {
                    label: "Reservations",
                    icon: "🏨",
                  },
                },
                {
                  name: "reservations-dashboard",
                  list: "/reservations/dashboard",
                  meta: {
                    label: "Dashboard",
                    parent: "reservations",
                    icon: "📊",
                  },
                },
                {
                  name: "reservations-list",
                  list: "/reservations",
                  create: "/reservations/create",
                  edit: "/reservations/:id/edit",
                  show: "/reservations/:id",
                  meta: {
                    label: "All Reservations",
                    parent: "reservations",
                    icon: "📋",
                    canDelete: true,
                  },
                },
                {
                  name: "payments",
                  list: "/reservations/payments",
                  meta: {
                    label: "Payments",
                    parent: "reservations",
                    icon: "💳",
                  },
                },
                {
                  name: "services",
                  list: "/reservations/services",
                  meta: {
                    label: "Services",
                    parent: "reservations",
                    icon: "🛎️",
                  },
                },
                {
                  name: "rate-plans",
                  list: "/reservations/rate-plans",
                  meta: {
                    label: "Rate Plans",
                    parent: "reservations",
                    icon: "💰",
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
                {
                  name: "inventory-management",
                  list: "/inventory-management",
                  meta: {
                    label: "Inventory Management",
                    icon: "🏠",
                  },
                },
                {
                  name: "room-types",
                  list: "/inventory-management/room-types",
                  create: "/inventory-management/room-types/create",
                  edit: "/inventory-management/room-types/edit/:id",
                  show: "/inventory-management/room-types/show/:id",
                  meta: {
                    label: "Room Types",
                    parent: "inventory-management",
                    icon: "🏨",
                    canDelete: true,
                  },
                },
                {
                  name: "rooms",
                  list: "/inventory-management/rooms",
                  create: "/inventory-management/rooms/create",
                  edit: "/inventory-management/rooms/edit/:id",
                  show: "/inventory-management/rooms/show/:id",
                  meta: {
                    label: "Rooms",
                    parent: "inventory-management",
                    icon: "🛏️",
                    canDelete: true,
                  },
                },
                {
                  name: "amenities",
                  list: "/inventory-management/amenities",
                  create: "/inventory-management/amenities/create",
                  edit: "/inventory-management/amenities/edit/:id",
                  show: "/inventory-management/amenities/show/:id",
                  meta: {
                    label: "Amenities",
                    parent: "inventory-management",
                    icon: "🛠️",
                    canDelete: true,
                  },
                },
                {
                  name: "photos",
                  list: "/inventory-management/photos",
                  meta: {
                    label: "Photos",
                    parent: "inventory-management",
                    icon: "📸",
                  },
                },
                {
                  name: "room-status-history",
                  list: "/inventory-management/room-status-history",
                  meta: {
                    label: "Status History",
                    parent: "inventory-management",
                    icon: "📋",
                  },
                },
                {
                  name: "room-maintenance",
                  list: "/inventory-management/room-maintenance",
                  meta: {
                    label: "Room Maintenance",
                    parent: "inventory-management",
                    icon: "🔧",
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
