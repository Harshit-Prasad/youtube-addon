import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./providers/SocketProvider";
import Home from "./routes/Home";
import Auth from "./routes/Auth";
import AuthProtector from "./protected-route/AuthProtector";
import ProtectedRoute from "./protected-route/ProtectedRoute";
import Welcome from "./routes/Welcome";
import AdminProtected from "./protected-route/AdminProtected";
import Dashboard from "./routes/admin/Dashboard";
import CreatePage from "./routes/admin/CreatePage";
import AdminRAH from "./routes/admin/AdminRAH";
import PrivateStream from "./routes/admin/PrivateStream";
import UserProtected from "./protected-route/UserProtected";
import NavigateTo from "./routes/user/NavigateTo";
import MainStream from "./routes/user/MainStream";
import Settings from "./routes/Settings";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index={true} path="/" element={<Home />} />
      <Route element={<AuthProtector />}>
        <Route path="/auth" element={<Auth />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/settings" element={<Settings />} />

        <Route element={<AdminProtected />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-page" element={<CreatePage />} />
          <Route path="/private-stream/:roomId" element={<PrivateStream />} />
          <Route
            path="/admin-rah/:roomId"
            element={
              <SocketProvider>
                <AdminRAH />
              </SocketProvider>
            }
          />
        </Route>
        <Route element={<UserProtected />}>
          <Route path="/navigate-to" element={<NavigateTo />} />
          <Route
            path="/main-stream/:roomId"
            element={
              <SocketProvider>
                <MainStream />
              </SocketProvider>
            }
          />
        </Route>
      </Route>
    </>
  )
);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  );
}
