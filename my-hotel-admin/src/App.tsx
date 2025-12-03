import { Authenticated, CanAccess, Refine } from "@refinedev/core";
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
import { App as AntdApp, Result, Button } from "antd";
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { authProvider, USER_KEY } from "./authProvider";
import { dataProvider } from "./providers/dataProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { getResourcesByPermissions } from "./utils/resources";
import { DashboardWrapper } from "./pages/dashboards";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgotPassword";
import { DatPhongList, DatPhongCreate, DatPhongEdit, DatPhongShow } from "./pages/dat-phong";
import { PhongList } from "./pages/phong";
import { NhanVienList } from "./pages/nhan-vien";
import { KhachHangList, KhachHangCreate, KhachHangEdit, KhachHangShow } from "./pages/khach-hang";
import { PropertyInfo } from "./pages/property";
import { accessControlProvider } from "./accessControlProvider";

// Component hiển thị khi không có quyền truy cập
const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="Không có quyền truy cập"
      subTitle="Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên."
      extra={<Button type="primary" onClick={() => navigate("/")}>Về trang chủ</Button>}
    />
  );
};

function App() {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // Listen for changes in localStorage (after login)
  useEffect(() => {
    const loadPermissions = () => {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserPermissions(user.permissions || []);
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      } else {
        setUserPermissions([]);
      }
    };

    // Load initially
    loadPermissions();

    // Listen for storage changes
    window.addEventListener("storage", loadPermissions);
    
    // Custom event for same-tab updates
    window.addEventListener("userUpdated", loadPermissions);

    return () => {
      window.removeEventListener("storage", loadPermissions);
      window.removeEventListener("userUpdated", loadPermissions);
    };
  }, []);

  // Memoize resources based on permissions
  const resources = useMemo(() => {
    return getResourcesByPermissions(userPermissions);
  }, [userPermissions]);

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              dataProvider={dataProvider()}
              notificationProvider={useNotificationProvider}
              routerProvider={routerProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                title: { text: "Hotel Admin", icon: "🏨" },
              }}
              resources={resources}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="auth" fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayout Header={Header} Sider={(props) => <ThemedSider {...props} fixed />}>
                        <Outlet />
                      </ThemedLayout>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardWrapper />} />
                  
                  {/* Đặt phòng */}
                  <Route path="/dat-phong">
                    <Route index element={
                      <CanAccess resource="reservations" action="list" fallback={<AccessDenied />}>
                        <DatPhongList />
                      </CanAccess>
                    } />
                    <Route path="create" element={
                      <CanAccess resource="reservations" action="create" fallback={<AccessDenied />}>
                        <DatPhongCreate />
                      </CanAccess>
                    } />
                    <Route path="edit/:id" element={
                      <CanAccess resource="reservations" action="edit" fallback={<AccessDenied />}>
                        <DatPhongEdit />
                      </CanAccess>
                    } />
                    <Route path="show/:id" element={
                      <CanAccess resource="reservations" action="show" fallback={<AccessDenied />}>
                        <DatPhongShow />
                      </CanAccess>
                    } />
                  </Route>
                  
                  {/* Phòng */}
                  <Route path="/phong">
                    <Route index element={
                      <CanAccess resource="rooms" action="list" fallback={<AccessDenied />}>
                        <PhongList />
                      </CanAccess>
                    } />
                  </Route>
                  
                  {/* Nhân viên - chỉ Admin/HR mới có quyền */}
                  <Route path="/nhan-vien">
                    <Route index element={
                      <CanAccess resource="nhan-vien" action="list" fallback={<AccessDenied />}>
                        <NhanVienList />
                      </CanAccess>
                    } />
                  </Route>
                  
                  {/* Khách hàng */}
                  <Route path="/khach-hang">
                    <Route index element={
                      <CanAccess resource="guests" action="list" fallback={<AccessDenied />}>
                        <KhachHangList />
                      </CanAccess>
                    } />
                    <Route path="create" element={
                      <CanAccess resource="guests" action="create" fallback={<AccessDenied />}>
                        <KhachHangCreate />
                      </CanAccess>
                    } />
                    <Route path="edit/:id" element={
                      <CanAccess resource="guests" action="edit" fallback={<AccessDenied />}>
                        <KhachHangEdit />
                      </CanAccess>
                    } />
                    <Route path="show/:id" element={
                      <CanAccess resource="guests" action="show" fallback={<AccessDenied />}>
                        <KhachHangShow />
                      </CanAccess>
                    } />
                  </Route>
                  
                  {/* Cơ sở */}
                  <Route path="/property">
                    <Route index element={
                      <CanAccess resource="property" action="list" fallback={<AccessDenied />}>
                        <PropertyInfo />
                      </CanAccess>
                    } />
                  </Route>
                  
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route element={<Authenticated key="auth-pages" fallback={<Outlet />}><NavigateToResource /></Authenticated>}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
