import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayout,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import React, { useState, useEffect, useMemo } from "react";
import { authProvider } from "./authProvider";
import { TOKEN_KEY, USER_KEY } from "./authProvider";
import { accessControlProvider } from "./accessControlProvider";
import { dataProvider } from "./providers/dataProvider";
import { Header } from "./components/header";
import { Title } from "./components/layout/title";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { getResourcesByPermissions } from "./utils/resources";
import { User } from "./types/auth";

// Import pages
import { DashboardFrontDesk, DashboardAdmin } from "./pages/dashboards";
import { DatPhongList, DatPhongCreate, DatPhongEdit, DatPhongShow } from "./pages/dat-phong";
import { KhachHangList, KhachHangCreate, KhachHangEdit, KhachHangShow } from "./pages/khach-hang";
import { CheckInList } from "./pages/check-in";
import { CheckOutList } from "./pages/check-out";
import { PhongList } from "./pages/phong";
import { ThanhToanList } from "./pages/thanh-toan";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Profile } from "./pages/profile";
import { PropertyInfo } from "./pages/property";

function App() {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      const user: User = JSON.parse(userStr);
      setUserPermissions(user.permissions || []);
      setUserRoles(user.roles || []);
      setName(user.name || "");
    }
  }, []);

  const resources = useMemo(() => {
    const result = getResourcesByPermissions(userPermissions);
    return result;
  }, [userPermissions]);

  const getDashboardComponent = () => {
    if (userRoles.includes("Admin")) {
      return <DashboardAdmin />;
    }
    if (userPermissions.some(p => p.startsWith("reservation.") || p.startsWith("guest."))) {
      return <DashboardFrontDesk />;
    }
    return <div style={{ padding: "24px" }}>Chào mừng bạn đến với hệ thống quản lý khách sạn</div>;
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider()}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  title: { text: "Quản lý Khách sạn", icon: "🏨" },
                }}
                resources={resources}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={Header}
                          Sider={(props) => <ThemedSider {...props} fixed />}
                          Title={(props) => <Title {...props} name={name} role={userRoles[0]} />}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    {/* Dashboard routes */}
                    <Route
                      index
                      element={getDashboardComponent()}
                    />

                    <Route path="/profile" element={<Profile />} />
                    <Route path="/property" element={<PropertyInfo />} />

                    {/* Đặt phòng routes */}
                    <Route path="/dat-phong">
                      <Route index element={<DatPhongList />} />
                      <Route path="tao-moi" element={<DatPhongCreate />} />
                      <Route path="chinh-sua/:id" element={<DatPhongEdit />} />
                      <Route path="chi-tiet/:id" element={<DatPhongShow />} />
                    </Route>

                    {/* Khách hàng routes */}
                    <Route path="/khach-hang">
                      <Route index element={<KhachHangList />} />
                      <Route path="tao-moi" element={<KhachHangCreate />} />
                      <Route path="chinh-sua/:id" element={<KhachHangEdit />} />
                      <Route path="chi-tiet/:id" element={<KhachHangShow />} />
                    </Route>

                    {/* Check-in routes */}
                    <Route path="/check-in">
                      <Route index element={<CheckInList />} />
                    </Route>

                    {/* Check-out routes */}
                    <Route path="/check-out">
                      <Route index element={<CheckOutList />} />
                    </Route>

                    {/* Phòng routes */}
                    <Route path="/phong">
                      <Route index element={<PhongList />} />
                    </Route>

                    {/* Thanh toán routes */}
                    <Route path="/thanh-toan">
                      <Route index element={<ThanhToanList />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
