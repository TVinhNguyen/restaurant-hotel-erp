"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { GitHubBanner, Refine, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import React from "react";

import routerProvider from "@refinedev/nextjs-router";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
// import { dataProvider } from "@providers/data-provider";
import { mockDataProvider } from "@providers/data-provider/mockDataProvider";
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
              dataProvider={mockDataProvider}
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
                  name: "new-booking",
                  list: "/reservations/new",
                  meta: {
                    label: "New Booking Wizard",
                    parent: "reservations",
                    icon: "✨",
                  },
                },
                {
                  name: "reservations-dashboard",
                  list: "/reservations/dashboard",
                  meta: {
                    label: "Booking Dashboard",
                    parent: "reservations",
                    icon: "📊",
                  },
                },
                {
                  name: "booking-pipeline",
                  list: "/reservations/booking-pipeline",
                  create: "/reservations/new",
                  edit: "/reservations/edit/:id",
                  show: "/reservations/show/:id",
                  meta: {
                    label: "Booking Pipeline",
                    parent: "reservations",
                    icon: "📋",
                    canDelete: true,
                  },
                },
                {
                  name: "availability-pricing",
                  list: "/reservations/availability-pricing",
                  meta: {
                    label: "Availability & Pricing",
                    parent: "reservations",
                    icon: "💰",
                  },
                },
                {
                  name: "room-assignment",
                  list: "/reservations/room-assignment",
                  meta: {
                    label: "Room Assignment",
                    parent: "reservations",
                    icon: "🛏️",
                  },
                },
                {
                  name: "stay-operations",
                  list: "/reservations/stay-operations",
                  meta: {
                    label: "Stay Operations",
                    parent: "reservations",
                    icon: "🚪",
                  },
                },
                {
                  name: "payments-folio",
                  list: "/reservations/payments-folio",
                  meta: {
                    label: "Payments & Folio",
                    parent: "reservations",
                    icon: "💳",
                  },
                },
                {
                  name: "reservation-services",
                  list: "/reservations/services",
                  meta: {
                    label: "Services",
                    parent: "reservations",
                    icon: "🛎️",
                  },
                },
                {
                  name: "reservation-reports",
                  list: "/reservations/reports",
                  meta: {
                    label: "Reports & Analytics",
                    parent: "reservations",
                    icon: "📈",
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
