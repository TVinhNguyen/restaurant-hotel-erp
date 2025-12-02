import { Authenticated, Refine } from "@refinedev/core";
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
import { authProvider } from "./authProvider";
import { dataProvider } from "./providers/dataProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { getResourcesByPermissions } from "./utils/resources";
import { DashboardAdmin } from "./pages/dashboards";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgotPassword";
import { DatPhongList, DatPhongCreate, DatPhongEdit, DatPhongShow } from "./pages/dat-phong";
import { PhongList } from "./pages/phong";
import { NhanVienList } from "./pages/nhan-vien";
import { KhachHangList, KhachHangCreate, KhachHangEdit, KhachHangShow } from "./pages/khach-hang";
import { PropertyInfo } from "./pages/property";

function App() {
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
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                title: { text: "Hotel Admin", icon: "🏨" },
              }}
              resources={getResourcesByPermissions([])}
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
                  <Route index element={<DashboardAdmin />} />
                  
                  {/* Đặt phòng */}
                  <Route path="/dat-phong">
                    <Route index element={<DatPhongList />} />
                    <Route path="create" element={<DatPhongCreate />} />
                    <Route path="edit/:id" element={<DatPhongEdit />} />
                    <Route path="show/:id" element={<DatPhongShow />} />
                  </Route>
                  
                  {/* Phòng */}
                  <Route path="/phong">
                    <Route index element={<PhongList />} />
                  </Route>
                  
                  {/* Nhân viên */}
                  <Route path="/nhan-vien">
                    <Route index element={<NhanVienList />} />
                  </Route>
                  
                  {/* Khách hàng */}
                  <Route path="/khach-hang">
                    <Route index element={<KhachHangList />} />
                    <Route path="create" element={<KhachHangCreate />} />
                    <Route path="edit/:id" element={<KhachHangEdit />} />
                    <Route path="show/:id" element={<KhachHangShow />} />
                  </Route>
                  
                  {/* Cơ sở */}
                  <Route path="/property">
                    <Route index element={<PropertyInfo />} />
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
