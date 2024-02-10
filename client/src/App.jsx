import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import PrivateStream from "./pages/private-stream/PrivateStream";
import CreatePage from "./pages/create-page/CreatePage";
import Auth from "./pages/auth/Auth";
import WelcomePage from "./pages/welcome-page/WelcomePage";
import PublicStream from "./pages/public-stream/PublicStream";
import MainStream from "./pages/main-stream/MainStream";
import AuthOnlyRoute from "./protected-routes/auth-only-route/AuthOnlyRoute";
import AdminOnlyRoute from "./protected-routes/admin-only-route/AdminOnlyRoute";
import UserOnlyRoute from "./protected-routes/user-only-route/UserOnlyRoute";
import NotAuthorizedOnly from "./protected-routes/not-authorized-only/NotAuthorizedOnly";
import AdminRAH from "./pages/admin-rah/AdminRAH";
import SocketProvider from "./providers/SocketProvider";
import { Toaster } from "react-hot-toast";
import NotAuthorizedOnlyStream from "./protected-routes/not-authorized-only-stream/NotAuthorizedOnlyStream";

const router = createBrowserRouter([
  {
    element: <AuthOnlyRoute />,
    children: [
      {
        element: <AdminOnlyRoute />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/create-page",
            element: <CreatePage />,
          },
          {
            path: "/private-stream/:idx",
            element: <PrivateStream />,
          },
          {
            path: "/admin-rah/:idx",
            element: (
              <SocketProvider>
                <AdminRAH />
              </SocketProvider>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <AuthOnlyRoute />,
    children: [
      {
        path: "/welcome",
        element: <WelcomePage />,
      },
    ],
  },
  {
    element: <UserOnlyRoute />,
    children: [
      {
        path: "/main-stream/:idx",
        element: (
          <SocketProvider>
            <MainStream />
          </SocketProvider>
        ),
      },
    ],
  },
  {
    element: <NotAuthorizedOnly />,
    children: [
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
  {
    element: <NotAuthorizedOnlyStream />,
    children: [
      {
        path: "/public-stream/:idx",
        element: <PublicStream />,
      },
    ],
  },
]);

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
